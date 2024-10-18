import { BrazeMarketingService } from "./braze/BrazeMarketingService";
import { MarketingService } from "./MarketingService";

class ServiceLocator {
  private marketingService: MarketingService | undefined;

  getMarketingService(): MarketingService {
    if (this.marketingService == undefined) {
      this.marketingService = new BrazeMarketingService();
    }
    return this.marketingService;
  }

  setMarketingService(marketingService: MarketingService) {
    this.marketingService = marketingService;
  }
}

const serviceLocator = new ServiceLocator();

export default serviceLocator;
