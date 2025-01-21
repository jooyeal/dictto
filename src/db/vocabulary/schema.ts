import { z } from "zod";

export const createVocabulariesSchema = z
  .object({
    userId: z.string(),
    content: z.string(),
    meaning: z.string(),
  })
  .array();
export const deleteVocabulariesSchema = z.object({ ids: z.string().array() });
export const updateVocabularySettingSchema = z.object({
  id: z.number(),
  value: z.string(),
});

export type TCreateVocabularies = z.infer<typeof createVocabulariesSchema>;
export type TDeleteVocabulary = z.infer<typeof deleteVocabulariesSchema>;
export type TUpdateVocabularySetting = z.infer<
  typeof updateVocabularySettingSchema
>;
