import { CollectionPoint } from "../ConsentManager";
import { env } from "./env";

export interface Purpose {
  id: string;
  transactionType: "CONFIRMED" | "NOTGIVEN" | "WITHDRAWN";
}

export interface PurposeIds {
  marketing: string;
  marketingGeneral: string;
  marketingNonLocal: string;
  termsOfSale: string;
  privacyNotice: string;
}

export const PURPOSE_IDS: Record<string, Record<string, PurposeIds>> = {
  US: {
    local: {
      marketing: "a07aa9e6-db16-42b0-9b68-743653c3ab6d",
      marketingGeneral: "a07aa9e6-db16-42b0-9b68-743653c3ab6d",
      marketingNonLocal: "a07aa9e6-db16-42b0-9b68-743653c3ab6d",
      termsOfSale: "0b27c8f4-12ba-472a-af0b-644fe7df48f1",
      privacyNotice: "e75feb83-1980-418e-a516-bf41335ffd6d",
    },
    dev: {
      marketing: "a07aa9e6-db16-42b0-9b68-743653c3ab6d",
      marketingGeneral: "a07aa9e6-db16-42b0-9b68-743653c3ab6d",
      marketingNonLocal: "a07aa9e6-db16-42b0-9b68-743653c3ab6d",
      termsOfSale: "0b27c8f4-12ba-472a-af0b-644fe7df48f1",
      privacyNotice: "e75feb83-1980-418e-a516-bf41335ffd6d",
    },
    qa: {
      marketing: "6e34d33f-e36e-4899-a52c-3dcf58e00e99",
      marketingGeneral: "6e34d33f-e36e-4899-a52c-3dcf58e00e99",
      marketingNonLocal: "6e34d33f-e36e-4899-a52c-3dcf58e00e99",
      termsOfSale: "9f916f4e-0a26-4a0f-97a4-2c6fc0cc5892",
      privacyNotice: "7aba6d70-c591-40d8-9436-a3f621b16f4f",
    },
    stg: {
      marketing: "5f6131ea-edb9-4406-9c7c-807787821260",
      marketingGeneral: "5f6131ea-edb9-4406-9c7c-807787821260",
      marketingNonLocal: "5f6131ea-edb9-4406-9c7c-807787821260",
      termsOfSale: "cb7b64dc-2288-4102-8ba9-f39ff25875b9",
      privacyNotice: "5fb70eb7-4cdf-45eb-9489-3c34a1ada7c0",
    },
    prod: {
      marketing: "5ef95eb3-21cc-4db2-a5c4-a95a3b100653",
      marketingGeneral: "5ef95eb3-21cc-4db2-a5c4-a95a3b100653",
      marketingNonLocal: "5ef95eb3-21cc-4db2-a5c4-a95a3b100653",
      termsOfSale: "79824fa4-798b-4811-974d-fe52de5c140f",
      privacyNotice: "536b689a-0356-4dfa-a676-be98b7ba4b67",
    },
  },
  UK: {
    local: {
      marketing: "1a0c07f3-de87-418b-b6e0-9cd5386aff76",
      marketingGeneral: "3d462846-26bd-41a4-8ed4-3e8cc20a6e1b",
      marketingNonLocal: "e0e8184c-2bec-4031-9656-99d412ddcae9", // marketingNonUK
      termsOfSale: "542de212-755e-459c-a086-eea977d8112b",
      privacyNotice: "6d370046-07c1-4f38-a353-93b25724d310",
    },
    dev: {
      marketing: "1a0c07f3-de87-418b-b6e0-9cd5386aff76",
      marketingGeneral: "3d462846-26bd-41a4-8ed4-3e8cc20a6e1b",
      marketingNonLocal: "e0e8184c-2bec-4031-9656-99d412ddcae9",
      termsOfSale: "542de212-755e-459c-a086-eea977d8112b",
      privacyNotice: "6d370046-07c1-4f38-a353-93b25724d310",
    },
    qa: {
      marketing: "72b17b17-3e10-41ea-a708-c03f93d17cbc",
      marketingGeneral: "87a19b69-0150-4985-8223-a12662ecb346",
      marketingNonLocal: "73a9da03-4d94-44bb-bebb-3d99a69d8c9e",
      termsOfSale: "b03e7ed2-fb7d-4d61-a849-d36806fa2bd1",
      privacyNotice: "4eb850a6-ba13-44dd-96e5-8122fb2512f6",
    },
    stg: {
      marketing: "7c92ccb4-751d-44f3-9317-d2c70cae83d9",
      marketingGeneral: "a9d5b324-aea7-421c-b073-e5a3ac7c835b",
      marketingNonLocal: "3c695b9c-b92b-4c5a-9bda-d2129a21edaf",
      termsOfSale: "8da67eda-926e-44be-b310-3d1f8ec98abf",
      privacyNotice: "1cce2557-2f4d-4955-9749-92d932dce314",
    },
    prod: {
      marketing: "552cb063-54e5-4e32-95b2-c45a25d039ca",
      marketingGeneral: "79d8d6f1-7c00-4ca3-836b-7f10cd6dee1e",
      marketingNonLocal: "8e050118-5772-429b-a8a6-5349cc1d6d1e",
      termsOfSale: "71959768-6f83-43c3-90d5-a538cc3053d4",
      privacyNotice: "4b6d85a0-4252-49ea-893e-18295c68630f",
    },
  },
};

export function getPurposeIds(country: string, env: string): PurposeIds {
  const purposeIds = PURPOSE_IDS[country];

  if (purposeIds == null) {
    throw new Error(`Not able to get purpose ids for country: ${country}`);
  }

  const ids = purposeIds[env];

  if (ids == null) {
    throw new Error("Not able to get purpose ids");
  }

  return ids;
}

export function getPurposes(
  collectionPoint: CollectionPoint,
  hasMarketingConsent: boolean,
  country = "US",
): Purpose[] {
  const purposeIds = getPurposeIds(country, env.LINGO_ENV);

  // We can't send the same purpose id twice in the same request
  // but for UK we need to unsubscribe from all marketing
  // TODO: We should be able to fix One Trust purposes for UK

  if (country === "UK" && collectionPoint === "UNSUBSCRIBE") {
    return [
      {
        id: purposeIds.marketing,
        transactionType: "WITHDRAWN",
      },
      {
        id: purposeIds.marketingGeneral,
        transactionType: "WITHDRAWN",
      },
      {
        id: purposeIds.marketingNonLocal,
        transactionType: "WITHDRAWN",
      },
    ];
  }

  const consentPurposes: Record<CollectionPoint, Purpose[]> = {
    COMPLETE_PURCHASE: [
      {
        id: purposeIds.marketing,
        transactionType: hasMarketingConsent ? "CONFIRMED" : "NOTGIVEN",
      },
      {
        id: purposeIds.privacyNotice,
        transactionType: "CONFIRMED",
      },
      {
        id: purposeIds.termsOfSale,
        transactionType: "CONFIRMED",
      },
    ],
    NO_PURCHASE: [
      {
        id: purposeIds.marketingGeneral,
        transactionType: "CONFIRMED",
      },
      {
        id: purposeIds.privacyNotice,
        transactionType: "CONFIRMED",
      },
    ],
    OTHER_COUNTRY: [
      {
        id: purposeIds.marketingNonLocal,
        transactionType: "CONFIRMED",
      },
      {
        id: purposeIds.privacyNotice,
        transactionType: "CONFIRMED",
      },
    ],
    UNSUBSCRIBE: [
      {
        id: purposeIds.marketing,
        transactionType: "WITHDRAWN",
      },
    ],
  };

  return consentPurposes[collectionPoint];
}
