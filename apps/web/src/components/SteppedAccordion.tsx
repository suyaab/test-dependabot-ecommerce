import React, {
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";

import { isKeyOf } from "@ecommerce/utils";

import cn from "~/lib/utils";

export interface SteppedAccordionProps<
  StepType extends string,
  StepValueType extends number,
> {
  steps: Record<StepType, StepValueType>;
  currentStep: StepValueType;
  setCurrentStep: Dispatch<SetStateAction<StepValueType>>;
  content: { data: Record<StepType, string> };
  children: ReactNode;
}

export default function SteppedAccordion<
  StepType extends string,
  StepValueType extends number,
>({
  steps,
  currentStep,
  content,
  setCurrentStep,
  children,
}: SteppedAccordionProps<StepType, StepValueType>) {
  const initialMount = useRef(true);
  const headingRefs = useRef<Record<string, RefObject<HTMLHeadingElement>>>({});

  const scrollToStep = useCallback(
    (stepValue: StepValueType) => {
      const stepKey = Object.keys(steps).find(
        (key) => isKeyOf(key, steps) && steps[key] === stepValue,
      );
      if (stepKey != null && isKeyOf(stepKey, steps)) {
        headingRefs?.current?.[stepKey]?.current?.scrollIntoView({
          block: "start",
          behavior: "smooth",
        });
      }
    },
    [steps],
  );

  const moveToStep = (stepValue: StepValueType) => {
    setCurrentStep(stepValue);
    scrollToStep(stepValue);
  };

  useEffect(() => {
    headingRefs.current = Object.keys(steps).reduce<
      Record<string, RefObject<HTMLHeadingElement>>
    >((acc, stepKey) => {
      acc[stepKey] = React.createRef<HTMLHeadingElement>();
      return acc;
    }, {});
  }, [steps]);

  useLayoutEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }
    scrollToStep(currentStep);
  }, [currentStep, scrollToStep]);

  return (
    <>
      {React.Children.map(children, (child, index) => {
        const stepKey = Object.keys(steps)[index];

        if (stepKey == null || !isKeyOf(stepKey, steps)) return null;

        const value = steps[stepKey];
        const values = Object.values(steps);
        const ref = headingRefs?.current?.[stepKey];
        const canMove = values.indexOf(value) <= values.indexOf(currentStep);

        return (
          <div key={stepKey}>
            <h2
              ref={ref}
              onClick={canMove ? () => moveToStep(value) : undefined}
              className={cn("headline border-b border-linen py-4", {
                "cursor-pointer": canMove,
              })}
            >
              {content.data[stepKey]}
            </h2>
            <div className={cn({ hidden: currentStep !== value })}>{child}</div>
          </div>
        );
      })}
    </>
  );
}
