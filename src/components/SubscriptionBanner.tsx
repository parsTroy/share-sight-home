
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCw, Star, Crown, AlarmClock, CreditCard, BarChart2 } from "lucide-react";
import { useSubscription } from "@/hooks/use-subscription";
import { usePortfolio } from "@/hooks/use-portfolio";
import { useState } from "react";
import { format } from "date-fns";

export const SubscriptionBanner = () => {
  const { 
    isSubscribed, 
    subscriptionTier, 
    subscriptionEnd, 
    stockLimit, 
    startCheckout, 
    openCustomerPortal,
    daysUntilRenewal,
    isSubscriptionExpiringSoon
  } = useSubscription();
  const { stocks } = usePortfolio();
  const [isLoading, setIsLoading] = useState(false);
  
  const stockCount = stocks.length;
  const percentUsed = Math.min((stockCount / stockLimit) * 100, 100);
  const isNearLimit = stockCount >= stockLimit * 0.8;
  const isAtLimit = stockCount >= stockLimit;

  // For premium users - show subscription status
  if (isSubscribed && subscriptionTier === "premium") {
    return (
      <Card className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-300 dark:border-amber-700 overflow-hidden">
        <CardContent className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex gap-3 items-center">
            <div className="rounded-full bg-amber-200 dark:bg-amber-700 p-2">
              <Crown className="h-5 w-5 text-amber-700 dark:text-amber-200" />
            </div>
            <div>
              <h3 className="font-medium">Premium Subscription Active</h3>
              <div className="text-sm text-muted-foreground flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <BarChart2 className="h-3.5 w-3.5" />
                  <span>You can track up to <strong>{stockLimit}</strong> stocks {stockLimit === 999999 ? '(unlimited)' : ''}</span>
                </div>
                {subscriptionEnd && (
                  <div className="flex items-center gap-1">
                    <AlarmClock className="h-3.5 w-3.5" />
                    <span className={isSubscriptionExpiringSoon ? "text-amber-600 dark:text-amber-400 font-medium" : ""}>
                      {isSubscriptionExpiringSoon 
                        ? `Renews in ${daysUntilRenewal} day${daysUntilRenewal === 1 ? '' : 's'}`
                        : `Renews ${format(new Date(subscriptionEnd), 'MMM d, yyyy')}`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="border-amber-300 dark:border-amber-700"
              onClick={() => openCustomerPortal()}
            >
              <CreditCard className="mr-1.5 h-4 w-4" />
              Manage Subscription
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Show subscription banner for free users
  return (
    <Card className={`overflow-hidden ${isAtLimit ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700' : isNearLimit ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700' : 'bg-gray-50 dark:bg-gray-900/20'}`}>
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              <h3 className="font-medium">Upgrade to Premium</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {isAtLimit ? (
                <span className="text-red-500 dark:text-red-400 font-medium">
                  You've reached the free plan limit of {stockLimit} stocks
                </span>
              ) : (
                <>Using {stockCount} of {stockLimit} stocks ({stockCount === 0 ? 0 : Math.floor(percentUsed)}%)</>
              )}
            </p>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full ${isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-amber-500' : 'bg-primary'}`} 
                style={{ width: `${percentUsed}%` }} 
              />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <Button 
              variant="default" 
              size="sm"
              onClick={() => {
                setIsLoading(true);
                startCheckout(false)
                  .finally(() => setIsLoading(false));
              }}
              disabled={isLoading}
            >
              {isLoading && <RotateCw className="mr-2 h-4 w-4 animate-spin" />}
              $7.99/month
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setIsLoading(true);
                startCheckout(true)
                  .finally(() => setIsLoading(false));
              }}
              disabled={isLoading}
              className="relative"
            >
              <span className="absolute -top-2 right-2 -translate-y-full bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                BEST VALUE
              </span>
              $79/year (2 months free)
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
