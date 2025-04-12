
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { usePortfolio } from "@/hooks/use-portfolio";
import { useStockData } from "@/hooks/use-stock-data";
import { useSubscription } from "@/hooks/use-subscription";
import { Stock } from "@/types";
import { StockTable } from "./StockTable";
import { AddStockDialog } from "./AddStockDialog";
import { EditStockDialog } from "./EditStockDialog";
import { SubscriptionBanner } from "../SubscriptionBanner";

export const StockList = () => {
  const { stocks, addStock, removeStock, updateStock } = usePortfolio();
  const { canAddStock } = useSubscription();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentEditStock, setCurrentEditStock] = useState<Stock | null>(null);
  const [ticker, setTicker] = useState<string | null>(null);
  const { refreshStockData } = useStockData(ticker);

  const openEditDialog = (stock: Stock) => {
    setCurrentEditStock(stock);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (stock: Stock) => {
    removeStock(stock.id);
    toast.success(`Removed ${stock.ticker} from your portfolio`);
  };

  const handleRefreshStock = async (stock: Stock) => {
    try {
      setTicker(stock.ticker);
      toast.info(`Refreshing data for ${stock.ticker}...`);
      await refreshStockData(true);
    } catch (error) {
      console.error("Error refreshing stock:", error);
    }
  };

  const handleOpenAddDialog = () => {
    if (canAddStock(stocks.length)) {
      setIsAddDialogOpen(true);
    } else {
      toast.error("You've reached your stock limit. Please upgrade to Premium for unlimited stocks.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Your Stocks</h2>
        <Button size="sm" onClick={handleOpenAddDialog}>
          <Plus className="h-4 w-4 mr-1" /> Add Stock
        </Button>
      </div>

      <SubscriptionBanner />

      <StockTable 
        stocks={stocks}
        onEdit={openEditDialog}
        onDelete={handleDelete}
        onRefresh={handleRefreshStock}
        onOpenAddDialog={handleOpenAddDialog}
      />

      <AddStockDialog 
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddStock={addStock}
      />

      <EditStockDialog 
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdateStock={updateStock}
        stock={currentEditStock}
      />
    </div>
  );
};
