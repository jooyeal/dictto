"use client";

import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Vocabulary } from "@prisma/client";
import { ArrowDown, ArrowUp } from "lucide-react";
import Word from "@/components/ui/word";
import { SessionProvider } from "next-auth/react";
import { Label } from "@/components/ui/label";

type Props = {
  data: Vocabulary[];
};

export function VocabularyStudyCarousel({ data }: Props) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [showDetail, setShowDetail] = React.useState(false);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleClickCard = () => {
    setShowDetail((prev) => !prev);
  };

  const handleClickMove = () => {
    setShowDetail(false);
  };

  return (
    <SessionProvider>
      <div className="mx-auto w-full flex flex-col justify-center items-center px-10">
        <Carousel setApi={setApi} className="w-full max-w-5xl">
          <CarouselContent>
            {data.map((vocabulary, index) => (
              <CarouselItem key={index}>
                <Card>
                  <CardContent className="flex aspect-video items-center justify-center p-6">
                    <div className="w-full h-full flex-col overflow-hidden">
                      <div
                        className="border rounded-full w-7 h-7 flex justify-center items-center"
                        onClick={handleClickCard}
                      >
                        {showDetail ? <ArrowUp /> : <ArrowDown />}
                      </div>
                      <div
                        className={`w-full h-full flex-none transition-transform duration-500 flex justify-center items-center ${
                          showDetail ? "translate-y-full" : ""
                        }`}
                      >
                        <span className="text-4xl font-semibold">
                          {vocabulary.content}
                        </span>
                      </div>
                      <div
                        className={`w-full h-full flex-none transition-transform duration-500 ${
                          showDetail ? "-translate-y-full " : ""
                        }`}
                      >
                        <div>
                          <div>
                            <span className="text-2xl font-extrabold">
                              {vocabulary.content}
                            </span>
                          </div>

                          <div className="text-lg mt-4 font-semibold">
                            Details
                          </div>
                          <div>
                            {vocabulary.meaning
                              .split(" ")
                              .map((word, index) => (
                                <Word
                                  key={index}
                                  className="font-medium mr-1 break-all"
                                  title={word}
                                />
                              ))}
                          </div>
                          <div className="text-lg mt-4 font-semibold">
                            Examples
                          </div>
                          <div>
                            {vocabulary.examples.map((example, index) => (
                              <div key={index}>
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
                          <div className="text-lg mt-4 font-semibold">
                            Practice
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious onClick={handleClickMove} />
          <CarouselNext onClick={handleClickMove} />
        </Carousel>
        <div className="py-2 text-center text-sm text-muted-foreground">
          Slide {current} of {count}
        </div>
      </div>
    </SessionProvider>
  );
}
