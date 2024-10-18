import { expect, test } from "@playwright/test";

test.describe("Redirects static paths to UK", () => {
  const ukRedirectStaticPaths = [
    "/about-us",
    "/benefits",
    "/biosensor",
    "/blog",
    "/continuous-glucose-monitoring",
    "/doc",
    "/eula",
    "/fb-privacy-policy",
    "/fb-uk-terms-of-use",
    "/harpers-bazaar",
    "/metabolism",
    "/nutrition",
    "/performance",
    "/run",
    "/science",
    "/weight-loss",
    "/womens-health",
  ];

  ukRedirectStaticPaths.forEach((source) => {
    test(`redirects ${source} to /uk${source}`, async ({ page }) => {
      // capture the initial redirect response, no await needed here
      const responsePromise = page.waitForResponse((response) =>
        response.url().endsWith(source),
      );
      await page.goto(source, { waitUntil: "commit" });
      const response = await responsePromise;

      expect(response.status()).toBe(307);
      expect(response.headers().location).toBe(`/uk${source}`);
    });
  });
});

test.describe("Redirects dynamic paths to UK", () => {
  const ukRedirectDynamicPaths = [
    "/blog/lingo-day-of-eating",
    "/guide/metabolism-101",
    "/profile/pamela-nisevich-bede",
    "/topic/lingo",
  ];
  ukRedirectDynamicPaths.forEach((source) => {
    test(`redirects ${source} to /uk${source}`, async ({ page }) => {
      // capture the initial redirect response, no await needed here
      const responsePromise = page.waitForResponse((response) =>
        response.url().endsWith(source),
      );
      await page.goto(source, { waitUntil: "commit" });
      const response = await responsePromise;

      expect(response.status()).toBe(307);
      expect(response.headers().location).toBe(`/uk${source}`);
    });
  });
});

test.describe("Redirects and keeps query params", () => {
  const source =
    "/blog/lingo-day-of-eating?utm_source=facebook&utm_medium=social&utm_campaign=lingo";
  test(`redirects ${source} to /uk${source}`, async ({ page }) => {
    // capture the initial redirect response, no await needed here
    const responsePromise = page.waitForResponse((response) =>
      response.url().endsWith(source),
    );
    await page.goto(source, { waitUntil: "commit" });
    const response = await responsePromise;

    expect(response.status()).toBe(307);
    expect(response.headers().location).toBe(`/uk${source}`);
  });
});

test.describe("Redirects US to canonical permanently", () => {
  test("redirects /us to /", async ({ page }) => {
    // capture the initial redirect response, no await needed here
    const responsePromise = page.waitForResponse((response) =>
      response.url().endsWith("/us"),
    );
    await page.goto("/us", { waitUntil: "commit" });
    const response = await responsePromise;

    expect(response.status()).toBe(308);
    expect(response.headers().location).toBe("/");
  });
});

test.describe("Redirects Geolocated UK users to /uk for some paths", () => {
  const ukRedirectPaths = [
    "/privacy-notice",
    "/terms-of-sale",
    "/terms-of-use",
  ];

  ukRedirectPaths.forEach((source) => {
    test(`redirects ${source} to /uk${source}`, async ({ page }) => {
      // Set the 'X-Geo-Country' header to 'GB' for each source
      // and make sure we redirect the user to the UK version
      await page.route("**/*", (route) => {
        const headers = Object.assign({}, route.request().headers(), {
          "X-Geo-Country": "GB",
        });
        void route.continue({ headers });
      });

      // capture the initial redirect response, no await needed here
      const responsePromise = page.waitForResponse((response) =>
        response.url().endsWith(source),
      );
      await page.goto(source, { waitUntil: "commit" });
      const response = await responsePromise;

      expect(response.status()).toBe(307);
      expect(response.headers().location).toBe(`/uk${source}`);
    });
  });
});

test.describe("Does not redirect US users to /uk for shared paths", () => {
  const usUkSharedPaths = [
    "/privacy-notice",
    "/terms-of-sale",
    "/terms-of-use",
  ];

  usUkSharedPaths.forEach((source) => {
    test(`keeps ${source} at ${source}`, async ({ page }) => {
      // Set the 'X-Geo-Country' header to 'US' for each source
      // and make sure we don't redirect the user
      await page.route("**/*", (route) => {
        const headers = Object.assign({}, route.request().headers(), {
          "X-Geo-Country": "US",
        });
        void route.continue({ headers });
      });

      // capture the initial redirect response, no await needed here
      const responsePromise = page.waitForResponse((response) =>
        response.url().endsWith(source),
      );
      await page.goto(source, { waitUntil: "commit" });
      const response = await responsePromise;

      expect(response.status()).toBe(200);
      expect(response.headers().location).toBe(undefined);
    });
  });
});
