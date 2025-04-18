
import { ReactNode } from "react";

export interface SubscriptionContextType {
  isSubscribed: boolean;
  subscriptionTier: string;
  subscriptionEnd: Date | null;
  stockLimit: number;
  isLoading: boolean;
  checkSubscription: () => Promise<void>;
  startCheckout: (annual?: boolean) => Promise<void>;
  openCustomerPortal: () => Promise<void>;
  canAddStock: (currentCount: number) => boolean;
  daysUntilRenewal: number | null;
  isSubscriptionExpiringSoon: boolean;
}

export interface SubscriptionProviderProps {
  children: ReactNode;
}

export interface SubscriptionPlan {
  tier: string;
  name: string;
  description: string;
  stockLimit: number;
  price: number;
  annualPrice?: number;
  features: string[];
}
