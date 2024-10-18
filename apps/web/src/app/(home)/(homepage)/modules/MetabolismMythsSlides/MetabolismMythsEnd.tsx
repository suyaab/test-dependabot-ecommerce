import type { MetabolismMythsSlideEnd } from "@ecommerce/cms";

import Button from "~/components/Button";
import { SlideLayout } from "./MetabolismMythsSlides";

export default function EndSlide({
  slide,
  closeDialog,
}: {
  slide: MetabolismMythsSlideEnd;
  closeDialog: () => void;
}) {
  return (
    <SlideLayout className="bg-charcoal text-linen lg:flex lg:flex-col lg:justify-center">
      <div className="lg:grid-container max-h-full flex-col items-center justify-center overflow-y-auto pt-20 max-lg:flex max-lg:h-full">
        <h3 className="h5 mb-10 text-center font-semibold lg:col-span-10 lg:col-start-2">
          {slide.title}
        </h3>
        <div className="col-span-full text-center">
          <Button
            className="px-12 max-lg:hidden"
            variant="light"
            text={slide.cta.data.text}
            onClick={closeDialog}
          />
        </div>
      </div>
      <Button
        className="absolute inset-x-6 bottom-6 lg:hidden"
        variant="light"
        text={slide.cta.data.text}
        onClick={closeDialog}
      />
    </SlideLayout>
  );
}
