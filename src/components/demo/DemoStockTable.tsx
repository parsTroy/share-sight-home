
import { Card, CardContent } from "@/components/ui/card";

// Mock data for stocks
const stockData = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 175.42, change: 1.23, yield: 0.65, shares: 10, value: 1754.20 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 335.18, change: -0.87, yield: 0.82, shares: 5, value: 1675.90 },
  { symbol: 'GOOG', name: 'Alphabet Inc.', price: 138.21, change: 0.54, yield: 0.0, shares: 8, value: 1105.68 },
  { symbol: 'JNJ', name: 'Johnson & Johnson', price: 158.76, change: -0.32, yield: 2.95, shares: 7, value: 1111.32 },
  { symbol: 'PG', name: 'Procter & Gamble', price: 142.38, change: 0.21, yield: 2.54, shares: 12, value: 1708.56 },
  { symbol: 'KO', name: 'Coca-Cola Co.', price: 59.87, change: 0.08, yield: 3.08, shares: 20, value: 1197.40 },
];

export const DemoStockTable = () => {
  return (
    <div className="md:col-span-2">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Stock Holdings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left font-medium p-2 pl-0">Symbol</th>
                  <th className="text-left font-medium p-2">Company</th>
                  <th className="text-right font-medium p-2">Price</th>
                  <th className="text-right font-medium p-2">Change</th>
                  <th className="text-right font-medium p-2">Yield</th>
                  <th className="text-right font-medium p-2">Shares</th>
                  <th className="text-right font-medium p-2 pr-0">Value</th>
                </tr>
              </thead>
              <tbody>
                {stockData.map((stock) => (
                  <tr key={stock.symbol} className="border-b">
                    <td className="p-2 pl-0 font-medium">{stock.symbol}</td>
                    <td className="p-2">{stock.name}</td>
                    <td className="p-2 text-right">${stock.price.toFixed(2)}</td>
                    <td className={`p-2 text-right ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                    </td>
                    <td className="p-2 text-right">{stock.yield.toFixed(2)}%</td>
                    <td className="p-2 text-right">{stock.shares}</td>
                    <td className="p-2 pr-0 text-right">${stock.value.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
