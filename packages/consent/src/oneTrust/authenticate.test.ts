import { authenticate } from "./authenticate";

vi.mock("./env", () => ({
  env: {
    ONETRUST_URL: "https://fake.auth.url.com",
    ONETRUST_CLIENT_SECRET: "MOCK ONETRUST_CLIENT_SECRET",
    ONETRUST_CLIENT_ID: "MOCK ONETRUST_CLIENT_ID",
  },
}));

describe("authenticate", () => {
  it("can authenticate with onetrust", async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue({
        role: "Fake API User",
        user_name: "fake-user-name",
        languageId: 1,
        sessionId: "fake-session-id",
        token_type: "Bearer",
        tenantGuid: "fake-tenant-id",
        access_token: "fake-bearer-token",
        tenantId: 93,
        guid: "some-fake-guid",
        expires_in: 31536000,
        email: "fake@url.com",
        jti: "fake-jti",
      }),
      status: 200,
      ok: true,
    });

    global.fetch = mockFetch;

    const bearerToken = await authenticate();

    expect(bearerToken).toBe("fake-bearer-token");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://fake.auth.url.com/api/access/v1/oauth/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: "MOCK ONETRUST_CLIENT_ID",
          client_secret: "MOCK ONETRUST_CLIENT_SECRET",
        }),
      },
    );
  });

  it("should fail to authenticate", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      json: vi.fn(),
      status: 500,
      ok: false,
    });

    await expect(async () => {
      await authenticate();
    }).rejects.toThrow(Error);
  });
});
