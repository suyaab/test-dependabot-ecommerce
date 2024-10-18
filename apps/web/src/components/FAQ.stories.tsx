import type { Meta, StoryObj } from "@storybook/react";

import FaqComponent from "./FAQ";

const meta = {
  component: FaqComponent,
} satisfies Meta<typeof FaqComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const faqContent = {
  title: "Questions? We've got you covered",
  suptitle: "FAQs",
  items: [
    {
      title: "Can I use Lingo to manage my diabetes?",
      data: "No, the Lingo system is not intended for the management or diagnosis of diseases, including diabetes.",
    },
    {
      title: "Is Lingo right for me?",
      data: "<p>If you want to understand your metabolism and learn how to transform the way you feel, then Lingo is 100% for you. Research has shown a number of health benefits of limiting glucose spikes, which can be monitored by using a continuous glucose monitor (CGM), even if you don't live with diabetes.</p><p>However, the Lingo program does not guarantee that everyone will achieve the same results as individual responses may vary. It's always best to speak with your doctor or registered dietitian before starting any new diet or exercise regimen.</p><p>It is best to speak to your doctor for advice on starting any diet or exercise regime or if you have an eating disorder or a history of eating disorders. </p>",
    },
    {
      title: "How is my data being used?",
      data: "We use data from your biosensor to create your personalized training program. We also use your product feedback anonymously to help us make the Lingo experience even better for you and others. For more information on how we process data and monitor communications, please see our Lingo Privacy Notice.",
    },
  ],
};

export const FAQEnabled = {
  args: {
    content: { ...faqContent, enabled: true },
    dataAnalyticsLocation: "faq",
  },
} satisfies Story;

export const FAQNotEnabled = {
  args: {
    content: { ...faqContent, enabled: false },
    dataAnalyticsLocation: "faq",
  },
} satisfies Story;

export const FAQNoEnabledProp = {
  args: {
    content: faqContent,
    dataAnalyticsLocation: "faq",
  },
} satisfies Story;
