import { ServiceBusClient } from "@azure/service-bus";
import { z } from "zod";

import { RequiredDynamicData } from "../../DynamicEmailData";
import { EmailService } from "../../EmailService";
import { EmailTemplate, EmailTemplateData } from "../../EmailTemplate";
import { env } from "./env";

export default class AzureEmailQueue implements EmailService {
  public async sendEmail<T extends EmailTemplate>(
    template: T,
    recipient: { name: string; email: string },
    dynamicData?: RequiredDynamicData<T>,
  ): Promise<void> {
    try {
      const emailValidation = z.string().email().safeParse(recipient.email);

      if (!emailValidation.success) {
        throw new Error("Sending email to invalid email address");
      }

      const emailData = EmailTemplateData[template];

      const sendgridData = {
        templateId: emailData.id,
        subject: emailData.subject,
        to: {
          email: emailValidation.data,
          name: recipient.name,
        },
        from: {
          email: "orders@hellolingo.com",
          name: "Lingo",
        },
        dynamicTemplateData: dynamicData,
      };

      const serviceBusClient = new ServiceBusClient(
        env.AZURE_SERVICEBUS_CONN_STR,
      );
      const sender = serviceBusClient.createSender("dtc-sendgrid-emails");

      return sender.sendMessages({ body: sendgridData });
    } catch (error) {
      throw new Error("Error occurred during sending the email", {
        cause: error,
      });
    }
  }
}
