
import { useContext } from "react";
import { PortfolioContext } from "./context";

// Hook to use the portfolio context
export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

export { PortfolioProvider } from "./context";
