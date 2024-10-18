import { CMS } from "./CMS";
import { HybridCMS } from "./integrations/hybrid";

class ServiceLocator {
  private cms: CMS | undefined;

  getCMS(): CMS {
    if (this.cms == undefined) {
      this.cms = new HybridCMS();
    }
    return this.cms;
  }

  setCMS(cms: CMS) {
    this.cms = cms;
  }
}

const serviceLocator = new ServiceLocator();

export default serviceLocator;
