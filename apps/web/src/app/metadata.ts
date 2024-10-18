import { Metadata } from "next";

import { ServiceLocator } from "@ecommerce/cms";

const metadata = async function generateMetadata(): Promise<Metadata> {
  const cms = ServiceLocator.getCMS();
  const metadata = await cms.getMetadata("Default");

  return {
    metadataBase: new URL("https://www.hellolingo.com"),
    icons: {
      icon: [
        "/favicon.ico",
        {
          url: "/favicon-16x16.png",
          sizes: "16x16",
          type: "image/png",
        },
        {
          url: "/favicon-32x32.png",
          sizes: "32x32",
          type: "image/png",
        },
        {
          url: "/favicon-48x48.png",
          sizes: "48x48",
          type: "image/png",
        },
      ],
      shortcut: "/shortcut-icon.png",
      apple: {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      other: {
        rel: "apple-touch-icon-precomposed",
        url: "/apple-touch-icon-precomposed.png",
      },
    },
    ...metadata,
  };
};

export default metadata;
