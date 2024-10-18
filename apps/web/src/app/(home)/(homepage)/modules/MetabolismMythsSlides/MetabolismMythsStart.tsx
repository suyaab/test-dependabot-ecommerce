import type { MetabolismMythsSlideStart } from "@ecommerce/cms";

import Button from "~/components/Button";
import ResponsiveImage from "~/components/ResponsiveImage";
import { SlideLayout } from "./MetabolismMythsSlides";

export default function StartSlide({
  slide,
  showNextSlide,
}: {
  slide: MetabolismMythsSlideStart;
  showNextSlide: () => void;
}) {
  return (
    <SlideLayout className="overflow-y-auto bg-linen pb-20 lg:flex lg:items-center">
      <div className="lg:grid-container max-h-full pt-20">
        <h3 className="lg:h2 max-lg:subtitle mb-4 font-semibold lg:col-span-7 lg:row-start-1">
          {slide.title}
        </h3>
        <div className="lg:col-span-7 lg:row-start-2">
          <div
            className="lg:subtitle mb-12 text-charcoal/70"
            dangerouslySetInnerHTML={{ __html: slide.text.data }}
          />
          <Button
            className="max-lg:hidden"
            variant="dark"
            text={slide.cta.data.text}
            onClick={showNextSlide}
          />
        </div>
        <div className="lg:col-span-5 lg:col-start-8 lg:row-start-2">
          {slide.experts.map((expert) => (
            <div key={expert.name} className="mb-6 flex items-center gap-3">
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
