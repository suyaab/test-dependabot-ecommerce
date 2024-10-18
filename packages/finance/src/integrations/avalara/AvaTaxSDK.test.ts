import { Address, AddressCountryCode } from "@ecommerce/utils";

import AvataxSDK from "./AvaTaxSDK";
import avataxTransactionObj from "./stubs/avataxTransactionObj";

vi.mock("avatax", () => ({
  default: vi.fn().mockImplementation(() => {
    return {
      withSecurity: vi.fn().mockReturnThis(),
      createTransaction: vi.fn().mockResolvedValue(avataxTransactionObj),
    };
  }),
}));

vi.mock("node:https", () => ({
  default: {
    Agent: vi.fn(),
  },
}));

vi.mock("./env", () => ({
  env: {
    LINGO_ENV: "test",
    AVALARA_ACCOUNT_ID: "test",
    AVALARA_LICENSE_KEY: "test",
  },
}));

const mockCountryCode: AddressCountryCode = "US";
const mockCurrency = "USD";

describe("AvataxSDK", () => {
  let avataxSDK: AvataxSDK;

  beforeEach(() => {
    avataxSDK = new AvataxSDK();
  });

  it("createTaxTransaction should return tax data", async () => {
    const address: Address = {
      firstName: "test",
      lastName: "test",
      addressLine1: "123 Test St",
      addressLine2: "123 Test St",
      city: "Test City",
      state: "CA",
      countryCode: mockCountryCode,
      postalCode: "12345",
    };
    const amount = 100;
    const sku = "test-item";

    const taxData = await avataxSDK.createTaxTransaction(
      address,
      amount,
      sku,
      "mock-order-number",
      "mock-customer-number",
    );
    expect(taxData.currency).toBe(mockCurrency);
    expect(taxData.totalTaxCalculated).toBe(0);
    expect(taxData.subTaxRate).length.greaterThanOrEqual(1);
  });

  it("getTaxAmount should return correct tax data", async () => {
    const address: Address = {
      firstName: "test",
      lastName: "test",
      addressLine1: "123 Test St",
      addressLine2: "123 Test St",
      city: "Test City",
      state: "CA",
      countryCode: mockCountryCode,
      postalCode: "12345",
    };
    const amount = 100;
    const itemCode = "test-item";

    const taxData = await avataxSDK.getTaxAmount(address, amount, itemCode);
    expect(taxData.currency).toBe(mockCurrency);
    expect(taxData.totalTaxCalculated).toBe(0);
    expect(taxData.subTaxRate).length.greaterThanOrEqual(1);
  });
});
