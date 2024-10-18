import { expect, test } from "@playwright/test";

test.describe("checkout page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/checkout");
  });

  test.describe("empty cart", () => {
    test("shows empty cart title", async ({ page }) => {
      await expect(page.getByText("Empty Cart")).toBeVisible();
    });
  });

  test.describe("checkout", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/products");

      // TODO: Fix when we can select a specific product via name/something else
      await page
        .getByRole("listitem")
        .filter({ hasText: "f59809f3-456d-477f-af14-904416d8a14c" })
        .getByRole("button", { name: "Add to cart" })
        .click();

      await page.waitForURL("/checkout", { timeout: 10000 });
    });

    test("has a page title", async ({ page }) => {
      await expect(page).toHaveTitle(/Buy Your Plan - Checkout/);

      await expect(page.getByText(/Checkout Page/)).toBeVisible();
    });

    // TODO: Write test for going through the entire checkout page and getting to order confirmation
    test("can enter user information and successfully checkout", async ({
      page,
    }) => {
      await expect(page.getByText("Your Information")).toBeVisible();

      // Type in Contact Info
      await page.getByLabel("First name").fill("Sam");
      await page.getByLabel("Last name").fill("Smith");

      await page
        .getByLabel("Email", { exact: true })
        .fill("fake.email@abbott.com");

      await page.getByLabel("Phone").fill("1112223333");

      await page.getByLabel(/Privacy Notice/).check();

      await expect(page.getByLabel(/Privacy Notice/)).toBeChecked();
      await expect(page.getByText("Shipping and payment")).toBeVisible();

      await page.getByRole("button", { name: "Next" }).click();

      // TODO: add back once Google Maps has been added
      // await expect(page.getByText("Enter Address Manually")).toBeVisible();
      // await page.getByText("Enter Address Manually").click();
      // await page.getByPlaceholder("Enter a location").fill("11 Pond St");

      // Type in Address
      // await page.getByPlaceholder("Enter a location").fill("9509 Alameda Lane");
      const shippingBlock = page.getByTestId("shipping");

      await expect(shippingBlock).toHaveCount(1);

      await shippingBlock
        .getByLabel("Street Address")
        .fill("9509 Alameda Lane");
      await shippingBlock.getByLabel("City").fill("Alameda");
      await shippingBlock.getByLabel("State").fill("MN");
      await shippingBlock.getByLabel("Postcode").fill("55347");

      // Type in Credit Card Details
      await page.getByLabel("Name on card").fill("Sam Smith");
      await page
        .frameLocator('iframe[name="card\\.number"]')
        .getByLabel("Card number")
        .fill("4111111111111111");
      await page
        .frameLocator('iframe[name="card\\.cvv"]')
        .getByLabel("CVC")
        .fill("111");
      await page.getByLabel("Expiration (MM/YY)").fill("11/28");

      // Click Purchase
      await page.getByRole("button", { name: "Order and Pay" }).click();

      // Expect Order Confirmation Page
      await page.waitForURL(/\/order-confirmation\/*\//, { timeout: 10000 });
      // await expect(page.getByText(/Welcome, [A-Za-z]+$/i)).toBeVisible();
    });
  });
});
