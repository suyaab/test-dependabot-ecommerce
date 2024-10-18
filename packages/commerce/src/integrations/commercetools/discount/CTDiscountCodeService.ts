import { DiscountCode, discountCodeSchema } from "../../../Cart";
import { DiscountCodeService } from "../../../DiscountCode";
import CommercetoolsSdk from "../CommercetoolsSdk";
import { translateCTDiscountCode } from "../translations/cart";

export default class CTDiscountCodeService implements DiscountCodeService {
  public async getDiscountCodeById(
    id: string,
  ): Promise<DiscountCode | undefined> {
    const ctResp = await CommercetoolsSdk.getClient()
      .discountCodes()
      .withId({ ID: id })
      .get()
      .execute();

    if (ctResp?.body == null) {
      return;
    }

    const discountCodeData = ctResp.body;

    return discountCodeSchema.parse(translateCTDiscountCode(discountCodeData));
  }
}
