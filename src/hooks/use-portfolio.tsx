
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Portfolio, Stock } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "./use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Create context
const PortfolioContext = createContext<Portfolio | undefined>(undefined);

// Calculate portfolio value and change
const calculatePortfolioMetrics = (stocks: Stock[]) => {
  let currentValue = 0;
  let purchaseValue = 0;

  stocks.forEach(stock => {
    currentValue += stock.quantity * stock.currentPrice;
    purchaseValue += stock.quantity * stock.purchasePrice;
  });

  const change = currentValue - purchaseValue;
  const changePercent = purchaseValue > 0 
    ? ((change / purchaseValue) * 100).toFixed(2) 
    : "0.00";

  return {
    portfolioValue: currentValue,
    portfolioChange: change,
    portfolioChangePercent: changePercent
  };
};

// Provider component
export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [dividendGoal, setDividendGoalState] = useState<number>(5000);

  // Fetch stocks from Supabase
  const { data: stocks = [], isLoading: stocksLoading } = useQuery({
    queryKey: ['stocks', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('stocks')
        .select('*')
        .eq('user_id', user.id)
        .order('ticker');
        
      if (error) {
        toast.error(`Failed to load stocks: ${error.message}`);
        return [];
      }
      
      return data.map((stock: any) => ({
        id: stock.id,
        ticker: stock.ticker,
        quantity: Number(stock.quantity),
        purchasePrice: Number(stock.purchase_price),
        currentPrice: Number(stock.current_price),
        dividendYield: stock.dividend_yield ? Number(stock.dividend_yield) : undefined,
        dividendFrequency: stock.dividend_frequency as any,
        exDividendDate: stock.ex_dividend_date
      }));
    },
    enabled: !!user,
  });

  // Fetch dividend goal from Supabase
  const { data: goalData, isLoading: goalLoading } = useQuery({
    queryKey: ['dividendGoal', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('dividend_goals')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        toast.error(`Failed to load dividend goal: ${error.message}`);
        return null;
      }
      
      if (data) {
        return data;
      } else {
        // Create a default goal if none exists
        const { data: newGoal, error: insertError } = await supabase
          .from('dividend_goals')
          .insert([{ user_id: user.id, annual_goal: 5000 }])
          .select()
          .single();
          
        if (insertError) {
          toast.error(`Failed to create dividend goal: ${insertError.message}`);
          return null;
        }
        
        return newGoal;
      }
    },
    enabled: !!user,
  });

  // Set the dividend goal from fetched data
  useEffect(() => {
    if (goalData && !goalLoading) {
      setDividendGoalState(Number(goalData.annual_goal));
    }
  }, [goalData, goalLoading]);

  // Add a new stock mutation
  const addStockMutation = useMutation({
    mutationFn: async (stock: Stock) => {
      if (!user) throw new Error('User not authenticated');
      
      // Try to get real-time stock data first
      try {
        const { data: realTimeData, error: realTimeError } = await supabase.functions.invoke('fetch-stock-data', {
          body: { ticker: stock.ticker },
        });
        
        if (!realTimeError && realTimeData) {
          // Update stock with real-time data if available
          stock.currentPrice = realTimeData.price || stock.currentPrice;
          stock.dividendYield = realTimeData.dividendYield || stock.dividendYield;
          stock.exDividendDate = realTimeData.dividendDate || stock.exDividendDate;
        }
      } catch (e) {
        console.error('Error fetching real-time stock data:', e);
        // Continue with the provided stock data
      }
      
      const { error } = await supabase
        .from('stocks')
        .insert([{
          user_id: user.id,
          ticker: stock.ticker,
          quantity: stock.quantity,
          purchase_price: stock.purchasePrice,
          current_price: stock.currentPrice,
          dividend_yield: stock.dividendYield,
          dividend_frequency: stock.dividendFrequency,
          ex_dividend_date: stock.exDividendDate
        }]);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks', user?.id] });
    },
    onError: (error: any) => {
      toast.error(`Failed to add stock: ${error.message}`);
    }
  });

  // Remove a stock mutation
  const removeStockMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('stocks')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks', user?.id] });
    },
    onError: (error: any) => {
      toast.error(`Failed to remove stock: ${error.message}`);
    }
  });

  // Update a stock mutation
  const updateStockMutation = useMutation({
    mutationFn: async (stock: Stock) => {
      const { error } = await supabase
        .from('stocks')
        .update({
          quantity: stock.quantity,
          purchase_price: stock.purchasePrice,
          current_price: stock.currentPrice,
          dividend_yield: stock.dividendYield,
          dividend_frequency: stock.dividendFrequency,
          ex_dividend_date: stock.exDividendDate
        })
        .eq('id', stock.id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks', user?.id] });
    },
    onError: (error: any) => {
      toast.error(`Failed to update stock: ${error.message}`);
    }
  });

  // Update dividend goal mutation
  const updateDividendGoalMutation = useMutation({
    mutationFn: async (goal: number) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('dividend_goals')
        .update({ annual_goal: goal })
        .eq('user_id', user.id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dividendGoal', user?.id] });
    },
    onError: (error: any) => {
      toast.error(`Failed to update dividend goal: ${error.message}`);
    }
  });

  // Add a new stock
  const addStock = (stock: Stock) => {
    addStockMutation.mutate(stock);
  };

  // Remove a stock
  const removeStock = (id: string) => {
    removeStockMutation.mutate(id);
  };

  // Update an existing stock
  const updateStock = (updatedStock: Stock) => {
    updateStockMutation.mutate(updatedStock);
  };

  // Set dividend goal
  const setDividendGoal = (goal: number) => {
    setDividendGoalState(goal);
    updateDividendGoalMutation.mutate(goal);
  };

  // Calculate portfolio metrics
  const { portfolioValue, portfolioChange, portfolioChangePercent } = calculatePortfolioMetrics(stocks);

  return (
    <PortfolioContext.Provider value={{
      stocks,
      portfolioValue,
      portfolioChange,
      portfolioChangePercent,
      addStock,
      removeStock,
      updateStock,
      dividendGoal,
      setDividendGoal
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

// Hook to use the portfolio context
export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
