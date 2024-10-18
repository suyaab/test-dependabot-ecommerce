import { z } from "zod";

export const carrierSchema = z.enum(["DHL", "UPS", "USPS"]);
export type Carrier = z.infer<typeof carrierSchema>;
