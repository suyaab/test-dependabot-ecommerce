import { expect, test } from "@playwright/test";

test.describe("products page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/products");
  });

  test("has a page title", async ({ page }) => {
    await expect(page).toHaveTitle(
      /Buy Lingo – Metabolism Discovery Pack or 2 Month Program/,
    );

    await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();
  });

  test("can add product to cart and go to checkout", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();

    // TODO: Fix when we can select a specific product via name/something else
    await page
      .getByRole("listitem")
      .filter({ hasText: "f59809f3-456d-477f-af14-904416d8a14c" })
      .getByRole("button", { name: "Add to cart" })
      .click();

    await page.waitForURL("/checkout", { timeout: 10000 });
  });
});
