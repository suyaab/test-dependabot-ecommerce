import { ServiceLocator } from "@ecommerce/cms";

import EmailsCollectionModal from "~/components/EmailsCollectionModal";
import VeevaNumber from "./VeevaNumber";

export default async function EmailsCollectionModalWrapper() {
  const cms = ServiceLocator.getCMS();

  const modalContent = await cms.getEmailsCollectionModalContent();

  const delayTimeoutInMs = 60000;

  return (
    <EmailsCollectionModal
      modalContent={modalContent}
      delayTimer={delayTimeoutInMs}
    >
      <VeevaNumber source="PreLaunchEmailsCollectionModal" />
    </EmailsCollectionModal>
  );
}
