
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { usePortfolio } from "@/hooks/use-portfolio";
import { Progress } from "./ui/progress";
import { DollarSign, Calendar } from "lucide-react";

export const DividendSummary = () => {
  const { stocks, dividendGoal } = usePortfolio();
  
  // Calculate projected dividends
  const calculateDividends = () => {
    let monthlyDividends = Array(12).fill(0);
    let annualDividend = 0;
    
    stocks.forEach(stock => {
      if (!stock.dividendYield) return;
      
      const annualDividendAmount = stock.quantity * stock.currentPrice * (stock.dividendYield / 100);
      annualDividend += annualDividendAmount;
      
      // Distribute dividends based on frequency
      switch(stock.dividendFrequency) {
        case 'monthly':
          for (let i = 0; i < 12; i++) {
            monthlyDividends[i] += annualDividendAmount / 12;
          }
          break;
        case 'quarterly':
          // Assume quarterly dividends in months 3, 6, 9, 12
          monthlyDividends[2] += annualDividendAmount / 4;
          monthlyDividends[5] += annualDividendAmount / 4;
          monthlyDividends[8] += annualDividendAmount / 4;
          monthlyDividends[11] += annualDividendAmount / 4;
          break;
        case 'semi-annual':
          // Assume semi-annual dividends in months 6 and 12
          monthlyDividends[5] += annualDividendAmount / 2;
          monthlyDividends[11] += annualDividendAmount / 2;
          break;
        case 'annual':
          // Assume annual dividend in month 12
          monthlyDividends[11] += annualDividendAmount;
          break;
        default:
          // Default to annual
          monthlyDividends[11] += annualDividendAmount;
      }
    });
    
    // Calculate monthly average
    const monthlyAverage = annualDividend / 12;
    
    return {
      monthly: monthlyDividends,
      annual: annualDividend,
      monthlyAverage
    };
  };
  
  const dividends = calculateDividends();
  const progressPercentage = Math.min(Math.round((dividends.annual / dividendGoal) * 100), 100);
  const currentMonth = new Date().getMonth();
  
  // Get the month name for the current month
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Dividend Income</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Monthly Average</p>
              <p className="text-xl font-bold">${dividends.monthlyAverage.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Annual Projection</p>
              <p className="text-xl font-bold">${dividends.annual.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium mb-1">Expected this month ({monthNames[currentMonth]})</p>
          <p className="text-xl font-bold">${dividends.monthly[currentMonth].toFixed(2)}</p>
        </div>
        
        <div>
          <div className="flex justify-between mb-1 text-sm">
            <span>Progress to Annual Goal</span>
            <span>${dividends.annual.toFixed(2)} of ${dividendGoal.toLocaleString()}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-sm text-muted-foreground mt-1">{progressPercentage}% of your annual dividend goal</p>
        </div>
      </CardContent>
    </Card>
  );
};
