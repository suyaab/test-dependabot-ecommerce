import type { Meta, StoryObj } from "@storybook/react";

import type { HyperlinkProps } from "./Hyperlink";
import LinkComponent from "./Hyperlink";

const meta: Meta<HyperlinkProps> = {
  component: LinkComponent,
} satisfies Meta<typeof LinkComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DarkLink = {
  args: {
    text: "Dark Link",
    url: "https://hellolingo.com",
    variant: "dark",
  },
} satisfies Story;

export const LightLink = {
  args: {
    text: "Light Link",
    url: "https://hellolingo.com",
    variant: "light",
  },
} satisfies Story;

export const OutlineLink = {
  args: {
    text: "Outline Link",
    url: "https://hellolingo.com",
    variant: "outline",
  },
} satisfies Story;

export const UnderlineLink = {
  args: {
    text: "Underline Link",
    url: "https://hellolingo.com",
    className: "underline",
  },
} satisfies Story;
