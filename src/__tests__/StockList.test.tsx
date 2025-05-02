
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StockList } from '@/components/stock-list/StockList';
import { usePortfolio } from '@/hooks/use-portfolio';

// Mock the hooks and components
vi.mock('@/hooks/use-portfolio', () => ({
  usePortfolio: vi.fn(),
}));

vi.mock('@/components/stock-list/StockTable', () => ({
  StockTable: () => <div data-testid="stock-table">Stock Table</div>,
}));

vi.mock('@/components/stock-list/AddStockDialog', () => ({
  AddStockDialog: () => <div data-testid="add-stock-dialog">Add Stock Dialog</div>,
}));

describe('StockList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (usePortfolio as any).mockReturnValue({
      stocks: [],
      isLoading: false,
      error: null,
    });
  });

  it('renders loading state correctly', () => {
    (usePortfolio as any).mockReturnValue({
      stocks: [],
      isLoading: true,
      error: null,
    });

    render(<StockList />);
    expect(screen.getByText(/Loading your portfolio/i)).toBeInTheDocument();
  });

  it('renders error state correctly', () => {
    (usePortfolio as any).mockReturnValue({
      stocks: [],
      isLoading: false,
      error: new Error('Failed to load stocks'),
    });

    render(<StockList />);
    expect(screen.getByText(/Error loading your portfolio/i)).toBeInTheDocument();
  });

  it('renders empty state correctly', () => {
    render(<StockList />);
    expect(screen.getByText(/No stocks in your portfolio yet/i)).toBeInTheDocument();
  });

  it('renders stock table when stocks are available', () => {
    (usePortfolio as any).mockReturnValue({
      stocks: [{ id: '1', symbol: 'AAPL' }],
      isLoading: false,
      error: null,
    });

    render(<StockList />);
    expect(screen.getByTestId('stock-table')).toBeInTheDocument();
  });
});
