import { ServiceBusClient } from "@azure/service-bus";

import { EmailTemplate } from "../../EmailTemplate";
import AzureEmailQueue from "./AzureEmailQueue";

vi.mock("@azure/service-bus");

vi.mock("./env", () => ({
  env: {
    AZ_SERVICE_BUS: "MOCK AZ_SERVICE_BUS",
    AZ_EMAIL_QUEUE: "MOCK AZ_EMAIL_QUEUE",
  },
}));

describe("AzureEmailQueue", () => {
  const mockAzureClient = vi.mocked(ServiceBusClient);

  it("can successfully queue an email message", async () => {
    const sendMessagesSpy = vi.fn().mockResolvedValue(true);

    mockAzureClient.mockImplementation(
      () =>
        ({
          createSender: vi.fn().mockReturnValue({
            sendMessages: sendMessagesSpy,
          }),
        }) as unknown as ServiceBusClient,
    );

    const azureEmailQueue = new AzureEmailQueue();

    await azureEmailQueue.sendEmail(
      EmailTemplate.OrderCancellation,
      { name: "Fake Name", email: "fake@email.com" },
      {
        first_name: "fake first name",
      },
    );

    expect(sendMessagesSpy).toHaveBeenCalled();
  });

  it("fails to send an email", async () => {
    mockAzureClient.mockImplementation(
      () =>
        ({
          createSender: vi.fn().mockReturnValue({
            sendMessages: vi.fn().mockRejectedValue(new Error("Azure Error")),
          }),
        }) as unknown as ServiceBusClient,
    );

    const azureEmailQueue = new AzureEmailQueue();

    await expect(async () => {
      await azureEmailQueue.sendEmail(
        EmailTemplate.OrderCancellation,
        { name: "Fake Name", email: "valid@email.com" },
        {
          first_name: "fake first name",
        },
      );
    }).rejects.toThrow(Error);
  });
});
