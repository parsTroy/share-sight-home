
import { Stock } from "@/types";
import { StockSuggestionItem } from "./StockSuggestionItem";

interface SuggestionsListProps {
  suggestions: Array<{
    ticker: string;
    name: string;
    sector: string;
    price: number;
    dividendYield: number;
    dividendFrequency: string;
    annualDividend: number;
    description: string;
  }>;
  stocks: Stock[];
  adding: string | null;
  handleAddToPortfolio: (stock: any) => void;
  calculateSharesForGoal: (stock: any) => number;
}

export const SuggestionsList = ({
  suggestions,
  stocks,
  adding,
  handleAddToPortfolio,
  calculateSharesForGoal
}: SuggestionsListProps) => {
  return (
    <div className="space-y-4">
      {suggestions.map((stock) => {
        const sharesForGoal = calculateSharesForGoal(stock);
        const isAdding = adding === stock.ticker;
        const existingStock = stocks.find(s => s.ticker.toUpperCase() === stock.ticker.toUpperCase());
        
        return (
          <StockSuggestionItem 
            key={stock.ticker}
            stock={stock}
            existingStock={existingStock}
            onAddToPortfolio={handleAddToPortfolio}
            sharesForGoal={sharesForGoal}
            isAdding={isAdding}
          />
        );
      })}
    </div>
  );
};
