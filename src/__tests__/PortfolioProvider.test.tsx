
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { PortfolioProvider, usePortfolio } from '@/hooks/use-portfolio';
import { useQuery, useMutation, QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the React Query hooks
vi.mock('@tanstack/react-query', () => {
  const actual = vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: vi.fn(),
    useMutation: vi.fn().mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isError: false,
      isSuccess: true,
      error: null,
    }),
    QueryClient: vi.fn().mockImplementation(() => ({
      clear: vi.fn(),
      invalidateQueries: vi.fn().mockResolvedValue(undefined),
    })),
    QueryClientProvider: ({ children }: any) => children,
  };
});

const TestComponent = () => {
  const portfolio = usePortfolio();
  return (
    <div>
      <div data-testid="stocks-count">{portfolio.stocks?.length || 0}</div>
      <div data-testid="loading">{portfolio.isLoading ? 'true' : 'false'}</div>
      <div data-testid="error">{portfolio.error ? 'true' : 'false'}</div>
    </div>
  );
};

describe('PortfolioProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock the useQuery hook with default values
    (useQuery as any).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    });
  });

  it('provides portfolio context with default values', () => {
    const { getByTestId } = render(
      <PortfolioProvider>
        <TestComponent />
      </PortfolioProvider>
    );
    
    expect(getByTestId('stocks-count').textContent).toBe('0');
    expect(getByTestId('loading').textContent).toBe('false');
    expect(getByTestId('error').textContent).toBe('false');
  });

  it('handles loading state correctly', () => {
    (useQuery as any).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    });
    
    const { getByTestId } = render(
      <PortfolioProvider>
        <TestComponent />
      </PortfolioProvider>
    );
    
    expect(getByTestId('loading').textContent).toBe('true');
  });

  it('handles error state correctly', () => {
    (useQuery as any).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Test error'),
    });
    
    const { getByTestId } = render(
      <PortfolioProvider>
        <TestComponent />
      </PortfolioProvider>
    );
    
    expect(getByTestId('error').textContent).toBe('true');
  });
});
