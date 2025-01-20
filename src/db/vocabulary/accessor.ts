import { prisma } from "@/lib/prisma";
import { TCreateVocabularies } from "./schema";

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
