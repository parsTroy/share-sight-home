
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Check subscription status with retry logic for better error recovery
export const checkSubscriptionStatus = async (user: any, setIsSubscribed: (value: boolean) => void, 
  setSubscriptionTier: (value: string) => void, setSubscriptionEnd: (value: Date | null) => void, 
  setStockLimit: (value: number) => void, setIsLoading: (value: boolean) => void) => {
  
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
            onClick: () => checkSubscriptionStatus(
              user, setIsSubscribed, setSubscriptionTier, setSubscriptionEnd, setStockLimit, setIsLoading
            )
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
};

// Start Stripe checkout with improved error handling and recovery
export const initiateCheckout = async (annual = false, setCheckoutRetries: (cb: (prev: number) => number) => void) => {
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
    if (error.checkoutRetries < 3) {
      toast.error(`Failed to start checkout: ${error.message}`, {
        action: {
          label: 'Try Again',
          onClick: () => initiateCheckout(annual, setCheckoutRetries)
        }
      });
    } else {
      toast.error('Multiple checkout attempts failed. Please try again later or contact support.');
      setCheckoutRetries(() => 0);
    }
    throw error;
  }
};

// Open Stripe customer portal with improved error handling
export const openStripeCustomerPortal = async () => {
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
        onClick: () => openStripeCustomerPortal()
      }
    });
    throw error;
  }
};
