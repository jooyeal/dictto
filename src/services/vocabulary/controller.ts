"use server";

import {
  createVocabularies,
  createVocabulariesSchema,
  deleteVocabularies,
  getRandomVocabularies,
  getVocabularySetting,
  TCreateVocabularies,
  TDeleteVocabulary,
  TUpdateVocabularySetting,
  updateVocabularySetting,
} from "@/db/vocabulary";
import { TAddVocabularies } from "./type";
import { ERROR_AI, ERROR_WRONG_TYPE } from "@/constants/messages";
import OpenAI from "openai";
import { revalidatePath } from "next/cache";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function fetchRandomVocabularies() {
  try {
    const takeCount = await getVocabularySetting("TAKE_COUNT");
    const vocabularies = await getRandomVocabularies(
      Number(takeCount?.value ?? 5)
    );
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

export async function modifyVocabularySetting(data: TUpdateVocabularySetting) {
  try {
    await updateVocabularySetting(data);
    revalidatePath("/main/vocabulary/settings");
  } catch (e) {
    console.error(e);
    throw e;
  }
}
