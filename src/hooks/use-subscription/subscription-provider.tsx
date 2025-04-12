
import { createContext, useContext, useState, useEffect, useCallback } from "react";
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
  const [daysUntilRenewal, setDaysUntilRenewal] = useState<number | null>(null);
  const [isSubscriptionExpiringSoon, setIsSubscriptionExpiringSoon] = useState(false);
  const [checkoutRetries, setCheckoutRetries] = useState(0);

  // Calculate days until subscription renewal/expiration
  useEffect(() => {
    if (subscriptionEnd) {
      const now = new Date();
      const endDate = new Date(subscriptionEnd);
      const diffTime = endDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      setDaysUntilRenewal(diffDays);
      setIsSubscriptionExpiringSoon(diffDays <= 7 && diffDays > 0);
    } else {
      setDaysUntilRenewal(null);
      setIsSubscriptionExpiringSoon(false);
    }
  }, [subscriptionEnd]);

  // Display renewal reminder for soon-to-expire subscriptions
  useEffect(() => {
    if (isSubscriptionExpiringSoon && daysUntilRenewal !== null) {
      toast.info(
        `Your ${subscriptionTier} subscription will renew in ${daysUntilRenewal} day${daysUntilRenewal !== 1 ? 's' : ''}.`, 
        { 
          id: 'subscription-renewal-reminder',
          duration: 6000
        }
      );
    }
  }, [isSubscriptionExpiringSoon, daysUntilRenewal, subscriptionTier]);

  // Check subscription status with retry logic for better error recovery
  const checkSubscription = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    let retries = 3;
    let success = false;
    
    while (!success && retries > 0) {
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
        
        success = true;
      } catch (error: any) {
        retries--;
        if (retries === 0) {
          console.error("Error checking subscription after retries:", error);
          toast.error(`Failed to check subscription status: ${error.message}`, {
            action: {
              label: 'Try Again',
              onClick: () => checkSubscription()
            }
          });
        } else {
          console.log(`Retrying subscription check... (${retries} attempts left)`);
          // Wait a moment before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } finally {
        setIsLoading(false);
      }
    }
  }, [user]);

  // Start Stripe checkout with improved error handling and recovery
  const startCheckout = async (annual = false) => {
    try {
      setCheckoutRetries(prev => prev + 1);
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        method: 'POST',
        body: { annual }
      });
      
      if (error) throw new Error(error.message);
      
      if (data?.url) {
        // Store checkout state in localStorage for recovery
        localStorage.setItem('checkoutInProgress', 'true');
        localStorage.setItem('checkoutType', annual ? 'annual' : 'monthly');
        localStorage.setItem('checkoutTimestamp', Date.now().toString());
        
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      
      // Only show toast error if we haven't retried too many times
      if (checkoutRetries < 3) {
        toast.error(`Failed to start checkout: ${error.message}`, {
          action: {
            label: 'Try Again',
            onClick: () => startCheckout(annual)
          }
        });
      } else {
        toast.error('Multiple checkout attempts failed. Please try again later or contact support.');
        setCheckoutRetries(0);
      }
    }
  };

  // Open Stripe customer portal with improved error handling
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
      toast.error(`Failed to open customer portal: ${error.message}`, {
        action: {
          label: 'Try Again',
          onClick: () => openCustomerPortal()
        }
      });
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

  // Check for interrupted checkout flows and recover
  useEffect(() => {
    const checkoutInProgress = localStorage.getItem('checkoutInProgress');
    if (checkoutInProgress === 'true') {
      const timestamp = parseInt(localStorage.getItem('checkoutTimestamp') || '0');
      const currentTime = Date.now();
      
      // If the checkout was started less than 30 minutes ago
      if (currentTime - timestamp < 30 * 60 * 1000) {
        toast.info('Resuming previous subscription checkout...', {
          action: {
            label: 'Cancel',
            onClick: () => {
              localStorage.removeItem('checkoutInProgress');
              localStorage.removeItem('checkoutType');
              localStorage.removeItem('checkoutTimestamp');
            }
          }
        });
        
        // Wait a moment to allow the user to cancel if needed
        setTimeout(() => {
          const checkoutStillInProgress = localStorage.getItem('checkoutInProgress');
          if (checkoutStillInProgress === 'true') {
            const isAnnual = localStorage.getItem('checkoutType') === 'annual';
            startCheckout(isAnnual);
          }
        }, 3000);
      } else {
        // Checkout was too long ago, clean up
        localStorage.removeItem('checkoutInProgress');
        localStorage.removeItem('checkoutType');
        localStorage.removeItem('checkoutTimestamp');
      }
    }
  }, []);

  // Check for subscription success/cancelled status in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const subscriptionParam = urlParams.get('subscription');
    
    // Clean up checkout state regardless of outcome
    localStorage.removeItem('checkoutInProgress');
    localStorage.removeItem('checkoutType');
    localStorage.removeItem('checkoutTimestamp');
    
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
  }, [checkSubscription]);

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
      canAddStock,
      daysUntilRenewal,
      isSubscriptionExpiringSoon
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
