import { describe, expect, it } from "vitest";

import { checkUniformStatus, MarketingPurpose } from "./helper";

describe("checkUniformStatus", () => {
  it("returns true when all marketing purposes are subscribed", () => {
    const marketingPurposes = [
      { id: "1", status: "ACTIVE" },
      { id: "2", status: "ACTIVE" },
    ];
    expect(checkUniformStatus(marketingPurposes)).toBe(true);
  });

  it("returns true when all marketing purposes are subscribed", () => {
    const marketingPurposes = [
      { id: "1", status: "CONFIRMED" },
      { id: "2", status: "ACTIVE" },
    ];
    expect(checkUniformStatus(marketingPurposes)).toBe(true);
  });

  it("returns true when all marketing purposes are subscribed", () => {
    const marketingPurposes = [
      { id: "1", status: "CONFIRMED" },
      { id: "2", status: "NOT_OPTED_OUT" },
    ];
    expect(checkUniformStatus(marketingPurposes)).toBe(true);
  });

  it("returns true when all marketing purposes are unsubscribed", () => {
    const marketingPurposes = [
      { id: "1", status: "WITHDRAWN" },
      { id: "2", status: "WITHDRAWN" },
    ];
    expect(checkUniformStatus(marketingPurposes)).toBe(true);
  });

  it("returns true when all marketing purposes are unsubscribed", () => {
    const marketingPurposes = [
      { id: "1", status: "OPT_OUT" },
      { id: "2", status: "OPT_OUT" },
    ];
    expect(checkUniformStatus(marketingPurposes)).toBe(true);
  });

  it("returns true when all marketing purposes are unsubscribed", () => {
    const marketingPurposes = [
      { id: "1", status: "WITHDRAWN" },
      { id: "2", status: "OPT_OUT" },
    ];
    expect(checkUniformStatus(marketingPurposes)).toBe(true);
  });

  it("returns true when all marketing purposes are unsubscribed", () => {
    const marketingPurposes = [
      { id: "1", status: "HARD_OPT_OUT" },
      { id: "2", status: "HARD_OPT_OUT" },
    ];
    expect(checkUniformStatus(marketingPurposes)).toBe(true);
  });

  it("returns false when marketing purposes have mixed statuses", () => {
    const marketingPurposes = [
      { id: "1", status: "ACTIVE" },
      { id: "2", status: "WITHDRAWN" },
    ];
    expect(checkUniformStatus(marketingPurposes)).toBe(false);
  });

  it("returns true when marketing purposes array is empty", () => {
    const marketingPurposes: MarketingPurpose[] = [];
    expect(checkUniformStatus(marketingPurposes)).toBe(true);
  });
});
