import { expect, test } from "@playwright/test";

test.describe("home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("has a page title", async ({ page }) => {
    await expect(page).toHaveTitle(/Lingo - Your personal metabolic coach/);

    await expect(
      page.getByRole("heading", { name: "HelloLingo" }),
    ).toBeVisible();
  });

  test("can navigate to products page", async ({ page }) => {
    await page.getByRole("link", { name: "Products" }).click();

    await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();
  });
});
