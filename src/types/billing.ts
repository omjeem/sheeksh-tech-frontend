import { ChannelType } from "./notification";

export interface Plan {
  id: string;
  key: string;
  name: string;
  description: string;
  planType: "PUBLIC" | "CUSTOM";
  basePrice: number;
  currency: "INR" | string;
  metadata: null | string;
  isActive: boolean;
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: string;
  feature: Array<{
    id: string;
    units: number;
    channel: ChannelType;
    metadata: null | string;
  }>;
}

export interface LedgerLog {
  id: string;
  operation: "USAGE" | "SUBSCRIPTION_PURCHASED";
  creditsUsed: number;
  createdAt: string;
  channel: { channel: ChannelType } | null;
  planInstance: { name: string; key: string };
}

export interface PurchasedPlan {
  id: string;
  key: string;
  name: string;
  description: string;
  metadata: null | string;
  isExhausted: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  transaction: {
    id: string;
    purchasedBy: {
      id: string;
      role: "SUPER_ADMIN" | string;
      firstName: string;
      lastName: string;
    };
    totalPrice: number;
    currency: "INR" | string;
    paymentProvider: "CASH" | string;
    providerTxId: null | string;
    status: "SUCCEEDED" | string;
    requestedActivateAt: string;
    createdAt: string;
    metadata: null | string;
  }[];
  purchasedChannels: {
    id: string;
    channel: ChannelType;
    unitsTotal: number;
    unitsConsumed: number;
    isExhausted: boolean;
    limits: null;
    metadata: null | string;
    createdAt: string;
    updatedAt: string;
  }[];
}
