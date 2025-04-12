
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useSubscriptionState = (user: any) => {
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

  return {
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
  };
};

// Separate hook for checkout recovery logic
export const useCheckoutRecovery = (startCheckout: (annual?: boolean) => Promise<void>) => {
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
  }, [startCheckout]);
};

// Hook for handling URL parameters after checkout
export const useCheckoutUrlParams = (checkSubscription: () => Promise<void>) => {
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
};
