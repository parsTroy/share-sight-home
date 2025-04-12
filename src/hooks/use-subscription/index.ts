
import { useContext } from 'react';
import { SubscriptionContext, SubscriptionProvider } from './subscription-provider';
import type { SubscriptionContextType, SubscriptionProviderProps } from './types';

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export { SubscriptionProvider };
export type { SubscriptionContextType, SubscriptionProviderProps };
