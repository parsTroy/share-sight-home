
import { LandingHeader } from "@/components/LandingHeader";
import { DemoHeader } from "@/components/demo/DemoHeader";
import { DemoStats } from "@/components/demo/DemoStats";
import { DemoCharts } from "@/components/demo/DemoCharts";
import { DemoStockTable } from "@/components/demo/DemoStockTable";
import { DemoSectorAllocation } from "@/components/demo/DemoSectorAllocation";
import { DemoCallToAction } from "@/components/demo/DemoCallToAction";
import { DemoFooter } from "@/components/demo/DemoFooter";

const Demo = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LandingHeader />
      <DemoHeader />
      
      <main className="flex-grow p-6 md:p-10 max-w-7xl mx-auto w-full">
        <DemoStats />
        <DemoCharts />
        
        {/* Stock Table & Sector Allocation */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <DemoStockTable />
          <DemoSectorAllocation />
        </div>
        
        <DemoCallToAction />
      </main>
      
      <DemoFooter />
    </div>
  );
};

export default Demo;
