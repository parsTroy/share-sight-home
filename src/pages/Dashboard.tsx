
import { DashboardHeader } from "@/components/DashboardHeader";
import { PortfolioSummary } from "@/components/PortfolioSummary";
import { PortfolioChart } from "@/components/PortfolioChart";
import { StockList } from "@/components/StockList";
import { PortfolioProvider } from "@/hooks/use-portfolio";

const Dashboard = () => {
  return (
    <PortfolioProvider>
      <div className="flex flex-col min-h-screen bg-gray-50">
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
            
            {/* Stock List Section */}
            <StockList />
          </div>
        </main>
      </div>
    </PortfolioProvider>
  );
};

export default Dashboard;
