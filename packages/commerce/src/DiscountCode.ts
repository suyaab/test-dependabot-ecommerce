import { DiscountCode } from "./Cart";

export interface DiscountCodeService {
  getDiscountCodeById(id: string): Promise<DiscountCode | undefined>;
}
