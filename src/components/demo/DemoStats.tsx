
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, DollarSign, TrendingUp, Calendar } from "lucide-react";

export const DemoStats = () => {
  return (
    <div className="grid gap-6 md:grid-cols-4 mb-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Value</p>
              <h3 className="text-2xl font-bold">$8,553.06</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm font-medium text-green-500">+8.2%</span>
            <span className="text-sm text-muted-foreground ml-2">from last month</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Annual Dividend</p>
              <h3 className="text-2xl font-bold">$1,120</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm font-medium text-green-500">+12.5%</span>
            <span className="text-sm text-muted-foreground ml-2">from last year</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Yield</p>
              <h3 className="text-2xl font-bold">2.47%</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm font-medium text-green-500">+0.1%</span>
            <span className="text-sm text-muted-foreground ml-2">from last month</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Monthly Income</p>
              <h3 className="text-2xl font-bold">$93.33</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm font-medium text-green-500">+5.3%</span>
            <span className="text-sm text-muted-foreground ml-2">from last month</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
