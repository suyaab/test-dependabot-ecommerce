import { LocationAttributes } from "@ecommerce/analytics";
import { ServiceLocator } from "@ecommerce/cms";

export default async function WhatToExpect() {
  const cms = ServiceLocator.getCMS();

  const { data } = await cms.getTextContent("LEWhatToExpect");

  return (
    <div
      className="grid-container mt-20"
      data-analytics-location={LocationAttributes.PROCESS}
    >
      <h2 className="col-span-full font-semibold lg:col-span-6 lg:col-start-4 lg:text-center">
        {data}
      </h2>
    </div>
  );
}
