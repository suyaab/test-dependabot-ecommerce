import { RequiredDynamicData } from "./DynamicEmailData";
import { EmailTemplate } from "./EmailTemplate";

export interface EmailService {
  sendEmail<T extends EmailTemplate>(
    template: T,
    recipient: { name: string; email: string },
    dynamicData?: RequiredDynamicData<T>,
  ): Promise<void>;
}
