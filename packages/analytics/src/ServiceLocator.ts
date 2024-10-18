import { Analytics } from "./Analytics";
import AnalyticsTracking from "./integrations/AnalyticsTracking";

class ServiceLocator {
  private analytics: Analytics | undefined;

  // ANALYTICS SERVICE
  getAnalyticsService(): Analytics {
    if (this.analytics == null) {
      this.analytics = new AnalyticsTracking();
    }
    return this.analytics;
  }

  setAnalyticsService(analytics: Analytics) {
    this.analytics = analytics;
  }
}

const serviceLocator = new ServiceLocator();

export default serviceLocator;
