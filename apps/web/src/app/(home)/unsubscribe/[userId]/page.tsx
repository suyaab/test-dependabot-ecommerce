import { Metadata } from "next";

import { ServiceLocator as CmsServiceLocator } from "@ecommerce/cms";
import logger from "@ecommerce/logger";

import AnalyticsPageTracker from "~/components/analytics/AnalyticPageTracker";
import VeevaNumber from "~/components/VeevaNumber";
import unsubscribe from "~/app/actions/unsubscribe";
import EmailUnsubscribeIcon from "./components/EmailUnsubscribeIcon";

export async function generateMetadata(): Promise<Metadata> {
  const cms = CmsServiceLocator.getCMS();
  const metadata = await cms.getMetadata("Unsubscribe");
  return metadata;
}

export default async function Unsubscribe({
  params: { userId },
}: {
  params: { userId: string };
}) {
  try {
    await unsubscribe(userId);

    return (
      <div className="container my-20">
        <AnalyticsPageTracker page="unsubscribe" />
        <VeevaNumber source="Unsubscribe" />
        <div className="flex h-96 w-full flex-col items-center justify-center">
          <EmailUnsubscribeIcon />
          <h3 className="mb-8">Email Unsubscribe Confirmation</h3>

          <div className="mb-2">
            You have been successfully unsubscribed from further marketing
            emails from Lingo.
          </div>
          <div className="mb-2">
            You will continue receiving order and product related updates from
            us.
          </div>
        </div>
      </div>
    );
  } catch (error) {
    logger.error(error, "Error occurred during the unsubscribe process.");

    return (
      <>
        <div className="container my-20">
          <VeevaNumber source="Unsubscribe" />
          <div className="flex h-96 w-full flex-col items-center justify-center">
            <EmailUnsubscribeIcon />
            <h3 className="mb-8">
              Error occurred during the unsubscribe process.
            </h3>
            <br /> Please try again.
          </div>
        </div>
      </>
    );
  }
}
