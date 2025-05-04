
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StockList } from '@/components/stock-list/StockList';
import { usePortfolio } from '@/hooks/use-portfolio';
import { useSubscription } from '@/hooks/use-subscription';
import { useStockData } from '@/hooks/use-stock-data';

// Mock the hooks and components
vi.mock('@/hooks/use-portfolio', () => ({
  usePortfolio: vi.fn(),
}));

vi.mock('@/hooks/use-subscription', () => ({
  useSubscription: vi.fn(),
}));

vi.mock('@/hooks/use-stock-data', () => ({
  useStockData: vi.fn(),
}));

vi.mock('@/components/stock-list/StockTable', () => ({
  StockTable: () => <div data-testid="stock-table">Stock Table</div>,
}));

vi.mock('@/components/stock-list/AddStockDialog', () => ({
  AddStockDialog: () => <div data-testid="add-stock-dialog">Add Stock Dialog</div>,
}));

vi.mock('@/components/stock-list/EditStockDialog', () => ({
  EditStockDialog: () => <div data-testid="edit-stock-dialog">Edit Stock Dialog</div>,
}));

vi.mock('@/components/SubscriptionBanner', () => ({
  SubscriptionBanner: () => <div data-testid="subscription-banner">Subscription Banner</div>,
}));

describe('StockList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (usePortfolio as any).mockReturnValue({
      stocks: [],
      isLoading: false,
      error: null,
      removeStock: vi.fn(),
      updateStock: vi.fn(),
    });

    (useSubscription as any).mockReturnValue({
      canAddStock: () => true,
      stockLimit: 10,
      subscriptionTier: 'basic',
    });

    (useStockData as any).mockReturnValue({
      refreshStockData: vi.fn(),
      isRefetching: false,
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

  it('renders stock table when stocks are available', () => {
    (usePortfolio as any).mockReturnValue({
      stocks: [{ id: '1', ticker: 'AAPL' }],
      isLoading: false,
      error: null,
      removeStock: vi.fn(),
      updateStock: vi.fn(),
    });

    render(<StockList />);
    expect(screen.getByTestId('stock-table')).toBeInTheDocument();
  });
});
