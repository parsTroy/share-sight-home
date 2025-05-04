
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { usePortfolio } from "@/hooks/use-portfolio";
import { Info } from "lucide-react";
import { toast } from "sonner";
import { Stock } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { highYieldStocks } from "./stock-suggestions/mockStocks";
import { RefreshButton } from "./stock-suggestions/RefreshButton";
import { SuggestionsList } from "./stock-suggestions/SuggestionsList";

export const StockSuggestions = () => {
  const { dividendGoal, portfolioValue, addStock, updateStock, stocks } = usePortfolio();
  const [refreshing, setRefreshing] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [suggestions, setSuggestions] = useState(() => {
    // Return 3 random stocks from the high yield list
    return [...highYieldStocks]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
  });

  const refreshSuggestions = () => {
    setRefreshing(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const newSuggestions = [...highYieldStocks]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      setSuggestions(newSuggestions);
      setRefreshing(false);
    }, 800);
  };

  const handleAddToPortfolio = async (stock: typeof highYieldStocks[0]) => {
    setAdding(stock.ticker);
    
    try {
      // Check if the stock already exists in the portfolio
      const existingStock = stocks.find(s => s.ticker.toUpperCase() === stock.ticker.toUpperCase());
      
      if (existingStock) {
        // Update the existing position
        const updatedStock: Stock = {
          ...existingStock,
          quantity: existingStock.quantity + 1, // Add 1 share by default
          // Recalculate the weighted average purchase price
          purchasePrice: ((existingStock.quantity * existingStock.purchasePrice) + stock.price) / (existingStock.quantity + 1)
        };
        
        await updateStock(updatedStock);
        toast.success(`Added 1 share to your ${stock.ticker} position`);
      } else {
        // Create a new position
        const newStock: Stock = {
          id: Date.now().toString(),
          ticker: stock.ticker,
          quantity: 1, // Default to 1 share
          purchasePrice: stock.price,
          currentPrice: stock.price,
          dividendYield: stock.dividendYield,
          dividendFrequency: stock.dividendFrequency as "monthly" | "quarterly" | "semi-annual" | "annual"
        };
        
        await addStock(newStock);
        toast.success(`Added ${stock.ticker} to your portfolio`);
      }
      
      // Force refresh ALL portfolio-related queries to ensure consistent data
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
      queryClient.invalidateQueries({ queryKey: ['dividendGoal'] });
      
    } catch (error) {
      console.error("Error adding stock:", error);
      toast.error(`Failed to add ${stock.ticker} to your portfolio`);
    } finally {
      setAdding(null);
    }
  };
  
  // Calculate how many shares are needed to achieve 1% of the dividend goal
  const calculateSharesForGoal = (stock: typeof highYieldStocks[0]) => {
    const targetAnnualDividend = dividendGoal * 0.01; // 1% of the goal
    return Math.ceil(targetAnnualDividend / stock.annualDividend);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-medium">Dividend Stock Suggestions</CardTitle>
            <CardDescription>
              Stocks that could help you reach your dividend goal
            </CardDescription>
          </div>
          <RefreshButton onRefresh={refreshSuggestions} isRefreshing={refreshing} />
        </div>
      </CardHeader>
      <CardContent>
        <SuggestionsList
          suggestions={suggestions}
          stocks={stocks}
          adding={adding}
          handleAddToPortfolio={handleAddToPortfolio}
          calculateSharesForGoal={calculateSharesForGoal}
        />
      </CardContent>
      <CardFooter className="border-t pt-4 text-sm text-muted-foreground">
        <div className="flex items-center">
          <Info className="h-4 w-4 mr-2" />
          <span>
            These are suggestions only. Always research before investing.
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};
