export type FeatureFlag =
  | "DTC_Braze"
  | "DTC_InternalDashboard"
  | "DTC_US_ApplePay"
  | "DTC_US_EcommerceRelease"
  | "DTC_US_Homepage_EmailCollectionModal"
  | "DTC_US_PromotionalCheckout"
  | "DTC_ZendeskChatbot";

export const FLAG_DEFAULT_VALUES: Record<FeatureFlag, boolean> = {
  DTC_Braze: true,
  DTC_InternalDashboard: false,
  DTC_US_ApplePay: false,
  DTC_US_EcommerceRelease: true,
  DTC_US_Homepage_EmailCollectionModal: true,
  DTC_US_PromotionalCheckout: true,
  DTC_ZendeskChatbot: true,
};
