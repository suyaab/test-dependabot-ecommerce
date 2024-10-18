import type { MetabolismMythsSlideQ } from "@ecommerce/cms";

import Button from "~/components/Button";
import BalanceBowl from "~/icons/BalanceBowl";
import Calories from "~/icons/Calories";
import Day from "~/icons/Day";
import { SlideLayout } from "./MetabolismMythsSlides";

export default function QuestionSlide({
  slide,
  showNextSlide,
  selectAnswer,
}: {
  slide: MetabolismMythsSlideQ;
  showNextSlide: () => void;
  selectAnswer: (answer: boolean) => void;
}) {
  return (
    <SlideLayout className="overflow-y-auto bg-charcoal text-linen-light lg:flex lg:items-center">
      <div className="lg:grid-container max-lg:h-full">
        <div className="flex h-full max-h-full flex-col text-center max-lg:justify-center lg:col-span-10 lg:col-start-2 lg:pt-32">
          {slide.icon === "balance_bowl" && (
            <BalanceBowl className="mx-auto mb-10 h-36 w-18 text-linen lg:w-20" />
          )}
          {slide.icon === "calories" && (
            <Calories className="mx-auto mb-10 h-36 w-20 text-linen lg:w-24" />
          )}
          {slide.icon === "day" && (
            <Day className="mx-auto mb-10 h-28 w-32 text-linen lg:w-36" />
          )}
          <h3 className="font-semibold">{slide.title}</h3>
        </div>
        <div className="absolute inset-x-6 flex gap-x-2 max-lg:bottom-6 lg:static lg:col-span-full lg:justify-center lg:pt-4">
          <Button
            className="max-lg:grow lg:px-10"
            variant={slide.cta.data.variant}
            text={slide.cta.data.text}
            onClick={() => {
              showNextSlide();
              selectAnswer(true);
            }}
          />
          <Button
            className="max-lg:grow lg:px-10"
            variant={slide.cta2.data.variant}
            text={slide.cta2.data.text}
            onClick={() => {
              showNextSlide();
              selectAnswer(false);
            }}
          />
        </div>
      </div>
    </SlideLayout>
  );
}
