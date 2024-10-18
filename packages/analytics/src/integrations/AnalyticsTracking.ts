"use client";

import { z } from "zod";

import { Analytics, DynamicData, Page } from "../Analytics";
import aboutLingoPageData from "./data/pages/AboutLingoPageData";
import accountExistsPageData from "./data/pages/AccountExistsPageData";
import accountInfoPageData from "./data/pages/AccountInfoPageData";
import accountOrderPageData from "./data/pages/AccountOrderPageData";
import accountOrdersPageData from "./data/pages/AccountOrdersPageData";
import accountOrdersReturnsPageData from "./data/pages/AccountOrdersReturnsPageData";
import accountPageData from "./data/pages/AccountPageData";
import accountPaymentDetailsPageData from "./data/pages/AccountPaymentDetailsPageData";
import accountPrivacyPageData from "./data/pages/AccountPrivacyPageData";
import accountShippingAddressPageData from "./data/pages/AccountShippingAddressPageData";
import accountSubscriptionPageData from "./data/pages/AccountSubscriptionPageData";
import accountSubscriptionUpdateConfirmationPageData from "./data/pages/AccountSubscriptionUpdateConfirmationPageData";
import accountSubscriptionUpdatePageData from "./data/pages/AccountSubscriptionUpdatePageData";
import checkoutPageData from "./data/pages/CheckoutPageData";
import eulaPageData from "./data/pages/EulaPageData";
import homePageData from "./data/pages/HomePageData";
import lingoExperiencePageData from "./data/pages/LingoExperiencePageData";
import notFoundPageData from "./data/pages/NotFoundPageData";
import orderConfirmationPageData from "./data/pages/OrderConfirmationPageData";
import orderReturnsPageData from "./data/pages/OrderReturnsPageData";
import orderTrackingPageData from "./data/pages/OrderTrackingPageData";
import privacyNoticePageData from "./data/pages/PrivacyNoticePageData";
import productsPageData from "./data/pages/ProductsPageData";
import promotionalCheckoutPageData from "./data/pages/PromotionalCheckoutPageData";
import promotionalConfirmationPageData from "./data/pages/PromotionalConfirmationPageData";
import promotionalProductsPageData from "./data/pages/PromotionalProductsPageData";
import socialMediaTermsOfUsePageData from "./data/pages/SocialMediaTermsOfUsePageData";
import termsOfSalePageData from "./data/pages/TermsOfSalePageData";
import termsOfUsePageData from "./data/pages/TermsOfUsePageData";
import theSciencePageData from "./data/pages/TheSciencePageData";
import unsubscribePageData from "./data/pages/UnsubscribePageData";

export const AnalyticsPresetSchema = z.object({
  event: z.literal("screen_view"),
  // FYI: More event names can be added in the future
  beaconId: z.string(),
  subscribed: z.union([z.literal("n"), z.literal("y")]),
  page: z.object({
    pageName: z.string(),
    pageLevel1: z.string(),
    pageLevel2: z.string(),
    pageLevel3: z.string(),
  }),
});

export type AnalyticsPreset = z.infer<typeof AnalyticsPresetSchema>;

declare global {
  interface Window {
    adobeDataLayer: unknown[]; // TODO: can we type this more specifically?
    dataLayer: unknown[];
  }
}

function getPageData(page: Page): AnalyticsPreset {
  switch (page) {
    case "home":
      return homePageData;
    case "lingo-experience":
      return lingoExperiencePageData;
    case "the-science":
      return theSciencePageData;
    case "about-lingo":
      return aboutLingoPageData;
    case "checkout":
      return checkoutPageData;
    case "order-confirmation":
      return orderConfirmationPageData;
    case "privacy-notice":
      return privacyNoticePageData;
    case "terms-of-use":
      return termsOfUsePageData;
    case "social-media-terms-of-use":
      return socialMediaTermsOfUsePageData;
    case "terms-of-sale":
      return termsOfSalePageData;
    case "account":
      return accountPageData;
    case "products":
      return productsPageData;
    case "unsubscribe":
      return unsubscribePageData;
    case "order-tracking":
      return orderTrackingPageData;
    case "order-returns":
      return orderReturnsPageData;
    case "not-found":
      return notFoundPageData;
    case "account-info":
      return accountInfoPageData;
    case "account-order":
      return accountOrderPageData;
    case "account-orders-returns":
      return accountOrdersReturnsPageData;
    case "account-orders":
      return accountOrdersPageData;
    case "account-payment-details":
      return accountPaymentDetailsPageData;
    case "account-privacy":
      return accountPrivacyPageData;
    case "account-shipping-address":
      return accountShippingAddressPageData;
    case "account-subscription":
      return accountSubscriptionPageData;
    case "account-subscription-update":
      return accountSubscriptionUpdatePageData;
    case "account-subscription-update-confirmation":
      return accountSubscriptionUpdateConfirmationPageData;
    case "eula":
      return eulaPageData;
    case "promotional-products":
      return promotionalProductsPageData;
    case "promotional-checkout":
      return promotionalCheckoutPageData;
    case "promotional-confirmation":
      return promotionalConfirmationPageData;
    case "account-exists":
      return accountExistsPageData;
  }
}

export default class AnalyticsTracking implements Analytics {
  trackPage(page: Page, dynamicData?: DynamicData): void {
    // we have to create the adobe data layer manually
    // https://experienceleaguecommunities.adobe.com/t5/adobe-experience-manager/how-to-add-data-layer/m-p/662353
    if (window?.adobeDataLayer == null) {
      window.adobeDataLayer = [];
    }
    if (window?.dataLayer == null) {
      window.dataLayer = window.dataLayer || [];
    }

    const pageData = getPageData(page);

    window.adobeDataLayer.push(pageData);
    if (dynamicData) {
      window.dataLayer.push(dynamicData);
    }
  }
}
