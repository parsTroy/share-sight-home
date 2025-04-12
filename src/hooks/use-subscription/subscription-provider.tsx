
import { createContext, useContext, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { SubscriptionContextType, SubscriptionProviderProps } from "./types";
import { 
  useSubscriptionState, 
  useCheckoutRecovery, 
  useCheckoutUrlParams 
} from "./subscription-hooks";
import { 
  checkSubscriptionStatus, 
  initiateCheckout, 
  openStripeCustomerPortal 
} from "./subscription-service";

export const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: SubscriptionProviderProps) => {
  const { user } = useAuth();
  
  const {
    isSubscribed,
    setIsSubscribed,
    subscriptionTier,
    setSubscriptionTier,
    subscriptionEnd,
    setSubscriptionEnd,
    stockLimit,
    setStockLimit,
    isLoading,
    setIsLoading,
    daysUntilRenewal,
    isSubscriptionExpiringSoon,
    checkoutRetries,
    setCheckoutRetries
  } = useSubscriptionState(user);

  // Check subscription status with retry logic for better error recovery
  const checkSubscription = useCallback(async () => {
    await checkSubscriptionStatus(
      user, 
      setIsSubscribed, 
      setSubscriptionTier, 
      setSubscriptionEnd, 
      setStockLimit, 
      setIsLoading
    );
  }, [user, setIsSubscribed, setSubscriptionTier, setSubscriptionEnd, setStockLimit, setIsLoading]);

  // Start Stripe checkout with improved error handling and recovery
  const startCheckout = useCallback(async (annual = false) => {
    return initiateCheckout(annual, setCheckoutRetries);
  }, [setCheckoutRetries]);

  // Check if user can add another stock based on their subscription
  const canAddStock = useCallback((currentCount: number): boolean => {
    return currentCount < stockLimit;
  }, [stockLimit]);

  // Set up checkout recovery logic
  useCheckoutRecovery(startCheckout);

  // Check for subscription success/cancelled status in URL
  useCheckoutUrlParams(checkSubscription);

  // Check subscription when user signs in
  useEffect(() => {
    if (user) {
      checkSubscription();
    }
  }, [user, checkSubscription]);

  // Set up periodic subscription check to ensure data is fresh
  useEffect(() => {
    if (!user) return;
    
    // Check subscription every 30 minutes if the user is active
    const intervalId = setInterval(() => {
      checkSubscription();
    }, 30 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [user, checkSubscription]);

  return (
    <SubscriptionContext.Provider value={{
      isSubscribed,
      subscriptionTier,
      subscriptionEnd,
      stockLimit,
      isLoading,
      checkSubscription,
      startCheckout,
      openCustomerPortal: openStripeCustomerPortal,
      canAddStock,
      daysUntilRenewal,
      isSubscriptionExpiringSoon
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
