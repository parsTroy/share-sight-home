
import { Stock } from "@/types";

export interface PortfolioContextValue {
  stocks: Stock[];
  portfolioValue: number;
  portfolioChange: number;
  portfolioChangePercent: string;
  addStock: (stock: Stock) => void;
  removeStock: (id: string) => void;
  updateStock: (stock: Stock) => void;
  dividendGoal: number;
  setDividendGoal: (goal: number) => void;
}
