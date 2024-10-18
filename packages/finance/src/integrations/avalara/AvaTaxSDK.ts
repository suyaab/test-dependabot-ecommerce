import https from "node:https";
import Avatax from "avatax";
import { DocumentType } from "avatax/lib/enums.js"; // Avalara complains if the .js is not included here.
import { TransactionModel, TransactionSummary } from "avatax/lib/models";

import { Address } from "@ecommerce/utils";

import { SubTaxRate, TaxInfo, TaxService } from "../../TaxService";
import { COMPANY_CODE, CURRENCY_CODE, SHIP_FROM, TAX_CODE } from "./constants";
import { env } from "./env";

export default class AvataxSDK implements TaxService {
  private getClient() {
    const config = {
      appName: "lingo",
      appVersion: "1.0",
      environment: env.LINGO_ENV === "prod" ? "prod" : "sandbox",
      machineName: `Lingo-Ecommerce-${env.LINGO_ENV}`,
      timeout: 5000,
      logOptions: {
        logEnabled: true,
        logLevel: 3,
        logRequestAndResponseInfo: true,
      },
      customHttpAgent: new https.Agent({ keepAlive: true }),
    };

    return new Avatax(config).withSecurity({
      accountId: env.AVALARA_ACCOUNT_ID,
      licenseKey: env.AVALARA_LICENSE_KEY,
    });
  }

  private translateSubTax(
    summary: TransactionSummary[],
  ): SubTaxRate | undefined {
    return summary
      .filter(
        (taxRate) =>
          taxRate.taxName != null &&
          taxRate.rate != null &&
          taxRate.taxCalculated != null,
      )
      .map((taxRate) => {
        return {
          name: taxRate.taxName!.toLowerCase(),
          amount: taxRate.taxCalculated === 0 ? 0 : taxRate.rate!,
        };
      });
  }

  private processTaxTransaction(response: TransactionModel): TaxInfo {
    const subTaxRate =
      response.summary && response.summary.length > 0
        ? this.translateSubTax(response.summary)
        : undefined;
    const totalTaxCalculated = response.totalTaxCalculated;
    if (
      subTaxRate == null ||
      subTaxRate.length < 1 ||
      totalTaxCalculated == null
    ) {
      throw new Error("Unable to retrieve sub tax rate from AvaTax response.");
    }

    return {
      currency: response.currencyCode ?? "USD",
      subTaxRate: subTaxRate,
      totalTaxCalculated: totalTaxCalculated,
    };
  }

  async createTaxTransaction(
    address: Address,
    totalPrice: number,
    sku: string,
    orderNumber: string,
    customerNumber: string,
  ): Promise<TaxInfo> {
    const client = this.getClient();

    const taxDocument = {
      companyCode: COMPANY_CODE,
      date: new Date(),
      customerCode: customerNumber,
      purchaseOrderNo: orderNumber,
      addresses: {
        shipFrom: SHIP_FROM,
        shipTo: {
          line1: address.addressLine1,
          city: address.city,
          region: address.state,
          country: address.countryCode,
          postalCode: address.postalCode,
        },
      },
      lines: [
        {
          number: "1",
          quantity: 1,
          amount: totalPrice,
          taxCode: TAX_CODE,
          itemCode: sku,
          description: "Sensor",
        },
      ],
      commit: true,
      currencyCode: CURRENCY_CODE,
      description: "Sensor",
      type: DocumentType.SalesInvoice,
    };

    const response = await client.createTransaction({
      model: taxDocument,
    });
    if (response == null) {
      throw new Error(
        "The response from AvaTax is null. Unable to parse the data.",
      );
    }
    return this.processTaxTransaction(response);
  }

  async getTaxAmount(
    address: Address,
    totalPrice: number,
    sku: string,
  ): Promise<TaxInfo> {
    const client = this.getClient();

    const taxDocument = {
      companyCode: COMPANY_CODE,
      date: new Date(),
      customerCode: "lingo-customer", // We do not record transaction this is a required field by Avalara.
      addresses: {
        shipFrom: SHIP_FROM,
        shipTo: {
          line1: address.addressLine1,
          city: address.city,
          region: address.state,
          country: address.countryCode,
          postalCode: address.postalCode,
        },
      },
      lines: [
        {
          number: "1",
          quantity: 1,
          amount: totalPrice,
          taxCode: TAX_CODE,
          itemCode: sku,
          description: "Sensor",
        },
      ],
      commit: false,
      currencyCode: CURRENCY_CODE,
      description: "Sensor",
      type: DocumentType.SalesOrder,
    };

    const response = await client.createTransaction({
      model: taxDocument,
    });
    if (response == null) {
      throw new Error(
        "The response from AvaTax is null. Unable to parse the data.",
      );
    }
    return this.processTaxTransaction(response);
  }
}
