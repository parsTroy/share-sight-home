
import { createContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Stock } from "@/types";
import { fetchStocks, fetchDividendGoal } from "./queries";
import { addStock as addStockMutation, removeStock as removeStockMutation, 
         updateStock as updateStockMutation, updateDividendGoal as updateDividendGoalMutation } from "./mutations";
import { calculatePortfolioMetrics } from "./utils";
import { PortfolioContextValue } from "./types";

// Create context
export const PortfolioContext = createContext<PortfolioContextValue | undefined>(undefined);

// Provider component
export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [dividendGoalState, setDividendGoalState] = useState<number>(5000);

  // Fetch stocks from Supabase
  const { data: stocks = [], isLoading, error } = useQuery({
    queryKey: ['stocks', user?.id],
    queryFn: () => fetchStocks(user?.id),
    enabled: !!user,
  });

  // Fetch dividend goal from Supabase
  const { data: goalData } = useQuery({
    queryKey: ['dividendGoal', user?.id],
    queryFn: () => fetchDividendGoal(user?.id),
    enabled: !!user,
  });

  // Set the dividend goal from fetched data
  useEffect(() => {
    if (goalData) {
      setDividendGoalState(Number(goalData.annual_goal));
    }
  }, [goalData]);

  // Add a new stock mutation
  const addStockMutationHook = useMutation({
    mutationFn: (stock: Stock) => addStockMutation(stock, user?.id || ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks', user?.id] });
    },
    onError: (error: any) => {
      toast.error(`Failed to add stock: ${error.message}`);
    }
  });

  // Remove a stock mutation
  const removeStockMutationHook = useMutation({
    mutationFn: removeStockMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks', user?.id] });
    },
    onError: (error: any) => {
      toast.error(`Failed to remove stock: ${error.message}`);
    }
  });

  // Update a stock mutation
  const updateStockMutationHook = useMutation({
    mutationFn: updateStockMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks', user?.id] });
    },
    onError: (error: any) => {
      toast.error(`Failed to update stock: ${error.message}`);
    }
  });

  // Update dividend goal mutation
  const updateDividendGoalMutationHook = useMutation({
    mutationFn: (goal: number) => updateDividendGoalMutation(goal, user?.id || ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dividendGoal', user?.id] });
    },
    onError: (error: any) => {
      toast.error(`Failed to update dividend goal: ${error.message}`);
    }
  });

  // Add a new stock
  const addStock = (stock: Stock) => {
    addStockMutationHook.mutate(stock);
  };

  // Remove a stock
  const removeStock = (id: string) => {
    removeStockMutationHook.mutate(id);
  };

  // Update an existing stock
  const updateStock = (updatedStock: Stock) => {
    updateStockMutationHook.mutate(updatedStock);
  };

  // Set dividend goal
  const setDividendGoal = (goal: number) => {
    setDividendGoalState(goal);
    updateDividendGoalMutationHook.mutate(goal);
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
      dividendGoal: dividendGoalState,
      setDividendGoal,
      isLoading,
      error
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};
