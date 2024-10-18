import { InvocationContext } from "@azure/functions";
import sgMail from "@sendgrid/mail";

import { sendEmail } from "./index";

vi.mock("@sendgrid/mail");

vi.mock("../../env", () => ({
  env: {
    SENDGRID_API_KEY: "MOCK SENDGRID_API_KEY",
  },
}));

describe("notif-send-email", () => {
  const mockContext = {
    invocationId: "fake-correlation-id",
  } as unknown as InvocationContext;

  const mockSendgridSdk = vi.mocked(sgMail);

  const sendSpy = vi.fn().mockResolvedValue([
    {
      statusCode: 202,
      body: {},
      headers: {},
    },
    {},
  ]);

  beforeEach(() => {
    mockSendgridSdk.send = sendSpy;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("can successfully send an email", async () => {
    await sendEmail(
      {
        templateId: "fake-template-id",
        subject: "fake subject",
        to: { name: "Recipient Name", email: "recipient@email.com" },
        from: { name: "Sender Name", email: "sender@email.com" },
        dynamicTemplateData: {
          first_name: "fake first name",
        },
      },
      mockContext,
    );

    expect(sendSpy).toHaveBeenCalled();
  });

  it("fails to send an email to invalid email", async () => {
    await expect(async () => {
      await sendEmail(
        {
          templateId: "fake-template-id",
          subject: "fake subject",
          to: { name: "Recipient Name", email: "recipient@email.com" },
          from: { name: "Sender Name", email: "invalid.email.com" },
          dynamicTemplateData: {
            first_name: "fake first name",
          },
        },
        mockContext,
      );
    }).rejects.toThrow(Error);
  });

  it("fails to send an email due to sendgrid failure", async () => {
    mockSendgridSdk.send = vi
      .fn()
      .mockRejectedValue(new Error("Sendgrid Error"));

    await expect(async () => {
      await sendEmail(
        {
          templateId: "fake-template-id",
          subject: "fake subject",
          to: { name: "Recipient Name", email: "recipient@email.com" },
          from: { name: "Sender Name", email: "sender@email.com" },
          dynamicTemplateData: {
            first_name: "fake first name",
          },
        },
        mockContext,
      );
    }).rejects.toThrow(Error);
  });
});
