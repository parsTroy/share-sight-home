
import { DashboardHeader } from "@/components/DashboardHeader";
import { PortfolioSummary } from "@/components/PortfolioSummary";
import { PortfolioChart } from "@/components/PortfolioChart";
import { StockList } from "@/components/stock-list/StockList";
import { DividendSummary } from "@/components/DividendSummary";
import { DividendGoalTracker } from "@/components/DividendGoalTracker";
import { MonthlyDividendChart } from "@/components/MonthlyDividendChart";
import { StockSuggestions } from "@/components/StockSuggestions";
import { PortfolioProvider } from "@/hooks/use-portfolio";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const [isUpdatingPrices, setIsUpdatingPrices] = useState(false);
  
  const updateAllPrices = async () => {
    setIsUpdatingPrices(true);
    toast.info("Updating stock prices. This may take a moment...");
    
    try {
      const { data, error } = await supabase.functions.invoke('update-stock-prices', {
        body: { },
      });
      
      if (error) {
        toast.error(`Failed to update prices: ${error.message}`);
      } else {
        toast.success(data.message || "Stock prices updated successfully");
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsUpdatingPrices(false);
    }
  };
  
  return (
    <PortfolioProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <DashboardHeader />
        
        <main className="flex-grow p-6 md:p-10">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Portfolio Summary Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <PortfolioSummary />
              </div>
              <div className="lg:col-span-2">
                <PortfolioChart />
              </div>
            </div>
            
            {/* Dividend Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <DividendSummary />
              </div>
              <div className="lg:col-span-1">
                <DividendGoalTracker />
              </div>
              <div className="lg:col-span-1">
                <MonthlyDividendChart />
              </div>
            </div>
            
            {/* Stock Suggestions Section */}
            <StockSuggestions />
            
            {/* Stock List Section */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Your Stocks</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={updateAllPrices} 
                disabled={isUpdatingPrices}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isUpdatingPrices ? 'animate-spin' : ''}`} />
                Update All Prices
              </Button>
            </div>
            <StockList />
          </div>
        </main>
      </div>
    </PortfolioProvider>
  );
};

export default Dashboard;
