import {
  AccountManagementOrderSummaryContent,
  CarouselItem,
  CheckoutSectionContent,
  CountryGateDialogContent,
  CountryGateKey,
  CountryGateRedirectDialogContent,
  CountryGateSignupDialogContent,
  DuplexAccordion,
  DuplexAccordionDataKey,
  DuplexAccordionItem,
  DuplexContentKey,
  DuplexContentList,
  EmailsCollectionModalContent,
  ExpertsCarouselContent,
  FAQContent,
  FooterContent,
  HeroContent,
  HomeFeatureContentItem,
  HomeFeaturesContent,
  HomeGlucoseInfoBlockContent,
  HomeMetabolismMyths,
  HomeNutritionBlockContent,
  HomeProductHighlightContent,
  HomeProductHighlightEcommerceContent,
  HTMLContentKey,
  IconItemsListContent,
  Metadata,
  MetadataPageKey,
  NavigationContent,
  PageDataKey,
  PrivacyNoticeItem,
  PromotionalCheckoutSectionContent,
  ReferencesContent,
  ReferencesPageDataKey,
  ResponsiveImageContent,
  ResponsiveImageDataKey,
  SignupContent,
  SignupDataKey,
  TextContent,
  TextDataKey,
  VeevaDataKey,
} from "../../types";
import {
  LECarouselContent,
  LECoachingAppTabsContent,
  LEResearchInfoBlockContent,
} from "../../types/lingoExperience";
import { NotFoundContent } from "../../types/notFound";
import {
  CheckoutOrderSummaryContent,
  OrderConfirmationContent,
} from "../../types/orderConfirmation";
import {
  CheckoutProductsContent,
  PDPNextStepsCarouselContent,
  ProductCardContent,
  ProductCarouselContent,
  ProductDecideDialogContent,
  ProductFeaturesContent,
  ProductFormContent,
  SampleProductFormContent,
} from "../../types/products";
import { sourceMap } from "./sourceMap";

// TODO: doublecheck env vars when QA/STG/PROD are available
let AEM_SUBDOMAIN = "cms-d";
switch (process.env.LINGO_ENV) {
  case "qa":
    AEM_SUBDOMAIN = "cms-q";
    break;
  case "stg":
    AEM_SUBDOMAIN = "cms-s";
    break;
  case "prod":
    AEM_SUBDOMAIN = "cms";
    break;
  default:
    break;
}
export const AEM_URL = `https://${AEM_SUBDOMAIN}.hellolingo.com/content/dam/bts/bluebird/dtc/us/`;

const replaceAemImageUrls = (target: ResponsiveImageContent) => {
  if (target.url != null) target.url = target.url.replace("[image]/", AEM_URL);
  if (target.desktopUrl != null)
    target.desktopUrl = target.desktopUrl.replace("[image]/", AEM_URL);

  return target;
};

export default class AEM {
  // Common
  public async getMetadata(key: MetadataPageKey): Promise<Metadata> {
    const { content } = await fetch(
      `${AEM_URL}${sourceMap.Metadata[key]}`,
    ).then((res): Promise<{ content: Metadata }> => res.json());

    return content;
  }

  public async getResponsiveImage(
    key: ResponsiveImageDataKey,
  ): Promise<ResponsiveImageContent> {
    const { content } = await fetch(
      `${AEM_URL}${sourceMap.ResponsiveImage[key]}`,
    ).then((res): Promise<{ content: ResponsiveImageContent }> => res.json());

    return replaceAemImageUrls(content);
  }

  public async getHeroContent(key: PageDataKey): Promise<HeroContent> {
    const {
      content: { image, alignContentX, alignContentY, theme, items },
    } = await fetch(`${AEM_URL}${sourceMap.Hero[key]}`).then(
      (res): Promise<{ content: HeroContent }> => res.json(),
    );

    return {
      image: replaceAemImageUrls(image),
      alignContentX,
      alignContentY,
      theme,
      items,
    };
  }

  public async getFAQContent(key: PageDataKey): Promise<FAQContent> {
    const { content } = await fetch(`${AEM_URL}${sourceMap.FAQ[key]}`).then(
      (res): Promise<{ content: FAQContent }> => res.json(),
    );

    return content;
  }

  public async getNavContent(): Promise<NavigationContent> {
    const { content } = await fetch(`${AEM_URL}${sourceMap.Nav}`).then(
      (res): Promise<{ content: NavigationContent }> => res.json(),
    );

    return content;
  }

  public async getFooterContent(): Promise<FooterContent> {
    const { content } = await fetch(`${AEM_URL}${sourceMap.Footer}`).then(
      (res): Promise<{ content: FooterContent }> => res.json(),
    );

    return content;
  }

  public async getEcommerceFooterContent(): Promise<FooterContent> {
    const { content } = await fetch(
      `${AEM_URL}${sourceMap.FooterEcommerce}`,
    ).then((res): Promise<{ content: FooterContent }> => res.json());

    return content;
  }

  public async getReferencesContent(
    key: Partial<ReferencesPageDataKey>,
  ): Promise<ReferencesContent> {
    const { content } = await fetch(
      `${AEM_URL}${sourceMap.References[key]}`,
    ).then((res): Promise<{ content: ReferencesContent }> => {
      return res.json();
    });

    return content;
  }

  public async getSignupContent(key: SignupDataKey): Promise<SignupContent> {
    const { content } = await fetch(`${AEM_URL}${sourceMap.SignUp[key]}`).then(
      (res): Promise<{ content: SignupContent }> => res.json(),
    );

    return content;
  }

  public async getDuplexAccordionContent(
    key: DuplexAccordionDataKey,
  ): Promise<DuplexAccordion> {
    const {
      content: { commonHTML, items, additionalItems },
    } = await fetch(`${AEM_URL}${sourceMap.DuplexAccordion[key]}`).then(
      (res): Promise<{ content: DuplexAccordion }> => res.json(),
    );

    return {
      commonHTML,
      items: items.map((item: DuplexAccordionItem) => ({
        accordionTitle: {
          icon: replaceAemImageUrls(item.accordionTitle.icon),
          title: item.accordionTitle.title,
        },
        accordionContent: item.accordionContent,
        accordionImage: replaceAemImageUrls(item.accordionImage),
      })),
      additionalItems,
    };
  }

  public async getExpertsCarouselContent(): Promise<ExpertsCarouselContent> {
    const {
      content: { title, subtitle, description, items },
    } = await fetch(`${AEM_URL}${sourceMap.Shared.ExpertsCarousel}`).then(
      (res): Promise<{ content: ExpertsCarouselContent }> => res.json(),
    );

    return {
      title,
      subtitle,
      description,
      items: items.map(({ title, description, image }: CarouselItem) => ({
        title,
        description,
        image: replaceAemImageUrls(image),
      })),
    };
  }

  public async getTextContent(key: TextDataKey): Promise<TextContent> {
    const { content } = await fetch(`${AEM_URL}${sourceMap.Text[key]}`).then(
      (res): Promise<{ content: TextContent }> => res.json(),
    );

    return content;
  }

  public async getRawHTMLContent(key: HTMLContentKey): Promise<string> {
    // get json
    const { contentPath } = await fetch(
      `${AEM_URL}${sourceMap.HTML[key]}`,
    ).then((res): Promise<{ contentPath: string }> => res.json());

    // get html from json
    const content = await fetch(`${AEM_URL}${contentPath}`).then(
      (res): Promise<string> => res.text(),
    );

    return content;
  }

  public async getPrivacyNoticeContent(): Promise<PrivacyNoticeItem[]> {
    // get json
    const { items } = await fetch(`${AEM_URL}${sourceMap.PrivacyNotice}`).then(
      (res): Promise<{ items: string[] }> => res.json(),
    );

    const itemsToReturn = [];

    for (const item of items) {
      // get html from json
      const content = await fetch(`${AEM_URL}${Object.values(item)[0]}`).then(
        (res): Promise<string> => res.text(),
      );

      itemsToReturn.push({
        title: Object.keys(item)[0] ?? "",
        content,
      });
    }

    return itemsToReturn;
  }

  // TODO: finalize AEM movement to shared-components after release
  public async getEmailsCollectionModalContent(): Promise<EmailsCollectionModalContent> {
    const { content } = await fetch(
      `${AEM_URL}${sourceMap.Shared.EmailCollectionModal}`,
    ).then(
      (res): Promise<{ content: EmailsCollectionModalContent }> => res.json(),
    );

    return {
      image: replaceAemImageUrls(content.image),
      heading: content.heading,
      leadText: content.leadText,
      inputPlaceholder: content.inputPlaceholder,
      disclaimer: content.disclaimer,
      buttonLabel: content.buttonLabel,
      dontShowAgainLabel: content.dontShowAgainLabel,
      successfulSubmitHeading: content.successfulSubmitHeading,
      successfulSubmitText: content.successfulSubmitText,
      successfulSubmitButtonLabel: content.successfulSubmitButtonLabel,
    };
  }

  // TODO: finalize AEM movement to shared-components after release
  public async getPreLaunchEmailsCollectionModalContent(): Promise<EmailsCollectionModalContent> {
    const { content } = await fetch(
      `${AEM_URL}${sourceMap.Shared.PreLaunchEmailCollectionModal}`,
    ).then(
      (res): Promise<{ content: EmailsCollectionModalContent }> => res.json(),
    );

    return {
      image: replaceAemImageUrls(content.image),
      heading: content.heading,
      leadText: content.leadText,
      inputPlaceholder: content.inputPlaceholder,
      disclaimer: content.disclaimer,
      buttonLabel: content.buttonLabel,
      dontShowAgainLabel: content.dontShowAgainLabel,
      successfulSubmitHeading: content.successfulSubmitHeading,
      successfulSubmitText: content.successfulSubmitText,
      successfulSubmitButtonLabel: content.successfulSubmitButtonLabel,
    };
  }

  public async getIconItemList(key: string): Promise<IconItemsListContent> {
    const { content } = await fetch(
      `${AEM_URL}${sourceMap.IconItemList[key]}`,
    ).then((res): Promise<{ content: IconItemsListContent }> => res.json());

    return content;
  }

  // TODO: won't be needed after all jsons moved to v2
  public async getVeevaNumber(
    key: PageDataKey | VeevaDataKey,
  ): Promise<TextContent> {
    const content = await fetch(`${AEM_URL}${sourceMap.Veeva[key]}`).then(
      (res): Promise<TextContent> => res.json(),
    );

    return content;
  }

  // Home Page Content
  public async getHomeNutritionBlockContent(): Promise<HomeNutritionBlockContent> {
    const { content } = await fetch(`${AEM_URL}${sourceMap.HP.Nutrition}`).then(
      (res): Promise<{ content: HomeNutritionBlockContent }> => res.json(),
    );

    return content;
  }

  public async getHomeGlucoseInfoBlockContent(): Promise<HomeGlucoseInfoBlockContent> {
    const { content } = await fetch(`${AEM_URL}${sourceMap.HP.Glucose}`).then(
      (res): Promise<{ content: HomeGlucoseInfoBlockContent }> => res.json(),
    );

    return content;
  }

  public async getHomeFeaturesContent(): Promise<HomeFeaturesContent> {
    const { content } = await fetch(`${AEM_URL}${sourceMap.HP.Features}`).then(
      (res): Promise<{ content: HomeFeaturesContent }> => res.json(),
    );

    return {
      items: content?.items?.map(
        ({
          title,
          description,
          mainImage,
          centerImage,
        }: HomeFeatureContentItem) => ({
          title,
          description,
          mainImage: replaceAemImageUrls(mainImage),
          centerImage: replaceAemImageUrls(centerImage),
        }),
      ),
    };
  }

  // TODO: Fix typo `Highlight`
  public async getHomeProductHightlightContent(): Promise<HomeProductHighlightContent> {
    const { content } = await fetch(
      `${AEM_URL}${sourceMap.HP.ProductHighlight}`,
    ).then(
      (res): Promise<{ content: HomeProductHighlightContent }> => res.json(),
    );

    return content;
  }

  public async getHomeProductHightlightEcommerceContent(): Promise<HomeProductHighlightEcommerceContent> {
    const { content } = await fetch(
      `${AEM_URL}${sourceMap.HP.ProductHighlightEcommerce}`,
    ).then(
      (res): Promise<{ content: HomeProductHighlightEcommerceContent }> =>
        res.json(),
    );

    return content;
  }

  public async getHomeMetabolismMythsContent(): Promise<HomeMetabolismMyths> {
    const {
      content: { main, slides },
    } = await fetch(`${AEM_URL}${sourceMap.HP.MetabolismMyths}`).then(
      (res): Promise<{ content: HomeMetabolismMyths }> => res.json(),
    );

    return {
      main: {
        ...main,
        image: replaceAemImageUrls(main.image),
      },
      slides: slides.map((slide) => {
        const modifiedSlide = { ...slide };

        if ("experts" in modifiedSlide && modifiedSlide.experts != null) {
          modifiedSlide.experts = modifiedSlide.experts.map((expert) => ({
            ...expert,
            image: replaceAemImageUrls(expert.image),
          }));
        }

        return modifiedSlide;
      }),
    };
  }

  // Lingo Experience Content
  public async getLEResearchInfoBlockContent(): Promise<LEResearchInfoBlockContent> {
    const { content } = await fetch(
      `${AEM_URL}${sourceMap.LE.ResearchInfo}`,
    ).then(
      (res): Promise<{ content: LEResearchInfoBlockContent }> => res.json(),
    );

    return content;
  }

  // Duplex Content List
  public async getDuplexContentList(
    key: DuplexContentKey,
  ): Promise<DuplexContentList> {
    const URL = `${AEM_URL}${sourceMap.Duplex[key]}`;
    const { content } = await fetch(URL).then(
      (res): Promise<{ content: DuplexContentList }> => res.json(),
    );

    return content?.map((item) => {
      return {
        ...item,
        image: replaceAemImageUrls(item.image),
      };
    });
  }

  public async getLECoachingAppTabsContent(): Promise<LECoachingAppTabsContent> {
    const {
      content: { title, description, tabs },
    } = await fetch(`${AEM_URL}${sourceMap.LE.CoachingTabs}`).then(
      (res): Promise<{ content: LECoachingAppTabsContent }> => res.json(),
    );

    return {
      title,
      description,
      tabs: tabs.map((tab) => ({
        title: tab.title,
        text: tab.text,
        invertTextColor: tab.invertTextColor,
        image: replaceAemImageUrls(tab.image),
        phoneImage: replaceAemImageUrls(tab.phoneImage),
      })),
    };
  }

  public async getLECarouselContent(): Promise<LECarouselContent> {
    const {
      content: { title, items },
    } = await fetch(`${AEM_URL}${sourceMap.LE.ExperienceCarousel}`).then(
      (res): Promise<{ content: LECarouselContent }> => res.json(),
    );

    return {
      title,
      items: items?.map(({ title, description, image }: CarouselItem) => ({
        title,
        description,
        image: replaceAemImageUrls(image),
      })),
    };
  }

  public async getCountryGateRedirectDialogContent(
    countryCode: CountryGateKey,
  ): Promise<CountryGateRedirectDialogContent> {
    const { content } = await fetch(
      `${AEM_URL}${sourceMap.CountryGateRedirect[countryCode]}`,
    ).then(
      (res): Promise<{ content: CountryGateRedirectDialogContent }> =>
        res.json(),
    );

    return content;
  }

  public async getCountryGateSignupDialogContent(): Promise<CountryGateSignupDialogContent> {
    const { content } = await fetch(
      `${AEM_URL}${sourceMap.CountryGateSignup}`,
    ).then(
      (res): Promise<{ content: CountryGateSignupDialogContent }> => res.json(),
    );

    return content;
  }

  public async getCountryGateDialogContent(): Promise<CountryGateDialogContent> {
    const { content } = await fetch(`${AEM_URL}${sourceMap.CountryGate}`).then(
      (res): Promise<{ content: CountryGateDialogContent }> => res.json(),
    );

    return content;
  }

  public async getCheckoutProductsContent(): Promise<CheckoutProductsContent> {
    const { content } = await fetch(`${AEM_URL}${sourceMap.PDP.Products}`).then(
      (res): Promise<{ content: { items: ProductCardContent[] } }> =>
        res.json(),
    );

    const products: CheckoutProductsContent = {};
    content.items.forEach(
      (product) =>
        (products[product.sku] = {
          ...product,
          image: replaceAemImageUrls(product.image),
        }),
    );

    return products;
  }

  public async getProductCardsContent(
    skus: string[],
  ): Promise<ProductCardContent[]> {
    const { content } = await fetch(`${AEM_URL}${sourceMap.PDP.Products}`).then(
      (res): Promise<{ content: { items: ProductCardContent[] } }> =>
        res.json(),
    );

    const filteredProducts = content.items.filter((p) => skus.includes(p.sku));

    return filteredProducts.map((product) => {
      product.image = replaceAemImageUrls(product.image);
      return product;
    });
  }

  public async getProductCardContent(sku: string): Promise<ProductCardContent> {
    const pdpSKUContent = fetch(`${AEM_URL}${sourceMap.PDP.Products}`)
      .then(
        (res): Promise<{ content: { items: ProductCardContent[] } }> =>
          res.json(),
      )
      .then((resp) => resp.content.items.find((p) => sku === p.sku));

    const promotionalPDPContent = fetch(
      `${AEM_URL}${sourceMap.Sample.Products}`,
    )
      .then(
        (res): Promise<{ content: { items: ProductCardContent[] } }> =>
          res.json(),
      )
      .then((resp) => resp.content.items.find((p) => sku === p.sku));

    const responses = await Promise.allSettled([
      pdpSKUContent,
      promotionalPDPContent,
    ]);

    if (responses[0].status === "fulfilled" && responses[0].value != null) {
      return {
        ...responses[0].value,
        image: replaceAemImageUrls(responses[0].value.image),
      };
    }

    if (responses[1].status === "fulfilled" && responses[1].value != null) {
      return {
        ...responses[1].value,
        image: replaceAemImageUrls(responses[1].value.image),
      };
    }

    throw new Error(`Unable to find content for sku ${sku}`);
  }

  public async getCheckoutOrderSummaryContent(): Promise<CheckoutOrderSummaryContent> {
    const { content } = await fetch(
      `${AEM_URL}${sourceMap.Checkout.OrderSummary}`,
    ).then(
      (res): Promise<{ content: CheckoutOrderSummaryContent }> => res.json(),
    );

    return {
      ...content,
      moneybackImage: replaceAemImageUrls(content.moneybackImage),
    };
  }

  public async getOrderConfirmationContent(): Promise<OrderConfirmationContent> {
    const { content } = await fetch(
      `${AEM_URL}${sourceMap.Checkout.OrderConfirmation}`,
    ).then((res): Promise<{ content: OrderConfirmationContent }> => res.json());

    return content;
  }

  public async getProductCarouselContent(): Promise<ProductCarouselContent> {
    const {
      content: { items, eligibleTag, compatibleTag },
    } = await fetch(`${AEM_URL}${sourceMap.PDP.ProductCarousel}`).then(
      (res): Promise<{ content: ProductCarouselContent }> => res.json(),
    );

    return {
      items: items.map((item) => replaceAemImageUrls(item)),
      eligibleTag,
      compatibleTag,
    };
  }

  public async getProductFeaturesContent(): Promise<ProductFeaturesContent> {
    const { content } = await fetch(`${AEM_URL}${sourceMap.PDP.Features}`).then(
      (res): Promise<{ content: ProductFeaturesContent }> => res.json(),
    );
    return content;
  }

  public async getProductDecideDialogContent(): Promise<ProductDecideDialogContent> {
    const {
      content: { title, description, image, items, triggerContent },
    } = await fetch(`${AEM_URL}${sourceMap.PDP.DecideDialog}`).then(
      (res): Promise<{ content: ProductDecideDialogContent }> => res.json(),
    );
    return {
      title,
      description,
      image: replaceAemImageUrls(image),
      items,
      triggerContent,
    };
  }

  public async getProductFormContent(): Promise<ProductFormContent> {
    const { content } = await fetch(
      `${AEM_URL}${sourceMap.PDP.FormContent}`,
    ).then((res): Promise<{ content: ProductFormContent }> => res.json());
    return content;
  }

  public async getPDPNextStepsCarouselContent(): Promise<PDPNextStepsCarouselContent> {
    const {
      content: { title, items },
    } = await fetch(`${AEM_URL}${sourceMap.PDP.NextCarousel}`).then(
      (res): Promise<{ content: PDPNextStepsCarouselContent }> => res.json(),
    );

    return {
      title,
      items: items?.map(({ title, description, image }: CarouselItem) => ({
        title,
        description,
        image: replaceAemImageUrls(image),
      })),
    };
  }

  public async getNotFoundContent(): Promise<NotFoundContent> {
    const { content } = await fetch(
      `${AEM_URL}${sourceMap.NotFound.NotFoundContent}`,
    ).then((res): Promise<{ content: NotFoundContent }> => res.json());
    return content;
  }

  public async getPromotionalProductCardsContent(
    skus: string[],
  ): Promise<ProductCardContent[]> {
    const { content } = await fetch(
      `${AEM_URL}${sourceMap.Sample.Products}`,
    ).then(
      (res): Promise<{ content: { items: ProductCardContent[] } }> =>
        res.json(),
    );

    const filteredProducts = content.items.filter((p) => skus.includes(p.sku));

    return filteredProducts.map((product) => {
      product.image = replaceAemImageUrls(product.image);
      return product;
    });
  }

  public async getPromotionalProductFormContent(): Promise<SampleProductFormContent> {
    const { content } = await fetch(
      `${AEM_URL}${sourceMap.Sample.FormContent}`,
    ).then((res): Promise<{ content: SampleProductFormContent }> => res.json());
    return content;
  }

  public async getPromotionalProductCarouselContent(): Promise<ProductCarouselContent> {
    const {
      content: { items, eligibleTag, compatibleTag },
    } = await fetch(`${AEM_URL}${sourceMap.Sample.ProductCarousel}`).then(
      (res): Promise<{ content: ProductCarouselContent }> => res.json(),
    );

    return {
      items: items.map((item) => replaceAemImageUrls(item)),
      eligibleTag,
      compatibleTag,
    };
  }

  public async getCheckoutSectionContent(): Promise<CheckoutSectionContent> {
    const { content } = await fetch(
      `${AEM_URL}${sourceMap.Checkout.Sections}`,
    ).then((res): Promise<{ content: CheckoutSectionContent }> => res.json());
    return content;
  }

  public async getPromotionalCheckoutSectionContent(): Promise<PromotionalCheckoutSectionContent> {
    const { content } = await fetch(
      `${AEM_URL}${sourceMap.Checkout.PromotionalSections}`,
    ).then(
      (res): Promise<{ content: PromotionalCheckoutSectionContent }> =>
        res.json(),
    );
    return content;
  }

  public async getAccountManagementOrderSummaryContent(): Promise<AccountManagementOrderSummaryContent> {
    const { content } = await fetch(
      `${AEM_URL}${sourceMap.AccountManagement.OrderSummary}`,
    ).then(
      (res): Promise<{ content: AccountManagementOrderSummaryContent }> =>
        res.json(),
    );
    return content;
  }
}
