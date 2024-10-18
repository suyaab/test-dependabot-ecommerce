import { z } from "zod";

export const PageDataKeySchema = z.enum([
  "Home",
  "LingoExperience",
  "TheScience",
  "AboutUs",
  "PDP",
  "PrivacyNotice",
  "SocialMediaTermsOfUse",
  "TermsOfUse",
  "Unsubscribe",
  "EULA",
  "TermsOfSale",
  "Login",
]);
export type PageDataKey = z.infer<typeof PageDataKeySchema>;

export const ButtonSchema = z.object({
  typename: z.literal("Button"),
  data: z.object({
    text: z.string(),
    url: z.string(),
    variant: z.string(),
    analyticsActionAttribute: z.string().optional(),
    analyticsLocationAttribute: z.string().optional(),
  }),
});

export type Button = z.infer<typeof ButtonSchema>;

export const TextDataKeySchema = z.enum([
  "LEWhatToExpect",
  "TheScienceTopText",
  "AboutUsTopText",
  "LEReferenceText",
  "PromoBar",
]);
export type TextDataKey = z.infer<typeof TextDataKeySchema>;

// Most likely this is going to be a RichText
export const TextSchema = z.object({
  typename: z.literal("Text"),
  data: z.string(),
});

export type TextContent = z.infer<typeof TextSchema>;

export const MultipleContentItemsSchema = z.array(
  z.union([ButtonSchema, TextSchema]),
);

export type MultipleContentItems = z.infer<typeof MultipleContentItemsSchema>;

export const NavigationSchema = z.object({
  typename: z.literal("Navigation"),
  items: z.array(
    z.object({
      title: z.string(),
      link: z.string(),
    }),
  ),
  button: ButtonSchema,
});

export const SignupContentSchema = z.object({
  description: TextSchema,
  placeholder: TextSchema,
  additionalText: TextSchema,
});

export type SignupContent = z.infer<typeof SignupContentSchema>;

export const SignupDataKeySchema = z.enum(["Footer", "FooterEcommerce"]);
export type SignupDataKey = z.infer<typeof SignupDataKeySchema>;

export type NavigationContent = z.infer<typeof NavigationSchema>;

export const MetadataPageKeySchema = z.enum([
  "Default",
  "NotFound",
  "Home",
  "LingoExperience",
  "TheScience",
  "AboutUs",
  "PrivacyNotice",
  "TermsOfUse",
  "TermsOfSale",
  "SocialMediaTermsOfUse",
  "EULA",
  "PDP",
  "Checkout",
  "OrderConfirmation",
  "OrderReturns",
  "OrderTracking",
  "Account",
  "Unsubscribe",
  "Login",
]);
export type MetadataPageKey = z.infer<typeof MetadataPageKeySchema>;

export const MetadataSchema = z.object({
  title: z.string(),
  description: z.string(),
  openGraph: z.object({
    title: z.string(),
    description: z.string(),
  }),
  icons: z
    .object({
      icon: z.array(z.string()),
      shortcut: z.string(),
      apple: z.object({
        url: z.string(),
        sizes: z.string(),
        type: z.string(),
      }),
      other: z.object({
        rel: z.string(),
        url: z.string(),
      }),
    })
    .optional(),
  manifest: z.string(),
  alternates: z
    .object({
      canonical: z.string(),
    })
    .optional(),
});

export type Metadata = z.infer<typeof MetadataSchema>;

export const ResponsiveImageSchema = z.object({
  url: z.string(),
  desktopUrl: z.string(),
  width: z.number(),
  height: z.number(),
  desktopWidth: z.number(),
  desktopHeight: z.number(),
  alt: z.string(),
  quality: z.number().optional(),
});

export type ResponsiveImageContent = z.infer<typeof ResponsiveImageSchema>;

export const ResponsiveImageDataKeySchema = z.enum([
  "HomeHeroEligible",
  "HomeHeroFDACleared",
  "HomeFeatures",
  "HomeNutrition",
  "HomeProductHighlight",
  "NotFound",
]);
export type ResponsiveImageDataKey = z.infer<
  typeof ResponsiveImageDataKeySchema
>;

export const FAQSchema = z.object({
  enabled: z.boolean().optional(),
  title: z.string(),
  suptitle: z.string(),
  items: z.array(
    z.object({
      title: z.string(),
      data: z.string(),
    }),
  ),
});

export type FAQContent = z.infer<typeof FAQSchema>;

export const ReferencesPageDataKeySchema = z.enum(["TheScience"]);
export type ReferencesPageDataKey = z.infer<typeof ReferencesPageDataKeySchema>;

export const ReferencesSchema = z.object({
  title: z.string(),
  items: z.array(z.string()),
});

export type ReferencesContent = z.infer<typeof ReferencesSchema>;

export const HeroContentSchema = z.object({
  image: ResponsiveImageSchema,
  alignContentX: z.string(),
  alignContentY: z.string(),
  theme: z.string(),
  items: MultipleContentItemsSchema,
});

export type HeroContent = z.infer<typeof HeroContentSchema>;

export const FooterLinkSchema = z.object({
  title: z.string(),
  link: z.string(),
  prefetch: z.boolean(),
});

export type FooterLink = z.infer<typeof FooterLinkSchema>;

export const FooterLinksStackSchema = z.object({
  title: z.string(),
  items: z.array(FooterLinkSchema),
});

export type FooterLinksStack = z.infer<typeof FooterLinksStackSchema>;

export const GeolocationOptionsSchema = z.object({
  countryCode: z.enum(["US", "GB"]),
  label: z.string(),
  url: z.string(),
  iconName: z.string(),
});

export type GeolocationOptions = z.infer<typeof GeolocationOptionsSchema>;

export const FooterContentSchema = z.object({
  exploreLinks: FooterLinksStackSchema,
  supportLinks: FooterLinksStackSchema,
  connectLinks: FooterLinksStackSchema,
  legalLinks: FooterLinksStackSchema,
  infoText: TextSchema,
  copyright: TextSchema,
  geolocationOptions: z.array(GeolocationOptionsSchema),
});

export type FooterContent = z.infer<typeof FooterContentSchema>;

export const DuplexAccordionItemSchema = z.object({
  accordionTitle: z.object({
    icon: ResponsiveImageSchema,
    title: z.string(),
  }),
  accordionContent: z.string(),
  accordionImage: ResponsiveImageSchema,
});

export type DuplexAccordionItem = z.infer<typeof DuplexAccordionItemSchema>;

export const DuplexAccordionSchema = z.object({
  commonHTML: z.string(),
  items: z.array(DuplexAccordionItemSchema),
  additionalItems: z.optional(MultipleContentItemsSchema),
});

export type DuplexAccordion = z.infer<typeof DuplexAccordionSchema>;

export const FeatBlogEntrySchema = z.object({
  cat: z.object({
    name: z.string(),
    url: z.string(),
  }),
  title: z.string(),
  link: z.string(),
  image: ResponsiveImageSchema,
});

export const DuplexAccordionDataKeySchema = z.enum([
  "HomeScience",
  "LingoExperienceBiosensor",
]);
export type DuplexAccordionDataKey = z.infer<
  typeof DuplexAccordionDataKeySchema
>;

export type FeatBlogEntry = z.infer<typeof FeatBlogEntrySchema>;

export const DuplexTitleSchema = z.object({
  tag: z.enum(["h2", "h3", "h4"]),
  text: z.string(),
});

export const DuplexCalloutSchema = z.object({
  header: z.string(),
  text: z.string(),
});

export const DuplexContentLayoutSchema = z.enum([
  "imageLeftDesktop",
  "imageRightDesktop",
]);

export const DuplexContentSchema = z.object({
  text: z.string(),
  title: DuplexTitleSchema,
  image: ResponsiveImageSchema,
  eyebrow: z.string().optional(),
  callout: DuplexCalloutSchema.optional(),
  layout: DuplexContentLayoutSchema.optional(),
});

export const DuplexContentListSchema = z.array(DuplexContentSchema);

export const DuplexContentKeySchema = z.enum([
  "AboutUs",
  "LingoExperience",
  "Science",
  "ScienceStudy",
]);
export type DuplexContentKey = z.infer<typeof DuplexContentKeySchema>;

export type DuplexContent = z.infer<typeof DuplexContentSchema>;
export type DuplexContentList = z.infer<typeof DuplexContentListSchema>;
export type DuplexTitle = z.infer<typeof DuplexTitleSchema>;
export type DuplexCallout = z.infer<typeof DuplexCalloutSchema>;
export type DuplexContentLayout = z.infer<typeof DuplexContentLayoutSchema>;

export const CarouselItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: ResponsiveImageSchema,
});

export type CarouselItem = z.infer<typeof CarouselItemSchema>;

export const ExpertsCarouselContentSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  description: z.string(),
  items: z.array(CarouselItemSchema),
});

export type ExpertsCarouselContent = z.infer<
  typeof ExpertsCarouselContentSchema
>;

export const EmailsCollectionModalContentSchema = z.object({
  image: ResponsiveImageSchema,
  heading: z.string(),
  leadText: z.string().optional(),
  inputPlaceholder: z.string(),
  disclaimer: z.object({
    content: z.string(),
    route: z
      .object({
        text: z.string(),
        url: z.string(),
      })
      .optional(),
  }),
  buttonLabel: z.string(),
  dontShowAgainLabel: z.string().optional(),
  successfulSubmitHeading: z.string(),
  successfulSubmitText: z.string(),
  successfulSubmitButtonLabel: z.string(),
});

export type EmailsCollectionModalContent = z.infer<
  typeof EmailsCollectionModalContentSchema
>;

export const IconItemListKeySchema = z.enum([
  "TheScienceFuelBetter",
  "LEBiosensorFeatures",
]);
export type IconItemListKey = z.infer<typeof IconItemListKeySchema>;

export const IconItemsListContentSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  items: z.array(
    z.object({
      icon: z.string(),
      title: z.string(),
      text: z.string(),
    }),
  ),
});

export type IconItemsListContent = z.infer<typeof IconItemsListContentSchema>;

/**
 * COUNTRY GATE CONTENT
 */
export const CountryGateKeySchema = z.enum(["US", "PR", "GB"]);
export type CountryGateKey = z.infer<typeof CountryGateKeySchema>;

export const CountryGateRedirectDialogContentSchema = z.object({
  type: z.literal("redirect"),
  headerText: z.string(),
  choiceText: z.string(),
  yesLabel: z.string(),
  noLabel: z.string(),
  redirectToUrl: z.string(),
  redirectToStoreName: z.string(),
});

export type CountryGateRedirectDialogContent = z.infer<
  typeof CountryGateRedirectDialogContentSchema
>;

export const CountryGateSignupDialogContentSchema = z.object({
  type: z.literal("signup"),
  headerText: z.string(),
  leadText: z.string(),
  emailCapture: z.object({
    emailInputPlaceholder: z.string(),
    submitButtonLabel: z.string(),
    disclaimer: z.string(),
    successHeaderText: z.string(),
    successLeadText: z.string(),
    successSubmitButtonLabel: z.string(),
    emailInputInvalidMessage: z.string(),
  }),
});

export type CountryGateSignupDialogContent = z.infer<
  typeof CountryGateSignupDialogContentSchema
>;

export const CountryGateDialogContentSchema = z.object({
  type: z.literal("unsupported"),
  headerText: z.string(),
  leadText: z.string().optional(),
});

export type CountryGateDialogContent = z.infer<
  typeof CountryGateDialogContentSchema
>;

export type CountryGateContent =
  | CountryGateDialogContent
  | CountryGateRedirectDialogContent
  | CountryGateSignupDialogContent;

/**
 * VEEVA
 */
export const VeevaDataKeySchema = z.enum([
  "Navigation",
  "Footer",
  "EmailsCollectionModal",
  "PreLaunchEmailsCollectionModal",
  "CountryGateModal",
  "ExpertsCarousel",
]);
export type VeevaDataKey = z.infer<typeof VeevaDataKeySchema>;

export const RegionGateDialogContentSchema = z.object({
  heading: z.string(),
  leadText: z.string().optional(),
  inputPlaceholder: z.string(),
  disclaimer: z.string(),
  successfulSubmitHeading: z.string(),
  successfulSubmitText: z.string(),
  successfulSubmitButtonLabel: z.string(),
});

export type RegionGateDialogContent = z.infer<
  typeof RegionGateDialogContentSchema
>;

export const EmailSignupFormSchema = z.object({
  checkboxOver18: z.boolean().refine((bool) => bool, {
    message: "must check the over 18 checkbox",
  }),
  inputEmail: z.string().email("BAD EMAIL ADDRESS"),
});

export type EmailSignupForm = z.infer<typeof EmailSignupFormSchema>;

export const HTMLContentKeySchema = z.enum([
  "PrivacyNotice",
  "TermsOfUse",
  "TermsOfSale",
  "SocialMediaTermsOfUse",
  "EULA",
]);
export type HTMLContentKey = z.infer<typeof HTMLContentKeySchema>;
