import { z } from "zod";

export interface Analytics {
  trackPage(page: Page, dynamicData?: DynamicData): void;
}

export const page = z.union([
  z.literal("home"),
  z.literal("lingo-experience"),
  z.literal("the-science"),
  z.literal("about-lingo"),
  z.literal("checkout"),
  z.literal("order-confirmation"),
  z.literal("privacy-notice"),
  z.literal("terms-of-use"),
  z.literal("social-media-terms-of-use"),
  z.literal("terms-of-sale"),
  z.literal("account"),
  z.literal("products"),
  z.literal("unsubscribe"),
  z.literal("order-tracking"),
  z.literal("order-returns"),
  z.literal("not-found"),
  z.literal("account-info"),
  z.literal("account-order"),
  z.literal("account-orders-returns"),
  z.literal("account-orders"),
  z.literal("account-payment-details"),
  z.literal("account-privacy"),
  z.literal("account-shipping-address"),
  z.literal("account-subscription"),
  z.literal("account-subscription-update"),
  z.literal("account-subscription-update-confirmation"),
  z.literal("account-orders"),
  z.literal("eula"),
  z.literal("promotional-products"),
  z.literal("promotional-checkout"),
  z.literal("promotional-confirmation"),
  z.literal("account-exists"),
]);

export type Page = z.infer<typeof page>;

export const LocationAttributes = {
  BANNER: "banner",
  NAVIGATION: "navigation",
  HERO: "hero",
  INTRO: "intro",
  VALUE: "value",
  HOW_IT_WORKS: "howItWorks",
  PROCESS: "process",
  TESTIMONIALS: "testimonials",
  QUIZ: "quiz",
  SHOP: "shop",
  PRESS: "press",
  BLOG_CONTENT: "blogContent",
  FAQ: "faq",
  FOOTER: "footer",
  HARDWARE_HIGHLIGHT: "hardwareHighlight",
  APP_HIGHLIGHT: "appHighlight",
  METABOLISM: "metabolism",
  GLUCOSE: "glucose",
  BENEFITS: "benefits",
  EXPERTS: "experts",
  REFERENCES: "references",
  EMAIL_COLLECTION_MODAL: "emailCollectionModal",
  REGION_SIGNUP: "regionSignup",
  CHECKOUT: "checkout",
  ACCOUNT_DETAILS: "accountDetails",
  SKU_HIGHLIGHT: "skuHighlight",
  NOT_FOUND: "notFound",
  PROMOTIONAL_PRODUCTS: "promotionalProducts",
  PROMOTIONAL_CHECKOUT: "promotionalCheckout",
  PROMOTIONAL_CONFIRMATION: "promotionalConfirmation",
  LOGIN: "login",
} as const;

export const LocationAttributesSchema = z.nativeEnum(LocationAttributes);
export type LocationAttribute = z.infer<typeof LocationAttributesSchema>;

// TODO: can we create a stronger type with
// enums / literal types in CMS?
// (ie, maybe generating types from Contentful such that ALL actions are listed here)
export const ActionAttributes = {
  INTRO_CTA: "introCta",
  LOGO_CTA: "logoCta",
  SIGNUP_CTA: "signUpCta",
  VALUE_CTA: "valueCta",
};

export type DynamicData = Record<string, unknown>;
