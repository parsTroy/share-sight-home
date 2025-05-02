
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DividendSummary } from '@/components/DividendSummary';
import { usePortfolio } from '@/hooks/use-portfolio';

// Mock the hooks
vi.mock('@/hooks/use-portfolio', () => ({
  usePortfolio: vi.fn(),
}));

describe('DividendSummary Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (usePortfolio as any).mockReturnValue({
      dividendStats: {
        annualDividendIncome: 1000,
        monthlyDividendIncome: 83.33,
        dividendYield: 0.04,
        totalInvestment: 25000,
      },
      isLoading: false,
    });
  });

  it('renders dividend statistics correctly', () => {
    render(<DividendSummary />);
    
    // Check for the heading
    expect(screen.getByText(/Dividend Income/i)).toBeInTheDocument();
    
    // Test for the dividend values
    expect(screen.getByText(/\$1,000/)).toBeInTheDocument(); // Annual income
    expect(screen.getByText(/\$83.33/)).toBeInTheDocument(); // Monthly income
    expect(screen.getByText(/4.00%/)).toBeInTheDocument(); // Yield percentage
  });

  it('renders loading state correctly', () => {
    (usePortfolio as any).mockReturnValue({
      dividendStats: null,
      isLoading: true,
    });

    render(<DividendSummary />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });
});
