import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";

import { createSteps, StepType } from "@ecommerce/utils";

import type { SteppedAccordionProps } from "./SteppedAccordion";
import SteppedAccordionComponent from "./SteppedAccordion";

const sampleStepsList = ["ONE", "TWO", "THREE"] as const;
type SampleStepType = StepType<typeof sampleStepsList>;
const steps = createSteps(sampleStepsList);

const meta: Meta<SteppedAccordionProps<SampleStepType, number>> = {
  title: "Components/SteppedAccordion",
  component: SteppedAccordionComponent,
  argTypes: {
    steps: { control: "object" },
    currentStep: { control: "select", options: Object.values(steps) },
    setCurrentStep: { action: "setCurrentStep" },
  },
} satisfies Meta<typeof SteppedAccordionComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

const getNextStep = (currentStep: number): number | undefined => {
  const stepsValues = Object.values(steps);
  const currentIndex = stepsValues.indexOf(currentStep);
  if (currentIndex < 0 || currentIndex >= stepsValues.length - 1) {
    return undefined;
  }
  return stepsValues[currentIndex + 1];
};

const StepButton = ({
  step,
  nextStep,
  setCurrentStep,
}: {
  step: number;
  nextStep: number | undefined;
  setCurrentStep: (step: number) => void;
}) => {
  if (nextStep == null) return null;
  return (
    <button
      className="button-dark"
      onClick={() => setCurrentStep(nextStep)}
      data-testid={`Step ${step} Button`}
    >
      Go to Next Step
    </button>
  );
};

const Template: Story = {
  render: (args) => {
    const stepsLength = Object.keys(steps).length;
    const [currentStep, setCurrentStep] = useState<number>(steps.ONE);

    return (
      <div className="mb-96">
        <SteppedAccordionComponent
          {...args}
          steps={steps}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        >
          {Object.values(steps).map((step, index) => {
            const nextStep = getNextStep(currentStep);
            const isLastStep = index === stepsLength - 1;

            return (
              <div key={String(`step-${step}`)} className="h-[500px]">
                <div className="py-14" data-testid={step}>
                  Markup for step {sampleStepsList[step]?.toLowerCase()}
                </div>
                {isLastStep !== true && (
                  <StepButton
                    step={step}
                    nextStep={nextStep}
                    setCurrentStep={setCurrentStep}
                  />
                )}
              </div>
            );
          })}
        </SteppedAccordionComponent>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const stepOne = canvas.getByTestId(steps.ONE);
    const stepTwo = canvas.getByTestId(steps.TWO);
    const stepThree = canvas.getByTestId(steps.THREE);
    const stepOneButton = canvas.getByTestId("Step 0 Button");
    const stepTwoButton = canvas.getByTestId("Step 1 Button");
    const stepThreeButton = canvas.queryByTestId("Step 2 Button");
    const stepOneHeader = canvas.getByText("1. Step one heading");
    const stepTwoHeader = canvas.getByText("2. Step two heading");
    const stepThreeHeader = canvas.getByText("3. Step three heading");

    // Ensure that all steps are rendered correctly
    await expect(stepOne).toBeInTheDocument();
    await expect(stepTwo).toBeInTheDocument();
    await expect(stepThree).toBeInTheDocument();

    // Ensure that only the first step's content is visible
    await expect(stepOneButton).toBeVisible();
    await expect(stepTwoButton).not.toBeVisible();
    await expect(stepThreeButton).toBeNull();

    // STEP 1

    // Ensure that headers for steps 2 and 3 are not clickable and don't have cursor-pointer class
    await expect(stepTwoHeader).not.toHaveClass("cursor-pointer");
    await expect(stepThreeHeader).not.toHaveClass("cursor-pointer");
    await expect(stepTwoHeader).not.toHaveAttribute("onclick");
    await expect(stepThreeHeader).not.toHaveAttribute("onclick");

    await userEvent.click(stepOneHeader);

    // STEP 2

    // Click the button to move to step 2
    await userEvent.click(stepOneButton);
    // Ensure that the first step's content is no longer visible and the second step's content is now visible
    await expect(stepOneButton).not.toBeVisible();
    await expect(stepTwoButton).toBeVisible();
    await expect(stepThreeButton).toBeNull();
    // Ensure that headers for steps 1-2 have cursor-pointer class
    // Ensure that headers for step 3 doesn't have cursor-pointer class
    await expect(stepOneHeader).toHaveClass("cursor-pointer");
    await expect(stepTwoHeader).toHaveClass("cursor-pointer");
    await expect(stepThreeHeader).not.toHaveClass("cursor-pointer");

    // STEP 3

    // Click the button to move to step 3
    await userEvent.click(stepTwoButton);
    // Ensure that the second step's content is no longer visible and the third step's content is now visible
    await expect(stepOneButton).not.toBeVisible();
    await expect(stepTwoButton).not.toBeVisible();
    // Ensure that headers for steps 1-3 have cursor-pointer class
    await expect(stepOneHeader).toHaveClass("cursor-pointer");
    await expect(stepTwoHeader).toHaveClass("cursor-pointer");
    await expect(stepThreeHeader).toHaveClass("cursor-pointer");
  },
};

export const Default: Story = Template satisfies Story;

Default.args = {
  content: {
    data: {
      ONE: "1. Step one heading",
      TWO: "2. Step two heading",
      THREE: "3. Step three heading",
    },
  },
};
