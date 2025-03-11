import { fetchRandomVocabularies } from "@/services/vocabulary";
import React from "react";
import { VocabularyStudyCarousel } from "./vocabulary-study-carousel";

export async function VocabularyStudy() {
  const vocabularies = await fetchRandomVocabularies();
  return <VocabularyStudyCarousel data={vocabularies} />;
}
