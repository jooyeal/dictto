import { z } from "zod";

export const createVocabulariesSchema = z
  .object({
    userId: z.string(),
    content: z.string(),
    meaning: z.string(),
  })
  .array();
export const deleteVocabulariesSchema = z.object({ ids: z.string().array() });
export const updateStatusStudiedSchema = z.object({
  id: z.string(),
  isPassed: z.boolean(),
});

export type TCreateVocabularies = z.infer<typeof createVocabulariesSchema>;
export type TDeleteVocabulary = z.infer<typeof deleteVocabulariesSchema>;
export type TUpdateStatusStudied = z.infer<typeof updateStatusStudiedSchema>;
