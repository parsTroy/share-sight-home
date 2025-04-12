
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";
import { useState } from "react";
import { generatePortfolioData } from "@/lib/chart-utils";

export const PortfolioChart = () => {
  const [timeRange, setTimeRange] = useState("1m");
  const chartData = generatePortfolioData(timeRange);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-medium">Portfolio Performance</CardTitle>
        <Select 
          defaultValue="1m" 
          value={timeRange}
          onValueChange={setTimeRange}
        >
          <SelectTrigger className="w-24 h-8">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1d">1D</SelectItem>
            <SelectItem value="1w">1W</SelectItem>
            <SelectItem value="1m">1M</SelectItem>
            <SelectItem value="3m">3M</SelectItem>
            <SelectItem value="1y">1Y</SelectItem>
            <SelectItem value="all">ALL</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1E90FF" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#1E90FF" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tickMargin={10} 
              tick={{ fontSize: 12, fill: '#888' }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}  
              tickFormatter={(value) => `$${value}`} 
              domain={['auto', 'auto']}
              tick={{ fontSize: 12, fill: '#888' }}
            />
            <Tooltip 
              formatter={(value) => [`$${value}`, "Portfolio Value"]} 
              labelFormatter={(label) => `Date: ${label}`}
              contentStyle={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#1E90FF" 
              fillOpacity={1} 
              fill="url(#colorValue)" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
