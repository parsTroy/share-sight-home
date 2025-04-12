
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
}

export interface SubscriptionProviderProps {
  children: ReactNode;
}
