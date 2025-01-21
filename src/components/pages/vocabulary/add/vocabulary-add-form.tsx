"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addVocabularies } from "@/services/vocabulary/controller";
import { useToast } from "@/hooks/use-toast";

type Props = {
  userId?: string;
};

const formSchema = z.object({
  vocabularies: z.string().min(1, { message: "Please enter vocabulry" }),
});

export function VocabularyAddForm({ userId }: Props) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vocabularies: "",
    },
  });

  const onSubmit = ({ vocabularies }: z.infer<typeof formSchema>) => {
    if (!userId) return;
    return addVocabularies({ userId, vocabularies })
      .then(() => {
        toast({ title: "Vocabulary added successfully" });
        form.reset();
      })
      .catch(() => {
        toast({ title: "Failed to add", variant: "destructive" });
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="vocabularies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add vocabulary</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none"
                  rows={3}
                  disabled={form.formState.isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                If you want to add multiple vocabulary, separate them with a
                comma (,). For example: apple, banana
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
