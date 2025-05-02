
# Dashboard Unit Tests

This directory contains unit tests for the Dashboard feature and its components. The tests are designed to verify that each component renders correctly and behaves as expected.

## Test Files

1. **Dashboard.test.tsx**: Tests for the main Dashboard page component
2. **StockList.test.tsx**: Tests for the stock list component
3. **DividendSummary.test.tsx**: Tests for the dividend summary component
4. **PortfolioProvider.test.tsx**: Tests for the portfolio provider context

## Running Tests

To run these tests:

```bash
# Run all tests
npm test

# Run tests for a specific file
npm test -- src/__tests__/Dashboard.test.tsx

# Run tests in watch mode
npm test -- --watch
```

## Test Coverage

These tests cover:

- Component rendering
- State management
- User interactions
- Error handling
- Loading states

## Mock Implementation

The tests use Vitest mocks to isolate components and simulate different states:

- Mock hooks like usePortfolio and useSubscription
- Mock API calls via the supabase client
- Mock child components to focus on testing the component's logic

## Tips for Extending Tests

When adding new tests:

1. Update the mocks as needed when components change
2. Test all possible states (loading, error, empty, with data)
3. Test user interactions where applicable
4. Ensure async operations are properly tested with waitFor
