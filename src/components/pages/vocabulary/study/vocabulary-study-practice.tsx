import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { checkSentences } from "@/services/vocabulary";
import { CheckCircleIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  vocabulary: string;
  onPracticeOver: () => void;
};

const formSchema = z.object({
  content: z.string(),
  success: z.boolean(),
  error: z.boolean(),
  feedback: z.string(),
  successCount: z.number(),
});

export default function VocabularyStudyPractice({
  vocabulary,
  onPracticeOver,
}: Props) {
  const { toast } = useToast();
  const { register, handleSubmit, setValue, watch, formState } = useForm<
    z.infer<typeof formSchema>
  >({
    defaultValues: {
      content: "",
      success: false,
      error: false,
      feedback: "",
      successCount: 0,
    },
  });

  React.useEffect(() => {
    if (watch("successCount") >= 5) onPracticeOver();
  }, [watch("successCount")]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { content } = data;

      // check sentence acuracy
      const aiResult = await checkSentences({
        vocabulary,
        sentence: content,
      });

      // failed
      if (aiResult.result === "BAD") {
        setValue("success", false);
        setValue("error", aiResult.result === "BAD");
        setValue("feedback", aiResult.feedback);
      }
      // success
      else {
        setValue("content", "");
        setValue("successCount", data.successCount + 1);
        setValue("success", true);
        setValue("error", false);
        setValue("feedback", "");
      }
    } catch {
      toast({ title: "System Error", variant: "destructive" });
    }
  });

  return (
    <form
      className="h-full flex flex-col gap-2 justify-center p-2"
      onSubmit={onSubmit}
    >
      <div className="flex justify-center gap-2">
        {Array.from({ length: watch("successCount") }).map((_, index) => (
          <CheckCircleIcon className="text-green-500" key={index} />
        ))}
      </div>
      <Label>
        Make a sentence by using vocabulary{" "}
        <span className="font-bold text-lg">{vocabulary}</span>
      </Label>
      <div className="flex items-center gap-2">
        <Input required {...register("content")} autoComplete="off" />
      </div>
      <p className={`${watch("error") ? "text-red-400" : ""}`}>
        {watch("feedback")}
      </p>

      <Button disabled={formState.isLoading}>Submit</Button>
    </form>
  );
}
