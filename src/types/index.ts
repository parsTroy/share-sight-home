
export interface Stock {
  id: string;
  ticker: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
}

export interface Portfolio {
  stocks: Stock[];
  portfolioValue: number;
  portfolioChange: number;
  portfolioChangePercent: string;
  addStock: (stock: Stock) => void;
  removeStock: (id: string) => void;
  updateStock: (stock: Stock) => void;
}
