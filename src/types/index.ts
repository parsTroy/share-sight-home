
export interface Stock {
  id: string;
  ticker: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  dividendYield?: number;
  dividendFrequency?: 'monthly' | 'quarterly' | 'semi-annual' | 'annual';
  exDividendDate?: string;
}

export interface Portfolio {
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
