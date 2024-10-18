import { app, InvocationContext } from "@azure/functions";
import sgMail from "@sendgrid/mail";
import { z } from "zod";

import { getLogger } from "@ecommerce/logger";

import { env } from "../../env";

const emailSchema = z.object({
  templateId: z.string(),
  subject: z.string(),
  to: z.object({
    email: z.string().email(),
    name: z.string(),
  }),
  from: z.object({
    email: z.string().email(),
    name: z.string(),
  }),
  dynamicTemplateData: z.record(z.string(), z.string()).optional(),
});

export async function sendEmail(
  message: unknown,
  context: InvocationContext,
): Promise<void> {
  const logger = getLogger({
    correlationId: context.invocationId,
    prefix: "notif-send-email",
  });

  logger.info({ message }, "Sending Email");

  try {
    const emailParse = emailSchema.safeParse(message);

    if (!emailParse.success) {
      logger.error(
        emailParse.error.errors,
        "Send Email schema validation failed",
      );

      throw new Error("Send Email schema validation failed");
    }

    sgMail.setApiKey(env.SENDGRID_API_KEY);

    const emailData = emailParse.data;

    const [response] = await sgMail.send(emailData);

    if (response?.statusCode != 202) {
      throw new Error("Sendgrid failed to send email");
    }

    return;
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

app.serviceBusQueue("notif-send-email", {
  queueName: "dtc-sendgrid-emails",
  connection: "AZURE_SERVICEBUS_CONN_STR",
  handler: sendEmail,
});
