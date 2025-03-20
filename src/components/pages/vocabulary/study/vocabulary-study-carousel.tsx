"use client";

import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Vocabulary } from "@prisma/client";
import Word from "@/components/ui/word";
import { SessionProvider } from "next-auth/react";
import VocabularyStudyPractice from "./vocabulary-study-practice";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  CheckCircle2Icon,
} from "lucide-react";
import { motion } from "framer-motion";
import { wait } from "@/lib/utils";

type Props = {
  data: Vocabulary[];
};

export function VocabularyStudyCarousel({ data }: Props) {
  const [current, setCurrent] = React.useState(0);
  const [step, setStep] = React.useState(0);
  const [vocabulary, setVocabulary] = React.useState<Vocabulary>(data[0]);
  const [isPracticeOver, setIsPracticeOver] = React.useState(false);
  const [studiedVocabularies, setStudiedVocabularies] = React.useState<
    Vocabulary[]
  >([]);
  const showSuccessScreen =
    isPracticeOver ||
    studiedVocabularies.find(
      (studiedVocabulary) => studiedVocabulary.id === vocabulary.id
    );

  React.useEffect(() => {
    setVocabulary(data[current]);
  }, [current]);

  const handleClickMove = (dir: "prev" | "next") => {
    setStep(0);
    if (dir === "prev") {
      setCurrent((prev) => (prev === 0 ? data.length - 1 : prev - 1));
    } else if (dir === "next") {
      setCurrent((prev) => (prev === data.length - 1 ? 0 : prev + 1));
    }
  };

  const handlePracticeOver = async () => {
    setIsPracticeOver(true);
    setStudiedVocabularies((prev) => [...prev, vocabulary]);
    await wait(3);

    setIsPracticeOver(false);
    handleClickMove("next");
  };

  return (
    <SessionProvider>
      <div className="mx-auto w-full flex justify-center items-center px-10 gap-2">
        <ArrowLeftCircleIcon
          size={24}
          onClick={() => handleClickMove("prev")}
        />
        <div className="w-full">
          <Card>
            <CardContent className="flex aspect-video items-center justify-center p-6 relative">
              <div
                className={`absolute w-full h-full bg-slate-100 bg-opacity-80 z-10 flex justify-center items-center ${
                  showSuccessScreen ? "visible" : "invisible"
                }`}
              >
                <motion.div
                  animate={{ opacity: showSuccessScreen ? 1 : 0 }}
                  className="flex flex-col items-center justify-center select-none"
                >
                  <CheckCircle2Icon size={256} className="text-green-500" />
                  <p className="text-6xl text-green-500 font-extrabold">
                    Good!
                  </p>
                </motion.div>
              </div>
              <div
                className={`w-full h-full flex-col overflow-hidden relative`}
              >
                <div className="flex justify-end">
                  <div className="flex gap-2">
                    {step !== 0 && (
                      <Button onClick={() => setStep(0)}>Back</Button>
                    )}
                    {step !== 1 && (
                      <Button onClick={() => setStep(1)}>Detail</Button>
                    )}
                    {step !== 2 && (
                      <Button onClick={() => setStep(2)}>Practice</Button>
                    )}
                  </div>
                </div>
                <div
                  className={`w-full h-full flex-none transition-transform duration-500 flex justify-center items-center`}
                >
                  <div className="text-4xl font-semibold">
                    {vocabulary.content}
                  </div>
                </div>
                <div
                  className={`w-full h-full flex-none transition-transform duration-500 ${
                    step !== 1 ? "translate-y-full" : "-translate-y-full"
                  } absolute bg-white`}
                >
                  <div>
                    <div className="text-2xl font-extrabold">
                      {vocabulary.content}
                    </div>

                    <div className="text-lg mt-4 font-semibold">Details</div>
                    <div>
                      {vocabulary.meaning.split(" ").map((word, index) => (
                        <Word
                          key={index}
                          className="font-medium mr-1 break-all"
                          title={word}
                        />
                      ))}
                    </div>
                    <div className="text-lg mt-4 font-semibold">Examples</div>
                    <div>
                      {vocabulary.examples.map((example, index) => (
                        <div key={index}>
                          ・
                          {example.split(" ").map((word, index) => (
                            <Word
                              key={index}
                              className="mr-1 break-all"
                              title={word}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div
                  className={`w-full h-full flex-none transition-transform duration-500 ${
                    step !== 2 ? "translate-y-full" : "-translate-y-full"
                  } absolute bg-white`}
                >
                  <VocabularyStudyPractice
                    vocabulary={vocabulary.content}
                    onPracticeOver={handlePracticeOver}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <ArrowRightCircleIcon
          size={24}
          onClick={() => handleClickMove("next")}
        />
      </div>
      <div className="py-2 text-center text-sm text-muted-foreground">
        {current + 1} of {data.length}
      </div>
    </SessionProvider>
  );
}
