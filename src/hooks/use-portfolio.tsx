
import { createContext, useContext, useState, ReactNode } from "react";
import { Portfolio, Stock } from "@/types";

// Sample initial stocks
const initialStocks: Stock[] = [
  {
    id: "1",
    ticker: "AAPL",
    quantity: 10,
    purchasePrice: 150.25,
    currentPrice: 165.30
  },
  {
    id: "2",
    ticker: "MSFT",
    quantity: 5,
    purchasePrice: 280.50,
    currentPrice: 300.10
  },
  {
    id: "3",
    ticker: "GOOGL",
    quantity: 2,
    purchasePrice: 2850.75,
    currentPrice: 2700.25
  }
];

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
  const [stocks, setStocks] = useState<Stock[]>(initialStocks);
  const { portfolioValue, portfolioChange, portfolioChangePercent } = calculatePortfolioMetrics(stocks);

  // Add a new stock
  const addStock = (stock: Stock) => {
    setStocks(prev => [...prev, stock]);
  };

  // Remove a stock
  const removeStock = (id: string) => {
    setStocks(prev => prev.filter(stock => stock.id !== id));
  };

  // Update an existing stock
  const updateStock = (updatedStock: Stock) => {
    setStocks(prev => 
      prev.map(stock => 
        stock.id === updatedStock.id ? updatedStock : stock
      )
    );
  };

  return (
    <PortfolioContext.Provider value={{
      stocks,
      portfolioValue,
      portfolioChange,
      portfolioChangePercent,
      addStock,
      removeStock,
      updateStock
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
