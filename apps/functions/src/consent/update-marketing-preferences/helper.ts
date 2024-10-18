import {
  SUBSCRIBED_CONSENT_STATUSES,
  UNSUBSCRIBED_CONSENT_STATUSES,
} from "@ecommerce/consent";

export interface MarketingPurpose {
  id: string;
  status: string;
}

export const checkUniformStatus = (marketingPurposes: MarketingPurpose[]) => {
  return (
    marketingPurposes.every((purpose) =>
      SUBSCRIBED_CONSENT_STATUSES.includes(purpose.status),
    ) ||
    marketingPurposes.every((purpose) =>
      UNSUBSCRIBED_CONSENT_STATUSES.includes(purpose.status),
    )
  );
};
