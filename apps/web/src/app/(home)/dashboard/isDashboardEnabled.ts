import { notFound } from "next/navigation";

import { env } from "~/env";
import { getFeatureFlag } from "~/lib/feature-flags/server";

export default async function isDashboardEnabled() {
  // definitely don't show in prod
  if (env.LINGO_ENV == "prod") {
    notFound();
  }

  // maybe show in lower environments
  const enabled = await getFeatureFlag("DTC_InternalDashboard");
  if (!enabled) {
    notFound();
  }
}
