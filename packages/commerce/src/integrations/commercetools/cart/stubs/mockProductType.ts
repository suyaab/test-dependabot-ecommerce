import { ProductTypeReference } from "@commercetools/platform-sdk";

export const mockProductType: ProductTypeReference = {
  typeId: "product-type",
  id: "fake-product-type-id",
  obj: {
    id: "fake-id-1",
    version: 1,
    key: "subscription",
    name: "subscription",
    description: "subscription",
    createdAt: new Date().toISOString(),
    lastModifiedAt: new Date().toISOString(),
  },
};
