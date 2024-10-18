import {
  productSchema,
  type Product,
  type ProductCategory,
  type ProductService,
} from "../../../Products";
import CommercetoolsSdk from "../CommercetoolsSdk";
import { translateProduct } from "../translations/product";

export default class CTProductServiceSdk implements ProductService {
  public async getProduct(id: string): Promise<Product> {
    const { body: product } = await CommercetoolsSdk.getClient()
      .products()
      .withId({ ID: id })
      .get({
        queryArgs: {
          expand: "productType.name",
        },
      })
      .execute();

    if (product.masterData.current.masterVariant == null) {
      throw new Error("Unable to retrieve master variant");
    }

    return productSchema.parse(translateProduct(product));
  }

  public async getProductBySku(sku: string): Promise<Product> {
    const products = await this.getProducts();

    // TODO: can we filter using `where` clause on CommerceTools API?
    const product = products.find((product) => product.sku === sku);

    if (product == null) {
      throw new Error(`Unable to retrieve product by sku ${sku}`);
    }

    return product;
  }

  public async getProducts(): Promise<Product[]> {
    const { body: productResponse } = await CommercetoolsSdk.getClient()
      .products()
      .get({
        queryArgs: {
          expand: "productType.name",
        },
      })
      .execute();

    const allCtProducts = productResponse.results;

    return allCtProducts.map((product) =>
      productSchema.parse(translateProduct(product)),
    );
  }

  public async getProductsByCategory(
    category: ProductCategory,
  ): Promise<Product[]> {
    const { body: productResponse } = await CommercetoolsSdk.getClient()
      .products()
      .get({
        queryArgs: {
          expand: ["masterData.current.categories[*]", "productType.name"],
        },
      })
      .execute();

    const allCtProducts = productResponse.results;

    const allDisplayProducts = allCtProducts.filter((product) =>
      product.masterData.current.categories
        .map(({ obj }) => obj?.key)
        .includes(category),
    );

    return allDisplayProducts.map((product) =>
      productSchema.parse(translateProduct(product)),
    );
  }
}
