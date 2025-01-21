import { getRandomVocabularies } from "@/db/vocabulary";
import React from "react";

export async function VocabularyStudy() {
  const vocabularies = await getRandomVocabularies();
  console.log(vocabularies);
  return <div>vocabulary-study</div>;
}
