
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { usePortfolio } from "@/hooks/use-portfolio";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export const MonthlyDividendChart = () => {
  const { stocks } = usePortfolio();
  
  const calculateMonthlyDividends = () => {
    const monthlyData = Array(12).fill(0).map((_, index) => ({
      name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index],
      amount: 0
    }));
    
    stocks.forEach(stock => {
      if (!stock.dividendYield) return;
      
      const annualDividendAmount = stock.quantity * stock.currentPrice * (stock.dividendYield / 100);
      
      switch(stock.dividendFrequency) {
        case 'monthly':
          for (let i = 0; i < 12; i++) {
            monthlyData[i].amount += annualDividendAmount / 12;
          }
          break;
        case 'quarterly':
          // Assume quarterly dividends in months 3, 6, 9, 12
          monthlyData[2].amount += annualDividendAmount / 4;
          monthlyData[5].amount += annualDividendAmount / 4;
          monthlyData[8].amount += annualDividendAmount / 4;
          monthlyData[11].amount += annualDividendAmount / 4;
          break;
        case 'semi-annual':
          // Assume semi-annual dividends in months 6 and 12
          monthlyData[5].amount += annualDividendAmount / 2;
          monthlyData[11].amount += annualDividendAmount / 2;
          break;
        case 'annual':
          // Assume annual dividend in month 12
          monthlyData[11].amount += annualDividendAmount;
          break;
        default:
          // Default to annual
          monthlyData[11].amount += annualDividendAmount;
      }
    });
    
    // Round amounts to 2 decimal places
    monthlyData.forEach(month => {
      month.amount = parseFloat(month.amount.toFixed(2));
    });
    
    return monthlyData;
  };
  
  const monthlyDividends = calculateMonthlyDividends();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Monthly Dividend Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyDividends}>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#888' }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tickFormatter={(value) => `$${value}`} 
              tick={{ fontSize: 12, fill: '#888' }}
            />
            <Tooltip 
              formatter={(value) => [`$${value}`, "Dividend"]}
              contentStyle={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '6px' }}
            />
            <Bar 
              dataKey="amount" 
              fill="#9b87f5" 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
