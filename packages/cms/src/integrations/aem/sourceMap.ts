import { z } from "zod";

import {
  CountryGateKeySchema,
  DuplexAccordionDataKeySchema,
  DuplexContentKeySchema,
  MetadataPageKeySchema,
  ReferencesPageDataKeySchema,
  ResponsiveImageDataKeySchema,
  SignupDataKeySchema,
} from "../../types";
import sourceMapData from "./source.json";
import sourceVeevaData from "./sourceVeeva.json";

const sourceMapSchema = z.object({
  Metadata: z.record(MetadataPageKeySchema, z.string()),
  Hero: z.record(z.string(), z.string()),
  FAQ: z.record(z.string(), z.string()),
  SignUp: z.record(SignupDataKeySchema, z.string()),
  DuplexAccordion: z.record(DuplexAccordionDataKeySchema, z.string()),
  ResponsiveImage: z.record(ResponsiveImageDataKeySchema, z.string()),
  Duplex: z.record(DuplexContentKeySchema, z.string()),
  References: z.record(ReferencesPageDataKeySchema, z.string()),
  Text: z.record(z.string(), z.string()),
  IconItemList: z.record(z.string(), z.string()),
  CountryGateRedirect: z.record(CountryGateKeySchema, z.string()),
  CountryGateSignup: z.string(),
  CountryGate: z.string(),
  Veeva: z.record(z.string(), z.string()),
  Nav: z.string(),
  Footer: z.string(),
  FooterEcommerce: z.string(),
  Shared: z.record(z.string(), z.string()),
  HP: z.record(z.string(), z.string()),
  LE: z.record(z.string(), z.string()),
  PDP: z.record(z.string(), z.string()),
  Sample: z.record(z.string(), z.string()),
  Checkout: z.record(z.string(), z.string()),
  AccountManagement: z.record(z.string(), z.string()),
  NotFound: z.record(z.string(), z.string()),
  HTML: z.record(z.string(), z.string()),
  PrivacyNotice: z.string(),
});

export type ISourceMap = z.infer<typeof sourceMapSchema>;

export const sourceMap: ISourceMap = sourceMapSchema.parse({
  ...sourceMapData,
  ...sourceVeevaData,
});
