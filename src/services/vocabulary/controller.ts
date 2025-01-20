import { createVocabularies, getRandomVocabularies } from "@/db/vocabulary";
import {
  createVocabulariesSchema,
  TCreateVocabularies,
} from "@/db/vocabulary/schema";
import { TAddVocabularies } from "./type";

export async function fetchRandomVocabularies() {
  try {
    const vocabularies = await getRandomVocabularies();
    return vocabularies;
  } catch {}
}

export async function addVocabularies(data: TAddVocabularies) {
  try {
    console.log(data);
    // const validate = createVocabulariesSchema.safeParse(data);
    // if (validate.success) {
    //   await createVocabularies(data);
    // }
  } catch {}
}
