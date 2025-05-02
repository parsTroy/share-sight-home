
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dashboard from '@/pages/Dashboard';
import { PortfolioProvider } from '@/hooks/use-portfolio';
import { useSubscription } from '@/hooks/use-subscription';
import { supabase } from '@/integrations/supabase/client';

// Mock the hooks and components
vi.mock('@/hooks/use-subscription', () => ({
  useSubscription: vi.fn(),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}));

vi.mock('@/components/DashboardHeader', () => ({
  DashboardHeader: () => <div data-testid="dashboard-header">Dashboard Header</div>,
}));

vi.mock('@/components/PortfolioSummary', () => ({
  PortfolioSummary: () => <div data-testid="portfolio-summary">Portfolio Summary</div>,
}));

vi.mock('@/components/PortfolioChart', () => ({
  PortfolioChart: () => <div data-testid="portfolio-chart">Portfolio Chart</div>,
}));

vi.mock('@/components/stock-list/StockList', () => ({
  StockList: () => <div data-testid="stock-list">Stock List</div>,
}));

vi.mock('@/components/DividendSummary', () => ({
  DividendSummary: () => <div data-testid="dividend-summary">Dividend Summary</div>,
}));

vi.mock('@/components/DividendGoalTracker', () => ({
  DividendGoalTracker: () => <div data-testid="dividend-goal-tracker">Dividend Goal Tracker</div>,
}));

vi.mock('@/components/MonthlyDividendChart', () => ({
  MonthlyDividendChart: () => <div data-testid="monthly-dividend-chart">Monthly Dividend Chart</div>,
}));

vi.mock('@/components/StockSuggestions', () => ({
  StockSuggestions: () => <div data-testid="stock-suggestions">Stock Suggestions</div>,
}));

vi.mock('@/components/landing/Footer', () => ({
  Footer: () => <div data-testid="footer">Footer</div>,
}));

vi.mock('@/hooks/use-portfolio', () => ({
  PortfolioProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="portfolio-provider">{children}</div>
  ),
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useSubscription as any).mockReturnValue({
      isSubscribed: false,
      subscriptionTier: null,
      openCustomerPortal: vi.fn(),
    });
  });

  it('renders all dashboard components correctly', () => {
    render(<Dashboard />);
    
    // Verify all components are rendered
    expect(screen.getByTestId('dashboard-header')).toBeInTheDocument();
    expect(screen.getByTestId('portfolio-summary')).toBeInTheDocument();
    expect(screen.getByTestId('portfolio-chart')).toBeInTheDocument();
    expect(screen.getByTestId('dividend-summary')).toBeInTheDocument();
    expect(screen.getByTestId('dividend-goal-tracker')).toBeInTheDocument();
    expect(screen.getByTestId('monthly-dividend-chart')).toBeInTheDocument();
    expect(screen.getByTestId('stock-suggestions')).toBeInTheDocument();
    expect(screen.getByTestId('stock-list')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('displays premium subscription button when user is subscribed', () => {
    (useSubscription as any).mockReturnValue({
      isSubscribed: true,
      subscriptionTier: 'premium',
      openCustomerPortal: vi.fn(),
    });

    render(<Dashboard />);
    expect(screen.getByText('Manage Premium Subscription')).toBeInTheDocument();
  });

  it('does not display premium subscription button when user is not subscribed', () => {
    render(<Dashboard />);
    expect(screen.queryByText('Manage Premium Subscription')).not.toBeInTheDocument();
  });

  it('handles updating stock prices correctly', async () => {
    // Mock the supabase function call to return a successful response
    (supabase.functions.invoke as any).mockResolvedValue({
      data: { message: 'Stock prices updated successfully' },
      error: null,
    });

    render(<Dashboard />);
    
    const updateButton = screen.getByText('Update All Prices');
    fireEvent.click(updateButton);
    
    // Check that the supabase function was called
    expect(supabase.functions.invoke).toHaveBeenCalledWith('update-stock-prices', {
      body: {},
    });
    
    // Wait for the operation to complete and check the results
    await waitFor(() => {
      // Since we can't directly test toast notifications in this setup,
      // we'll verify the button is no longer in loading state
      expect(updateButton).not.toBeDisabled();
    });
  });

  it('handles errors when updating stock prices', async () => {
    // Mock the supabase function call to return an error
    (supabase.functions.invoke as any).mockResolvedValue({
      data: null,
      error: { message: 'API limit exceeded' },
    });

    render(<Dashboard />);
    
    const updateButton = screen.getByText('Update All Prices');
    fireEvent.click(updateButton);
    
    // Wait for the operation to complete and check the results
    await waitFor(() => {
      expect(updateButton).not.toBeDisabled();
    });
  });
});
