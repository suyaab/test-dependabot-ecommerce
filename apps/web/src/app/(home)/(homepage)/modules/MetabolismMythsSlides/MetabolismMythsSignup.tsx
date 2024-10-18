import type { MetabolismMythsSlideSignup } from "@ecommerce/cms";

import SignUpForm from "~/components/Signup";
import { SlideLayout } from "./MetabolismMythsSlides";

export default function SignupSlide({
  slide,
  showNextSlide,
}: {
  slide: MetabolismMythsSlideSignup;
  showNextSlide: () => void;
}) {
  return (
    <SlideLayout className="flex flex-col justify-center bg-charcoal text-linen">
      <div className="lg:grid-container flex max-h-full flex-col items-center justify-center pt-20 max-lg:h-full">
        <h3 className="h5 col-span-10 col-start-2 mb-10 text-center font-semibold">
          {slide.title}
        </h3>
      </div>
      <div className="mx-auto text-center lg:w-1/3">
        <SignUpForm
          signupAdditionalText={slide.subtext.data}
          signupSource="us_quiz"
          signupPlaceHolder="Enter email address"
          handleSuccess={showNextSlide}
        />
      </div>
    </SlideLayout>
  );
}
