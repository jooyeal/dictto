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
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {};

const formSchema = z.object({
  id: z.number(),
  perVocabulary: z.coerce
    .number()
    .int()
    .positive()
    .min(1, { message: "Please enter a number over 1" }),
});

export function VocabularySettingsForm() {
  const { toast } = useToast();

  return <div></div>;
}
