import { Meta, StoryObj } from "@storybook/react";
import { FormProvider, useForm } from "react-hook-form";

import AddressInputComponent from "./AddressInput";
import type { AddressInputProps } from "./AddressInput";

const meta: Meta<AddressInputProps> = {
  title: "Components/AddressInput",
  component: AddressInputComponent,
  argTypes: {
    name: { control: "text" },
    supportedCountries: { control: "select" },
    addressToSet: { control: "object" },
  },
} satisfies Meta<typeof AddressInputComponent>;
export default meta;

type Story = StoryObj<typeof meta>;

const Template: Story = {
  render: (args) => {
    const methods = useForm();
    return (
      <FormProvider {...methods}>
        <AddressInputComponent {...args} />
      </FormProvider>
    );
  },
};

export const Default: Story = Template satisfies Story;

Default.args = {
  name: "shippingAddress",
  supportedCountries: ["US", "PR"],
  addressToSet: {
    addressLine1: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    state: "",
    countryCode: "US",
  },
};
