
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

// Mock data for charts
const portfolioData = [
  { name: 'Jan', value: 5000 },
  { name: 'Feb', value: 5200 },
  { name: 'Mar', value: 5100 },
  { name: 'Apr', value: 5400 },
  { name: 'May', value: 5600 },
  { name: 'Jun', value: 5800 },
  { name: 'Jul', value: 6100 },
  { name: 'Aug', value: 6400 },
  { name: 'Sep', value: 6300 },
  { name: 'Oct', value: 6700 },
  { name: 'Nov', value: 6900 },
  { name: 'Dec', value: 7200 },
];

const dividendData = [
  { name: 'Jan', value: 120 },
  { name: 'Feb', value: 0 },
  { name: 'Mar', value: 150 },
  { name: 'Apr', value: 0 },
  { name: 'May', value: 180 },
  { name: 'Jun', value: 0 },
  { name: 'Jul', value: 200 },
  { name: 'Aug', value: 0 },
  { name: 'Sep', value: 220 },
  { name: 'Oct', value: 0 },
  { name: 'Nov', value: 250 },
  { name: 'Dec', value: 0 },
];

export const DemoCharts = () => {
  const portfolioChartConfig = {
    portfolio: {
      label: "Portfolio Value",
      theme: {
        light: "#8884d8",
        dark: "#9b87f5"
      }
    }
  };
  
  const dividendChartConfig = {
    dividend: {
      label: "Dividend Income",
      theme: {
        light: "#82ca9d",
        dark: "#6EBD90"
      }
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 mb-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <h3 className="font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Portfolio Growth
              </h3>
              <p className="text-sm text-muted-foreground">12-month portfolio value</p>
            </div>
          </div>
          <div className="h-[300px]">
            <ChartContainer config={portfolioChartConfig}>
              <AreaChart data={portfolioData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-portfolio, #8884d8)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-portfolio, #8884d8)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="var(--color-portfolio, #8884d8)" 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  name="portfolio"
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <h3 className="font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Monthly Dividends
              </h3>
              <p className="text-sm text-muted-foreground">12-month dividend income</p>
            </div>
          </div>
          <div className="h-[300px]">
            <ChartContainer config={dividendChartConfig}>
              <BarChart data={dividendData}>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend verticalAlign="top" content={<ChartLegendContent />} />
                <Bar 
                  dataKey="value" 
                  fill="var(--color-dividend, #82ca9d)" 
                  name="dividend"
                />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
