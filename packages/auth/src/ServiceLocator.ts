import { AuthService } from "./Auth";
import Auth0Provider from "./integrations/Auth0Provider";

class ServiceLocator {
  private authService: AuthService | undefined;

  // AUTH SERVICE
  getAuthService(): AuthService {
    if (this.authService == null) {
      this.authService = new Auth0Provider();
    }
    return this.authService;
  }

  setAuthService(authService: AuthService) {
    this.authService = authService;
  }
}

const serviceLocator = new ServiceLocator();

export default serviceLocator;
