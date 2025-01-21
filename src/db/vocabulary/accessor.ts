import { prisma } from "@/lib/prisma";
import {
  TCreateVocabularies,
  TDeleteVocabulary,
  TUpdateVocabularySetting,
} from "./schema";
import { VocabularySettingName } from "@prisma/client";

export async function getVocabularies() {
  try {
    const vocabularies = await prisma.vocabulary.findMany();
    return vocabularies;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function getRandomVocabularies() {
  try {
    const productsCount = await prisma.vocabulary.count();
    const skip = Math.floor(Math.random() * productsCount);
    const vocabularies = await prisma.vocabulary.findMany({
      take: 5,
      skip,
    });
    return vocabularies;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function createVocabularies(data: TCreateVocabularies) {
  try {
    await prisma.vocabulary.createMany({
      data,
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function deleteVocabularies(data: TDeleteVocabulary) {
  try {
    await prisma.vocabulary.deleteMany({ where: { id: { in: data.ids } } });
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function getVocabularySettings() {
  try {
    const settings = await prisma.vocabularySetting.findMany();
    return settings;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function getVocabularySetting(name: VocabularySettingName) {
  try {
    const setting = await prisma.vocabularySetting.findUnique({
      where: {
        name,
      },
    });
    return setting;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function updateVocabularySetting(data: TUpdateVocabularySetting) {
  try {
    await prisma.vocabularySetting.update({
      data: { value: data.value },
      where: {
        id: data.id,
      },
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
}
