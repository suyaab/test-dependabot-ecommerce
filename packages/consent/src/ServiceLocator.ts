import { ConsentManager } from "./ConsentManager";
import OTConsentManager from "./oneTrust/OTConsentManager";

class ServiceLocator {
  private consentManager: ConsentManager | undefined;

  // CONSENT MANAGER
  getConsentManager(): ConsentManager {
    if (this.consentManager == undefined) {
      this.consentManager = new OTConsentManager();
    }
    return this.consentManager;
  }

  setConsentManager(consentManager: ConsentManager) {
    this.consentManager = consentManager;
  }
}

const serviceLocator = new ServiceLocator();

export default serviceLocator;
