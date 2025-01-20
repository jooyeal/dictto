"use server";

import { createVocabularies, getRandomVocabularies } from "@/db/vocabulary";
import {
  createVocabulariesSchema,
  TCreateVocabularies,
} from "@/db/vocabulary/schema";
import { TAddVocabularies } from "./type";
import OpenAI from "openai";
import { ERROR_AI, ERROR_WRONG_TYPE } from "@/constants/messages";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function fetchRandomVocabularies() {
  try {
    const vocabularies = await getRandomVocabularies();
    return vocabularies;
  } catch {}
}

export async function addVocabularies(data: TAddVocabularies) {
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
          The each result must be like this. it's going to be JSON. if only one content is contained made it array with one element
          {
            content: {vocabulary that is user entered}
            meaning: {vocabulary's meaning}
            examples: {vocabulary's example sentences. it's string array, you have to provide 3 sentences}
          }
          `,
        },
        {
          role: "user",
          content: data.vocabularies,
        },
      ],
    });

    // check if gpt made dictionary successfully
    if (!completion.choices[0].message.content) {
      throw new Error(ERROR_AI);
    }

    // change JSON to Array
    const vocabulariesData = JSON.parse(
      completion.choices[0].message.content
    ) as TCreateVocabularies;
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
  } catch (e: any) {
    console.error(e);
    throw e;
  }
}
