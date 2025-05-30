
import { Card, CardContent } from "@/components/ui/card";
import { PieChart as PieChartIcon } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { usePortfolio } from "@/hooks/use-portfolio";

// Define sector colors
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28'];

export const SectorAllocation = () => {
  const { stocks } = usePortfolio();
  
  // Create sector data from stocks
  const sectorMap: Record<string, number> = {};
  
  // Calculate sector allocations
  stocks.forEach(stock => {
    // For simplicity, assigning random sectors
    // In a real app, this data would come from your API or be stored with the stock
    const sector = stock.sector || "Unknown";
    const value = stock.quantity * stock.currentPrice;
    
    if (sectorMap[sector]) {
      sectorMap[sector] += value;
    } else {
      sectorMap[sector] = value;
    }
  });
  
  // Convert to array format needed by PieChart
  const sectorData = Object.entries(sectorMap).map(([name, value]) => ({
    name,
    value
  }));
  
  // If no data, show sample data
  const displayData = sectorData.length > 0 ? sectorData : [
    { name: 'Technology', value: 35 },
    { name: 'Healthcare', value: 20 },
    { name: 'Financials', value: 15 },
    { name: 'Consumer Staples', value: 10 },
    { name: 'Energy', value: 8 },
    { name: 'Utilities', value: 7 },
    { name: 'Other', value: 5 },
  ];

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Sector Allocation
            </h3>
            <p className="text-sm text-muted-foreground">Portfolio diversification</p>
          </div>
        </div>
        <div className="h-[255px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={displayData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {displayData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} contentStyle={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '6px', color: '#000' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
