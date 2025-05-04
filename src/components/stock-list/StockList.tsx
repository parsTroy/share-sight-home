
import { useState } from "react";
import { toast } from "sonner";
import { usePortfolio } from "@/hooks/use-portfolio";
import { useStockData } from "@/hooks/use-stock-data";
import { useSubscription } from "@/hooks/use-subscription";
import { Stock } from "@/types";
import { StockTable } from "./StockTable";
import { AddStockDialog } from "./AddStockDialog";
import { EditStockDialog } from "./EditStockDialog";
import { SubscriptionBanner } from "../SubscriptionBanner";
import { StockListHeader } from "./StockListHeader";
import { useStockListState } from "./useStockListState";
import { Button } from "@/components/ui/button";

export const StockList = () => {
  const { stocks, addStock, removeStock, updateStock, isLoading, error } = usePortfolio();
  const { canAddStock, stockLimit, subscriptionTier } = useSubscription();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [ticker, setTicker] = useState<string | null>(null);
  const { refreshStockData } = useStockData(ticker);
  
  // Create a wrapper function that works with the Stock object
  const handleRemoveStock = (stock: Stock) => {
    removeStock(stock.id);
  };

  const { 
    isEditDialogOpen, 
    setIsEditDialogOpen, 
    currentEditStock, 
    handleDelete, 
    openEditDialog, 
    handleRefreshStock 
  } = useStockListState(updateStock, handleRemoveStock);

  const handleOpenAddDialog = () => {
    if (canAddStock(stocks.length)) {
      setIsAddDialogOpen(true);
    } else {
      if (subscriptionTier === "premium") {
        toast.error(`You've reached your ${stockLimit} stock limit. Contact support to increase your limit.`);
      } else {
        toast.error("You've reached your stock limit. Please upgrade to Premium for more stocks.");
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-lg text-muted-foreground">Loading your portfolio...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center p-8 gap-4">
        <p className="text-lg text-red-500">Error loading your portfolio</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <StockListHeader onOpenAddDialog={handleOpenAddDialog} />

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
