"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { modifyVocabularySetting } from "@/services/vocabulary";
import { zodResolver } from "@hookform/resolvers/zod";
import { VocabularySetting } from "@prisma/client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  data: VocabularySetting[];
};

const formSchema = z.object({
  id: z.number(),
  perVocabulary: z.coerce
    .number()
    .int()
    .positive()
    .min(1, { message: "Please enter a number over 1" }),
});

export function VocabularySettingsForm({ data }: Props) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data.find((setting) => setting.name === "TAKE_COUNT")?.id,
      perVocabulary: Number(
        data.find((setting) => setting.name === "TAKE_COUNT")?.value
      ),
    },
  });

  const onSubmit = ({ id, perVocabulary }: z.infer<typeof formSchema>) => {
    return modifyVocabularySetting({ id, value: String(perVocabulary) })
      .then(() => {
        toast({ title: "Settings modified successfully " });
      })
      .catch(() => {
        toast({ title: "Failed to modify", variant: "destructive" });
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="perVocabulary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Number of vocabulary words to learn at a time
              </FormLabel>
              <FormControl>
                <Input type="number" min={1} max={20} {...field} />
              </FormControl>
              <FormDescription>
                This number decides how many vocabulary words you'll learn at a
                time.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full"
          type="submit"
          size="sm"
          disabled={form.formState.isSubmitting}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
