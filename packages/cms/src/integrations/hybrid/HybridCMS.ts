import { CMS } from "../../CMS";
import {
  CountryGateKey,
  DuplexAccordionDataKey,
  DuplexContentKey,
  HTMLContentKey,
  IconItemListKey,
  MetadataPageKey,
  PageDataKey,
  ReferencesPageDataKey,
  ResponsiveImageDataKey,
  SignupDataKey,
  TextDataKey,
  VeevaDataKey,
} from "../../types";
import AEM from "../aem/aem";
import LocalCMS from "../local/LocalCMS";

const aemClient = new AEM();
const localClient = new LocalCMS();

export class HybridCMS implements CMS {
  // Common
  getMetadata = (key: MetadataPageKey) => aemClient.getMetadata(key);
  getResponsiveImage = (key: ResponsiveImageDataKey) =>
    aemClient.getResponsiveImage(key);
  getHeroContent = (key: PageDataKey) => aemClient.getHeroContent(key);
  getFAQContent = (key: PageDataKey) => aemClient.getFAQContent(key);
  getNavContent = () => aemClient.getNavContent();
  getFooterContent = () => aemClient.getFooterContent();
  getEcommerceFooterContent = () => aemClient.getEcommerceFooterContent();
  getReferencesContent = (key: ReferencesPageDataKey) =>
    aemClient.getReferencesContent(key);
  getSignupContent = (key: SignupDataKey) => aemClient.getSignupContent(key);
  getDuplexAccordionContent = (key: DuplexAccordionDataKey) =>
    aemClient.getDuplexAccordionContent(key);
  getDuplexContentList = (key: DuplexContentKey) =>
    aemClient.getDuplexContentList(key);
  getExpertsCarouselContent = () => aemClient.getExpertsCarouselContent();
  getIconItemList = (key: IconItemListKey) => aemClient.getIconItemList(key);
  getTextContent = (key: TextDataKey) => aemClient.getTextContent(key);
  getCountryGateRedirectDialogContent = (countryCode: CountryGateKey) =>
    aemClient.getCountryGateRedirectDialogContent(countryCode);
  getCountryGateDialogContent = () => aemClient.getCountryGateDialogContent();
  getCountryGateSignupDialogContent = () =>
    aemClient.getCountryGateSignupDialogContent();
  getEmailsCollectionModalContent = () =>
    aemClient.getEmailsCollectionModalContent();
  getPreLaunchEmailsCollectionModalContent = () =>
    aemClient.getPreLaunchEmailsCollectionModalContent();
  getVeevaNumber = (key: PageDataKey | VeevaDataKey) =>
    aemClient.getVeevaNumber(key);
  getRawHTMLContent = (key: HTMLContentKey) => aemClient.getRawHTMLContent(key);

  // Privacy Notice Page Content
  getPrivacyNoticeContent = () => aemClient.getPrivacyNoticeContent();

  // Home Page Content
  getHomeNutritionBlockContent = () => aemClient.getHomeNutritionBlockContent();
  getHomeGlucoseInfoBlockContent = () =>
    aemClient.getHomeGlucoseInfoBlockContent();
  getHomeFeaturesContent = () => aemClient.getHomeFeaturesContent();
  getHomeBlogContent = () => localClient.getHomeBlogContent();
  getHomeProductHighlightContent = () =>
    aemClient.getHomeProductHightlightContent();
  getHomeProductHighlightEcommerceContent = () =>
    aemClient.getHomeProductHightlightEcommerceContent();
  getHomeMetabolismMythsContent = () =>
    aemClient.getHomeMetabolismMythsContent();

  // Lingo Experience Content
  getLEResearchInfoBlockContent = () =>
    aemClient.getLEResearchInfoBlockContent();
  getLECoachingAppTabsContent = () => aemClient.getLECoachingAppTabsContent();
  getLECarouselContent = () => aemClient.getLECarouselContent();

  // Product Content
  getProductFeaturesContent = () => aemClient.getProductFeaturesContent();
  getProductCardsContent = (skus: string[]) =>
    aemClient.getProductCardsContent(skus);
  getProductCardContent = (sku: string) => aemClient.getProductCardContent(sku);
  getCheckoutProductsContent = () => aemClient.getCheckoutProductsContent();
  getProductCarouselContent = () => aemClient.getProductCarouselContent();
  getProductDecideDialogContent = () =>
    aemClient.getProductDecideDialogContent();
  getProductFormContent = () => aemClient.getProductFormContent();
  getPDPNextStepsCarouselContent = () =>
    aemClient.getPDPNextStepsCarouselContent();

  // Checkout Content
  getCheckoutSectionContent = () => aemClient.getCheckoutSectionContent();
  getPromotionalCheckoutSectionContent = () =>
    aemClient.getPromotionalCheckoutSectionContent();

  // Promotional Content
  getPromotionalProductCardsContent = (skus: string[]) =>
    aemClient.getPromotionalProductCardsContent(skus);
  getPromotionalProductFormContent = () =>
    aemClient.getPromotionalProductFormContent();

  // Order Confirmation Content
  getCheckoutOrderSummaryContent = () =>
    aemClient.getCheckoutOrderSummaryContent();
  getOrderConfirmationContent = () => aemClient.getOrderConfirmationContent();
  getPromotionalProductCarouselContent = () =>
    aemClient.getPromotionalProductCarouselContent();

  // Not Found Page Content
  getNotFoundContent = () => aemClient.getNotFoundContent();

  // Account Management
  getAccountManagementOrderSummaryContent = () =>
    aemClient.getAccountManagementOrderSummaryContent();
}
