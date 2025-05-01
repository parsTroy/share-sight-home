
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { usePortfolio } from "@/hooks/use-portfolio";
import { Plus, Info, RefreshCw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { toast } from "sonner";
import { Stock } from "@/types";
import { useQueryClient } from "@tanstack/react-query";

// Mock high-yield dividend stocks
const highYieldStocks = [
  {
    ticker: "ABBV",
    name: "AbbVie Inc.",
    sector: "Healthcare",
    price: 152.75,
    dividendYield: 4.2,
    dividendFrequency: "quarterly",
    annualDividend: 6.42,
    description: "Biopharmaceutical company and maker of Humira"
  },
  {
    ticker: "VZ",
    name: "Verizon Communications",
    sector: "Communication",
    price: 40.50,
    dividendYield: 6.8,
    dividendFrequency: "quarterly",
    annualDividend: 2.75,
    description: "Telecommunications provider"
  },
  {
    ticker: "MO",
    name: "Altria Group",
    sector: "Consumer Staples",
    price: 43.25,
    dividendYield: 8.6,
    dividendFrequency: "quarterly",
    annualDividend: 3.72,
    description: "Tobacco and cigarette manufacturer"
  },
  {
    ticker: "T",
    name: "AT&T Inc.",
    sector: "Communication",
    price: 17.85,
    dividendYield: 5.9,
    dividendFrequency: "quarterly",
    annualDividend: 1.05,
    description: "Telecommunications and media conglomerate"
  },
  {
    ticker: "IBM",
    name: "International Business Machines",
    sector: "Technology",
    price: 145.80,
    dividendYield: 4.6,
    dividendFrequency: "quarterly",
    annualDividend: 6.71,
    description: "Technology and consulting company"
  }
];

export const StockSuggestions = () => {
  const { dividendGoal, portfolioValue, addStock } = usePortfolio();
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
    
    const newStock: Stock = {
      id: Date.now().toString(),
      ticker: stock.ticker,
      quantity: 1, // Default to 1 share
      purchasePrice: stock.price,
      currentPrice: stock.price,
      dividendYield: stock.dividendYield,
      dividendFrequency: stock.dividendFrequency as "monthly" | "quarterly" | "semi-annual" | "annual"
    };
    
    try {
      await addStock(newStock);
      
      // Force refresh ALL portfolio-related queries to ensure consistent data
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
      queryClient.invalidateQueries({ queryKey: ['dividendGoal'] });
      
      toast.success(`Added ${stock.ticker} to your portfolio`);
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
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshSuggestions}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestions.map((stock) => {
            const sharesForGoal = calculateSharesForGoal(stock);
            const isAdding = adding === stock.ticker;
            
            return (
              <div key={stock.ticker} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div>
                  <div className="font-medium">{stock.ticker} - {stock.name}</div>
                  <div className="text-sm text-muted-foreground">{stock.sector}</div>
                  <div className="flex items-center mt-1">
                    <div className="text-sm font-medium text-green-600 mr-3">
                      Yield: {stock.dividendYield}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ${stock.price.toFixed(2)} / share
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center text-xs bg-muted p-1.5 rounded mr-2">
                          <Info className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          ~{sharesForGoal} shares for 1% of goal
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Buying {sharesForGoal} shares would add ~${(sharesForGoal * stock.annualDividend).toFixed(2)} in annual dividends</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button 
                    size="sm" 
                    onClick={() => handleAddToPortfolio(stock)} 
                    disabled={isAdding}
                  >
                    {isAdding ? (
                      <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" />
                    ) : (
                      <Plus className="h-3.5 w-3.5 mr-1" />
                    )}
                    {isAdding ? 'Adding...' : 'Add'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
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
