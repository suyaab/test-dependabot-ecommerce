import { ServiceLocator } from "@ecommerce/cms";

export default async function ReferenceText() {
  const cms = ServiceLocator.getCMS();

  const { data } = await cms.getTextContent("LEReferenceText");

  return (
    <div
      className="container my-10 text-xs text-charcoal/70"
      dangerouslySetInnerHTML={{ __html: data }}
    />
  );
}
