import { PageDataKey, ServiceLocator, VeevaDataKey } from "@ecommerce/cms";

export default async function VeevaNumber({
  source,
}: {
  source: VeevaDataKey | PageDataKey;
}) {
  const cms = ServiceLocator.getCMS();
  const { data: veevaNumber } = await cms.getVeevaNumber(source);

  return (
    <div
      className="hidden"
      data-veeva-source={source}
      data-veeva-number={veevaNumber}
      dangerouslySetInnerHTML={{
        __html: `<!-- ${source} Veeva Number: ${veevaNumber} -->`,
      }}
    />
  );
}
