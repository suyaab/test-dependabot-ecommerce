"use client";

import { Fragment, ReactNode, useState } from "react";

import { LocationAttributes } from "@ecommerce/analytics";
import type {
  Button as ButtonType,
  MetabolismMythsSlides,
} from "@ecommerce/cms";

import Button from "~/components/Button";
import {
  Dialog,
  DialogContentWithCloseButton,
  DialogTrigger,
} from "~/components/Dialog";
import cn from "~/lib/utils";
import AnswerSlide from "./MetabolismMythsAnswer";
import EndSlide from "./MetabolismMythsEnd";
import QuestionSlide from "./MetabolismMythsQuestion";
import SignupSlide from "./MetabolismMythsSignup";
import StartSlide from "./MetabolismMythsStart";

export function SlideLayout({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative w-full shrink-0 grow px-6 pb-24", className)}>
      {children}
    </div>
  );
}

export default function MetabolismMythsSlides({
  cta,
  slides = [],
}: {
  cta: ButtonType;
  slides: MetabolismMythsSlides;
}) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [latestAnswer, setLatestAnswer] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Dialog
        open={isDialogOpen}
        onOpenChange={() => {
          setCurrentSlideIndex(0);
          setIsDialogOpen(!isDialogOpen);
        }}
      >
        <DialogTrigger asChild>
          <Button
            text={cta.data.text}
            variant={cta.data.variant}
            analyticsActionAttribute={cta.data.analyticsActionAttribute}
            analyticsLocationAttribute={LocationAttributes.QUIZ}
          />
        </DialogTrigger>

        <DialogContentWithCloseButton className="h-full w-full max-w-none overflow-hidden border-none p-0">
          <div
            className="relative z-0 inline-flex h-full w-full transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentSlideIndex * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <Fragment key={slide.name}>
                {slide?.type === "start" && (
                  <StartSlide
                    slide={slide}
                    showNextSlide={(): void => setCurrentSlideIndex(index + 1)}
                  />
                )}
                {slide?.type === "question" && (
                  <QuestionSlide
                    slide={slide}
                    showNextSlide={(): void => setCurrentSlideIndex(index + 1)}
                    selectAnswer={setLatestAnswer}
                  />
                )}
                {slide?.type === "answer" && (
                  <AnswerSlide
                    slide={slide}
                    showNextSlide={(): void => setCurrentSlideIndex(index + 1)}
                    latestAnswer={latestAnswer}
                  />
                )}
                {slide?.type === "signup" && (
                  <SignupSlide
                    slide={slide}
                    showNextSlide={(): void => setCurrentSlideIndex(index + 1)}
                  />
                )}
                {slide?.type === "end" && (
                  <EndSlide
                    slide={slide}
                    closeDialog={() => setIsDialogOpen(false)}
                  />
                )}
              </Fragment>
            ))}
          </div>
        </DialogContentWithCloseButton>
      </Dialog>
    </>
  );
}
