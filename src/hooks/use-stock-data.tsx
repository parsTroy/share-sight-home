
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "./use-auth";

export const useStockData = (ticker: string | null) => {
  const [isRefetching, setIsRefetching] = useState(false);
  const { user } = useAuth();
  
  const fetchStockData = async () => {
    if (!ticker) return null;
    
    try {
      const { data, error } = await supabase.functions.invoke('fetch-stock-data', {
        body: { ticker },
      });
      
      if (error) throw new Error(error.message);
      
      return data;
    } catch (error: any) {
      toast.error(`Failed to fetch stock data: ${error.message}`);
      throw error;
    }
  };
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['stockData', ticker],
    queryFn: fetchStockData,
    enabled: !!ticker,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
  
  const refreshStockData = async (updateDatabase = false) => {
    if (!ticker) return;
    
    setIsRefetching(true);
    try {
      const { data: refreshedData, error } = await supabase.functions.invoke('fetch-stock-data', {
        body: { 
          ticker,
          updateDatabase,
          userId: user?.id
        },
      });
      
      if (error) throw new Error(error.message);
      
      // Force refetch query data
      await refetch();
      toast.success(`Stock data for ${ticker} refreshed`);
      
      return refreshedData;
    } catch (error: any) {
      toast.error(`Failed to refresh stock data: ${error.message}`);
    } finally {
      setIsRefetching(false);
    }
  };
  
  return {
    stockData: data,
    isLoading,
    error,
    isRefetching,
    refreshStockData
  };
};
