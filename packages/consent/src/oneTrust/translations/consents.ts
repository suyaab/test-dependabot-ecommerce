import { z } from "zod";

import { Consent, consentSchema } from "../../ConsentManager";

export const onetrustConsentsSchema = z
  .object({
    id: z.string(),
    identifier: z.string(),
    linkToken: z.string(),
    createdDate: z.coerce.date(),
    lastUpdatedDate: z.coerce.date(),
    purposes: z.array(
      z
        .object({
          id: z.string(),
          lastReceiptId: z.string(),
          name: z.string(),
          status: z.string(),
          consentDate: z.coerce.date(),
          version: z.number(),
        })
        .passthrough(),
    ),
  })
  .passthrough();

export type OneTrustConsents = z.infer<typeof onetrustConsentsSchema>;

export default function translateOneTrustConsent(
  onetrustConsents: OneTrustConsents,
): Consent {
  return consentSchema.parse({
    externalId: onetrustConsents.identifier,
    portalToken: onetrustConsents.linkToken,
    purposes: onetrustConsents.purposes.map((purpose) => ({
      id: purpose.id,
      name: purpose.name,
      version: purpose.version,
      status: purpose.status,
    })),
  });
}
