
import { Card, CardContent } from "@/components/ui/card";
import { PieChart as PieChartIcon } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// Mock data for sector allocation
const sectorData = [
  { name: 'Technology', value: 35 },
  { name: 'Healthcare', value: 20 },
  { name: 'Financials', value: 15 },
  { name: 'Consumer Staples', value: 10 },
  { name: 'Energy', value: 8 },
  { name: 'Utilities', value: 7 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28'];

export const DemoSectorAllocation = () => {
  return (
    <div>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <h3 className="font-semibold flex items-center gap-2">
                <PieChartIcon className="h-5 w-5" />
                Sector Allocation
              </h3>
              <p className="text-sm text-muted-foreground">Portfolio diversification</p>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
