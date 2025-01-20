import { z } from "zod";

export const createVocabulariesSchema = z
  .object({
    userId: z.string(),
    content: z.string(),
    meaning: z.string(),
  })
  .array();

export type TCreateVocabularies = z.infer<typeof createVocabulariesSchema>;
