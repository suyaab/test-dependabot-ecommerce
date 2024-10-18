import CommercetoolsSdk, { CommercetoolsSdkClient } from "../CommercetoolsSdk";
import CTProductServiceSdk from "./CTProductService";
import productResponse from "./stubs/productResponse";
import productsResponse from "./stubs/productsResponse";

vi.mock("../CommercetoolsSdk");

describe("CTProductService", () => {
  const commercetoolsProductService = new CTProductServiceSdk();

  const mockCommercetoolsSdk = vi.mocked(CommercetoolsSdk);

  it("can successfully get all products", async () => {
    mockCommercetoolsSdk.getClient.mockReturnValue({
      products: vi.fn().mockReturnThis(),
      get: vi.fn().mockReturnThis(),
      execute: vi.fn().mockResolvedValueOnce(productsResponse),
    } as unknown as CommercetoolsSdkClient);

    const products = await commercetoolsProductService.getProducts();

    expect(products).toHaveLength(2);
    expect(products[0]?.id).toBe("fake-id-1");

    expect(products[1]?.id).toBe("fake-id-2");
  });

  it("can successfully get a single product", async () => {
    mockCommercetoolsSdk.getClient.mockReturnValue({
      products: vi.fn().mockReturnThis(),
      get: vi.fn().mockReturnThis(),
      withId: vi.fn().mockReturnThis(),
      execute: vi.fn().mockResolvedValueOnce(productResponse),
    } as unknown as CommercetoolsSdkClient);

    const product = await commercetoolsProductService.getProduct("fake-id-1");

    expect(product.id).toBe("fake-id-1");
  });

  it("can successfully get a single product by sku", async () => {
    mockCommercetoolsSdk.getClient.mockReturnValue({
      products: vi.fn().mockReturnThis(),
      get: vi.fn().mockReturnThis(),
      execute: vi.fn().mockResolvedValueOnce(productsResponse),
    } as unknown as CommercetoolsSdkClient);

    const product =
      await commercetoolsProductService.getProductBySku("FAKE_SKU");

    expect(product.id).toBe("fake-id-1");
  });

  it("can successfully get all PDP display products", async () => {
    mockCommercetoolsSdk.getClient.mockReturnValue({
      products: vi.fn().mockReturnThis(),
      get: vi.fn().mockReturnThis(),
      execute: vi.fn().mockResolvedValueOnce(productsResponse),
    } as unknown as CommercetoolsSdkClient);

    const products =
      await commercetoolsProductService.getProductsByCategory("pdp");

    expect(products).toHaveLength(2);
    expect(products[0]?.id).toBe("fake-id-1");

    expect(products[1]?.id).toBe("fake-id-2");
  });
});
