import { ServiceLocator } from "@ecommerce/cms";

import EmailsCollectionModal from "~/components/EmailsCollectionModal";
import VeevaNumber from "./VeevaNumber";

export default async function PreLaunchEmailCollectionModalWrapper({
  dialogButtonClassName,
}: {
  dialogButtonClassName?: string;
}) {
  const cms = ServiceLocator.getCMS();

  const modalContent = await cms.getPreLaunchEmailsCollectionModalContent();

  return (
    <EmailsCollectionModal
      modalContent={modalContent}
      dialogButtonClassName={dialogButtonClassName}
    >
      <VeevaNumber source="PreLaunchEmailsCollectionModal" />
    </EmailsCollectionModal>
  );
}
