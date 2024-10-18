import type { Meta, StoryObj } from "@storybook/react";

import type { ButtonProps } from "./Button";
import ButtonComponent from "./Button";

const meta: Meta<ButtonProps> = {
  component: ButtonComponent,
} satisfies Meta<typeof ButtonComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DarkButton = {
  args: {
    text: "Dark Button",
    variant: "dark",
  },
} satisfies Story;

export const LightButton = {
  args: {
    text: "Light Button",
    variant: "light",
  },
} satisfies Story;

export const OutlineButton = {
  args: {
    text: "Outline Button",
    variant: "outline",
  },
} satisfies Story;

export const FullWidthButton = {
  args: {
    text: "Full Width Button",
    variant: "dark",
    className: "w-full",
  },
} satisfies Story;

export const LoadingButton = {
  args: {
    text: "Loading Button",
    variant: "dark",
    isLoading: true,
    className: "text-white",
  },
} satisfies Story;

export const DisabledButton = {
  args: {
    text: "Disabled Button",
    variant: "dark",
    isDisabled: true,
  },
} satisfies Story;

export const DisabledLoadingButton = {
  args: {
    text: "Disabled Loading Button",
    variant: "dark",
    isDisabled: true,
    isLoading: true,
  },
} satisfies Story;
