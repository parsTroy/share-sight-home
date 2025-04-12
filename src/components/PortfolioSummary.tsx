
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { usePortfolio } from "@/hooks/use-portfolio";
import { ArrowDown, ArrowUp } from "lucide-react";

export const PortfolioSummary = () => {
  const { portfolioValue, portfolioChange, portfolioChangePercent } = usePortfolio();
  
  const isPositiveChange = portfolioChange >= 0;

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Portfolio Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-3xl font-bold">${portfolioValue.toLocaleString()}</p>
            <div className="flex items-center mt-2">
              <span className={`flex items-center ${isPositiveChange ? 'text-gain' : 'text-loss'}`}>
                {isPositiveChange ? (
                  <ArrowUp className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDown className="h-4 w-4 mr-1" />
                )}
                ${Math.abs(portfolioChange).toLocaleString()} ({portfolioChangePercent}%)
              </span>
              <span className="text-sm text-muted-foreground ml-2">Today</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Daily Goal</span>
              <span className="font-medium">78%</span>
            </div>
            <Progress value={78} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
