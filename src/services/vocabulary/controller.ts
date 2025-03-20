"use server";

import {
  createVocabularies,
  createVocabulariesSchema,
  deleteVocabularies,
  getRandomVocabularies,
  TCreateVocabularies,
  TDeleteVocabulary,
  TUpdateStatusStudied,
  updateStatusStudied,
} from "@/db/vocabulary";
import { TAddVocabularies, TCheckSentences } from "./type";
import { ERROR_AI, ERROR_WRONG_TYPE } from "@/constants/messages";
import OpenAI from "openai";
import { revalidatePath } from "next/cache";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function fetchRandomVocabularies() {
  try {
    const vocabularies = await getRandomVocabularies();
    return vocabularies;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function addVocabularies(
  data: TAddVocabularies,
  disableReValidation?: boolean
) {
  try {
    // make dictionary with gpt
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
          You are a vocabulary assistant.
          The user will enter vocabularies that are sperated with comma(,).
          You have to explain meaning of each vocabulary, and when you display the user the explanation you have to follow the rules below
          The each result must be like below's array, and don't provide any other information except array.
          If only one object is contained made it array with one element.
          The user may provide a vocabulary in a non-base form (e.g., writing 'likes' instead of 'like'), but you should interpret it as its base form
          {
            content: {vocabulary that is user entered. if vocabulary is wrong, fix the spell.}
            meaning: {vocabulary's meaning. explain it in details as much as you possible}
            examples: {vocabulary's example sentences. it's string array, you have to provide 3 sentences}
          }
          Finally, change the array to JSON, and it can be parsed using JSON.parse function.
          `,
        },
        {
          role: "user",
          content: data.vocabularies,
        },
      ],
    });

    const result = completion.choices[0].message.content;

    // check if gpt made dictionary successfully
    if (!result) {
      throw new Error(ERROR_AI);
    }

    if (result === "[]") {
      throw new Error("Empty");
    }

    // change JSON to Array
    const vocabulariesData = JSON.parse(result) as TCreateVocabularies;
    const vocabulariesDataWithUserId = vocabulariesData.map((vocabulary) => ({
      ...vocabulary,
      userId: data.userId,
    }));

    // validate data with zod
    const validate = createVocabulariesSchema.safeParse(
      vocabulariesDataWithUserId
    );

    // check if validate is success
    if (!validate.success) throw new Error(ERROR_WRONG_TYPE);

    // excute db manipulation
    await createVocabularies(vocabulariesDataWithUserId);
    !disableReValidation && revalidatePath("/main/vocabulary/add");
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function removeVocabularies(data: TDeleteVocabulary) {
  try {
    await deleteVocabularies(data);
    revalidatePath("/main/vocabulary/add");
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function checkSentences(data: TCheckSentences) {
  try {
    // make dictionary with gpt
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
          You are an English assistant.
          You need to check grammar and verify whether the given word is used appropriately in the sentence.
          You should also provide feedback on whether there is a more suitable expression.

          If the given sentence is appropriate, return "GOOD"; if it is not appropriate, return "BAD".

          The user will ask you questions in the following JSON format:
          
          {
            "vocabulary": "{given word}",
            "sentence": "{sentence written by the user using the given word}"
          }

          Your response should be in the following JSON format:
          {
          "result": "{GOOD or BAD}",
          "feedback": "{Check grammar, confirm whether the given word is used appropriately, and provide feedback on more suitable expressions if necessary.}"
          }
          `,
        },
        {
          role: "user",
          content: JSON.stringify(data),
        },
      ],
    });

    const result = completion.choices[0].message.content;

    // check if gpt made dictionary successfully
    if (!result) {
      throw new Error(ERROR_AI);
    }

    if (result === "[]") {
      throw new Error("Empty");
    }

    // change JSON to Array
    const parsedResult = JSON.parse(result) as {
      result: "GOOD" | "BAD";
      feedback: string;
    };

    return parsedResult;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function modifyStatusStudied(data: TUpdateStatusStudied) {
  try {
    await updateStatusStudied(data);
  } catch (e) {
    console.error(e);
    throw e;
  }
}
