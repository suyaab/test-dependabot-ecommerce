import { getPurposes } from "./consentPurposes";

vi.mock("./env", () => ({
  env: {
    LINGO_ENV: "qa",
  },
}));

describe("consentPurposes", () => {
  describe("getPurposes", () => {
    it("should return consent purposes for complete purchase collection point with marketing consent", () => {
      const collectionPoints = getPurposes("COMPLETE_PURCHASE", true);

      expect(collectionPoints).toHaveLength(3);
      expect(
        collectionPoints?.every(
          (point) => point.transactionType === "CONFIRMED",
        ),
      );
    });

    it("should return consent purposes for complete purchase collection point without marketing consent", () => {
      const collectionPoints = getPurposes("COMPLETE_PURCHASE", false);

      expect(collectionPoints).toHaveLength(3);
      expect(
        collectionPoints
          ?.slice(1)
          ?.every((point) => point.transactionType === "CONFIRMED"),
      );
      expect(collectionPoints?.[0]?.transactionType).toBe("NOTGIVEN");
    });

    it("should return consent purposes for no purchase collection point", () => {
      const collectionPoints = getPurposes("NO_PURCHASE", false);

      expect(collectionPoints).toHaveLength(2);
      expect(
        collectionPoints?.every(
          (point) => point.transactionType === "CONFIRMED",
        ),
      );
    });

    it("should return consent purposes for other country collection point", () => {
      const collectionPoints = getPurposes("OTHER_COUNTRY", false);

      expect(collectionPoints).toHaveLength(2);
      expect(
        collectionPoints?.every(
          (point) => point.transactionType === "CONFIRMED",
        ),
      );
    });

    it("should return consent purposes for unsubscribe collection point", () => {
      const collectionPoints = getPurposes("UNSUBSCRIBE", false);

      expect(collectionPoints).toHaveLength(1);
      expect(
        collectionPoints?.every(
          (point) => point.transactionType === "WITHDRAWN",
        ),
      );
    });

    it("should return no consent purposes for unknown collection point", () => {
      const collectionPoints = getPurposes(
        "UNKNOWN" as unknown as "COMPLETE_PURCHASE",
        false,
      );

      expect(collectionPoints).toBeUndefined();
    });
  });
});
