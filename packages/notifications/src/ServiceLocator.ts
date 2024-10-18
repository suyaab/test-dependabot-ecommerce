import { EmailService } from "./EmailService";
import { AzureEmailQueue } from "./integrations/azure";

class ServiceLocator {
  private emailService: EmailService | undefined;

  getEmailService(): EmailService {
    if (this.emailService == undefined) {
      this.emailService = new AzureEmailQueue();
    }
    return this.emailService;
  }

  setEmailService(emailService: EmailService) {
    this.emailService = emailService;
  }
}

const serviceLocator = new ServiceLocator();

export default serviceLocator;
