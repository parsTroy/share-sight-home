
import { Stock } from "@/types";

// Calculate portfolio value and change
export const calculatePortfolioMetrics = (stocks: Stock[]) => {
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
