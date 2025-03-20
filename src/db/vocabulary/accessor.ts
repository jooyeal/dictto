import { prisma } from "@/lib/prisma";
import {
  TCreateVocabularies,
  TDeleteVocabulary,
  TUpdateStatusStudied,
} from "./schema";
import { Vocabulary } from "@prisma/client";

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
    const vocabularies: Vocabulary[] = await prisma.$queryRaw`
  SELECT * FROM "Vocabulary"
  WHERE "isPassed" = false
  ORDER BY RANDOM()
`;
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

export async function updateStatusStudied(data: TUpdateStatusStudied) {
  const { id, isPassed } = data;
  try {
    await prisma.vocabulary.update({
      data: { isPassed, studiedCount: { increment: 1 } },
      where: {
        id,
      },
    });
  } catch (e) {
    console.log("errorororor");
    console.error(e);
    throw e;
  }
}
