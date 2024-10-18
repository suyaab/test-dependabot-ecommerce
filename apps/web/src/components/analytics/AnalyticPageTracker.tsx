"use client";

import { useEffect } from "react";

import {
  ServiceLocator,
  type DynamicData,
  type Page,
} from "@ecommerce/analytics";

// TODO: move to components folder (since this is a component, it must live somewhere else, not on a root level)
export default function AnalyticsPageTracker({
  page,
  dynamicData,
}: {
  page: Page;
  dynamicData?: DynamicData;
}): null {
  const analyticsService = ServiceLocator.getAnalyticsService();

  useEffect(() => {
    analyticsService.trackPage(page, dynamicData);
  }, [page, dynamicData, analyticsService]);

  return null;
}
