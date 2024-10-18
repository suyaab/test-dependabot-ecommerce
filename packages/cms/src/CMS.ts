import {
  AccountManagementOrderSummaryContent,
  CheckoutSectionContent,
  CountryGateDialogContent,
  CountryGateRedirectDialogContent,
  CountryGateSignupDialogContent,
  DuplexAccordion,
  DuplexAccordionDataKey,
  DuplexContentKey,
  DuplexContentList,
  EmailsCollectionModalContent,
  ExpertsCarouselContent,
  FAQContent,
  FooterContent,
  HeroContent,
  HomeBlogContent,
  HomeFeaturesContent,
  HomeGlucoseInfoBlockContent,
  HomeMetabolismMyths,
  HomeNutritionBlockContent,
  HomeProductHighlightContent,
  HomeProductHighlightEcommerceContent,
  HTMLContentKey,
  IconItemListKey,
  IconItemsListContent,
  Metadata,
  MetadataPageKey,
  NavigationContent,
  PageDataKey,
  PrivacyNoticeItem,
  PromotionalCheckoutSectionContent,
  ReferencesContent,
  ResponsiveImageContent,
  ResponsiveImageDataKey,
  SignupContent,
  SignupDataKey,
  TextContent,
  TextDataKey,
  VeevaDataKey,
} from "./types";
import {
  LECarouselContent,
  LECoachingAppTabsContent,
  LEResearchInfoBlockContent,
} from "./types/lingoExperience";
import { NotFoundContent } from "./types/notFound";
import {
  CheckoutOrderSummaryContent,
  OrderConfirmationContent,
} from "./types/orderConfirmation";
import {
  CheckoutProductsContent,
  PDPNextStepsCarouselContent,
  ProductCarouselContent,
  ProductDecideDialogContent,
  ProductFeaturesContent,
  ProductFormContent,
  SampleProductFormContent,
  type ProductCardContent,
} from "./types/products";

export interface CMS {
  // Common
  getMetadata(key: MetadataPageKey): Promise<Metadata>;
  getVeevaNumber(key: PageDataKey | VeevaDataKey): Promise<TextContent>;
  getResponsiveImage(
    key: ResponsiveImageDataKey,
  ): Promise<ResponsiveImageContent>;
  getHeroContent(key: PageDataKey): Promise<HeroContent>;
  getFAQContent(key: PageDataKey): Promise<FAQContent>;
  getNavContent(): Promise<NavigationContent>;
  getFooterContent(): Promise<FooterContent>;
  getEcommerceFooterContent(): Promise<FooterContent>;
  getReferencesContent(key: PageDataKey): Promise<ReferencesContent>;
  getSignupContent(key: SignupDataKey): Promise<SignupContent>;
  getDuplexAccordionContent(
    key: DuplexAccordionDataKey,
  ): Promise<DuplexAccordion>;
  getDuplexContentList(key: DuplexContentKey): Promise<DuplexContentList>;
  getExpertsCarouselContent(): Promise<ExpertsCarouselContent>;
  getIconItemList(key: IconItemListKey): Promise<IconItemsListContent>;
  getTextContent(key: TextDataKey): Promise<TextContent>;
  getCountryGateRedirectDialogContent(
    countryCode: string,
  ): Promise<CountryGateRedirectDialogContent>;
  getCountryGateDialogContent(): Promise<CountryGateDialogContent>;
  getCountryGateSignupDialogContent(): Promise<CountryGateSignupDialogContent>;
  getEmailsCollectionModalContent(): Promise<EmailsCollectionModalContent>;
  getPreLaunchEmailsCollectionModalContent(): Promise<EmailsCollectionModalContent>;
  getRawHTMLContent(key: HTMLContentKey): Promise<string>;

  // Privacy Notice Page Content
  getPrivacyNoticeContent(): Promise<PrivacyNoticeItem[]>;

  // Home Page Content
  getHomeNutritionBlockContent(): Promise<HomeNutritionBlockContent>;
  getHomeGlucoseInfoBlockContent(): Promise<HomeGlucoseInfoBlockContent>;
  getHomeFeaturesContent(): Promise<HomeFeaturesContent>;
  getHomeBlogContent(): Promise<HomeBlogContent>;
  getHomeProductHighlightContent(): Promise<HomeProductHighlightContent>;
  getHomeProductHighlightEcommerceContent(): Promise<HomeProductHighlightEcommerceContent>;

  getHomeMetabolismMythsContent(): Promise<HomeMetabolismMyths>;

  // Lingo Experience Content
  getLEResearchInfoBlockContent(): Promise<LEResearchInfoBlockContent>;
  getLECoachingAppTabsContent(): Promise<LECoachingAppTabsContent>;
  getLECarouselContent(): Promise<LECarouselContent>;

  // Product Content
  getProductFeaturesContent(): Promise<ProductFeaturesContent>;
  getProductCardsContent(skus: string[]): Promise<ProductCardContent[]>;
  getProductCardContent(sku: string): Promise<ProductCardContent>;
  getCheckoutProductsContent(): Promise<CheckoutProductsContent>;
  getProductCarouselContent(): Promise<ProductCarouselContent>;
  getProductDecideDialogContent(): Promise<ProductDecideDialogContent>;
  getProductFormContent(): Promise<ProductFormContent>;
  getPDPNextStepsCarouselContent(): Promise<PDPNextStepsCarouselContent>;

  // Checkout Content
  getCheckoutSectionContent(): Promise<CheckoutSectionContent>;
  getPromotionalCheckoutSectionContent(): Promise<PromotionalCheckoutSectionContent>;

  // Promotional Product Content
  getPromotionalProductCardsContent(
    skus: string[],
  ): Promise<ProductCardContent[]>;
  getPromotionalProductFormContent(): Promise<SampleProductFormContent>;
  getPromotionalProductCarouselContent(): Promise<ProductCarouselContent>;

  // Order Confirmation Content
  getCheckoutOrderSummaryContent(): Promise<CheckoutOrderSummaryContent>;
  getOrderConfirmationContent(): Promise<OrderConfirmationContent>;

  // Not Found Page Content
  getNotFoundContent(): Promise<NotFoundContent>;

  // Account Management
  getAccountManagementOrderSummaryContent(): Promise<AccountManagementOrderSummaryContent>;
}
