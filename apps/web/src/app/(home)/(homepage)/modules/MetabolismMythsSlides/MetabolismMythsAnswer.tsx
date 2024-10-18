import type { MetabolismMythsSlideA } from "@ecommerce/cms";

import Button from "~/components/Button";
import ResponsiveImage from "~/components/ResponsiveImage";
import BalanceBowl from "~/icons/BalanceBowl";
import Calories from "~/icons/Calories";
import Day from "~/icons/Day";
import { SlideLayout } from "./MetabolismMythsSlides";

export default function AnswerSlide({
  slide,
  showNextSlide,
  latestAnswer,
}: {
  slide: MetabolismMythsSlideA;
  showNextSlide: () => void;
  latestAnswer: boolean;
}) {
  return (
    <SlideLayout className="bg-linen">
      <div className="-mx-6 flex h-full max-h-full flex-col overflow-y-auto px-6 pt-20 max-lg:justify-between">
        <div className="lg:grid-container">
          <h3 className="max-lg:subtitle mb-6 font-semibold lg:col-span-8 lg:row-start-1">
            {latestAnswer ? slide.title2 : slide.title}
          </h3>
          <div
            className="subtitle text-charcoal/70 lg:col-span-8 lg:row-start-2 [&>*]:mb-6"
            dangerouslySetInnerHTML={{ __html: slide.text.data }}
          />
          <div className="max-lg:hidden lg:col-span-8 lg:row-start-3">
            <Button
              className="px-10"
              variant="dark"
              text={slide.cta.data.text}
              onClick={showNextSlide}
            />
          </div>
          <div className="max-lg:hidden lg:col-span-4 lg:row-span-4 lg:row-start-1">
            {slide.icon === "balance_bowl" && (
              <BalanceBowl
                className="mx-auto mb-20 h-auto max-h-96 w-full"
                color="#222731"
              />
            )}
            {slide.icon === "calories" && (
              <Calories
                className="mx-auto mb-36 h-auto max-h-80 w-full"
                color="#222731"
              />
            )}
            {slide.icon === "day" && (
              <Day
                className="mx-auto mb-10 h-auto max-h-96 w-full"
                color="#222731"
              />
            )}
          </div>
        </div>
        <div className="lg:grid-container">
          {slide.references.data != null && (
            <div
              className="w-full text-sm text-charcoal/50 max-lg:mb-10 lg:col-span-7 [&>*]:mb-6 [&_ol>li]:mb-2 [&_ol>li]:overflow-x-auto [&_ol]:list-inside [&_ol]:list-decimal"
              dangerouslySetInnerHTML={{ __html: slide.references.data }}
            />
          )}
          <hr className="h-[1px] bg-charcoal/20 max-lg:my-6 lg:col-span-full" />
          {slide.experts.map((expert) => (
            <div
              key={expert.name}
              className="mb-6 flex items-center gap-3 lg:col-span-7"
            >
              <ResponsiveImage className="w-16 lg:w-20" {...expert.image} />
              <div className="space-y-1 max-lg:text-sm">
                <p className="font-semibold">{expert.name}</p>
                <p className="text-charcoal/70">{expert.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Button
        className="absolute inset-x-6 bottom-6 lg:hidden"
        variant="dark"
        text={slide.cta.data.text}
        onClick={showNextSlide}
      />
    </SlideLayout>
  );
}
