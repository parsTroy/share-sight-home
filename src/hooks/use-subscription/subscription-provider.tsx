
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { SubscriptionContextType, SubscriptionProviderProps } from "./types";

export const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: SubscriptionProviderProps) => {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<string>("free");
  const [subscriptionEnd, setSubscriptionEnd] = useState<Date | null>(null);
  const [stockLimit, setStockLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  // Check subscription status
  const checkSubscription = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        method: 'POST',
      });
      
      if (error) throw new Error(error.message);
      
      setIsSubscribed(data.subscribed);
      setSubscriptionTier(data.subscription_tier);
      setStockLimit(data.stock_limit);
      
      if (data.subscription_end) {
        setSubscriptionEnd(new Date(data.subscription_end));
      } else {
        setSubscriptionEnd(null);
      }
      
    } catch (error: any) {
      console.error("Error checking subscription:", error);
      toast.error(`Failed to check subscription status: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Start Stripe checkout
  const startCheckout = async (annual = false) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        method: 'POST',
        body: { annual }
      });
      
      if (error) throw new Error(error.message);
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(`Failed to start checkout: ${error.message}`);
    }
  };

  // Open Stripe customer portal
  const openCustomerPortal = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        method: 'POST',
      });
      
      if (error) throw new Error(error.message);
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No portal URL returned');
      }
    } catch (error: any) {
      console.error("Customer portal error:", error);
      toast.error(`Failed to open customer portal: ${error.message}`);
    }
  };

  // Check if user can add another stock based on their subscription
  const canAddStock = (currentCount: number): boolean => {
    return currentCount < stockLimit;
  };

  // Check subscription when user signs in
  useEffect(() => {
    if (user) {
      checkSubscription();
    }
  }, [user]);

  // Check for subscription success/cancelled status in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const subscriptionParam = urlParams.get('subscription');
    
    if (subscriptionParam === 'success') {
      toast.success('Subscription activated successfully!');
      checkSubscription();
      
      // Remove the query parameter
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    } else if (subscriptionParam === 'canceled') {
      toast.info('Subscription checkout was canceled.');
      
      // Remove the query parameter
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  return (
    <SubscriptionContext.Provider value={{
      isSubscribed,
      subscriptionTier,
      subscriptionEnd,
      stockLimit,
      isLoading,
      checkSubscription,
      startCheckout,
      openCustomerPortal,
      canAddStock
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
