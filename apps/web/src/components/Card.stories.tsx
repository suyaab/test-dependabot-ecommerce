import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";

import CardComponent from "./Card";

const meta = {
  component: CardComponent,
} satisfies Meta<typeof CardComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultCard = {
  args: {
    id: "1",
    name: "card",
    children: "Card content",
    handleSelect: (id: string) => action("handleSelect")(id),
  },
} satisfies Story;

export const SelectedCard = {
  args: {
    id: "1",
    name: "card",
    children: "Card content",
    handleSelect: (id: string) => action("handleSelect")(id),
    selected: true,
  },
} satisfies Story;

export const AnalyticsCard = {
  args: {
    id: "1",
    name: "card",
    children: "Card content",
    handleSelect: (id: string) => action("handleSelect")(id),
    selected: true,
    dataAnalyticsLocation: "card-id-1",
    dataAnalyticsAction: "CLICK_CARD",
  },
} satisfies Story;
