
import { useState } from "react";
import { Stock } from "@/types";
import { Plus, Info, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StockSuggestionItemProps {
  stock: {
    ticker: string;
    name: string;
    sector: string;
    price: number;
    dividendYield: number;
    dividendFrequency: string;
    annualDividend: number;
    description: string;
  };
  existingStock: Stock | undefined;
  onAddToPortfolio: (stock: any) => void;
  sharesForGoal: number;
  isAdding: boolean;
}

export const StockSuggestionItem = ({
  stock,
  existingStock,
  onAddToPortfolio,
  sharesForGoal,
  isAdding
}: StockSuggestionItemProps) => {
  return (
    <div className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
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
          {existingStock && (
            <div className="text-xs ml-2 bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded-full">
              You own {existingStock.quantity} {existingStock.quantity === 1 ? 'share' : 'shares'}
            </div>
          )}
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
          onClick={() => onAddToPortfolio(stock)} 
          disabled={isAdding}
        >
          {isAdding ? (
            <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" />
          ) : (
            <Plus className="h-3.5 w-3.5 mr-1" />
          )}
          {isAdding ? 'Adding...' : existingStock ? 'Add Share' : 'Add'}
        </Button>
      </div>
    </div>
  );
};
