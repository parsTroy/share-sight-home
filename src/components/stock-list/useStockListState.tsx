
import { useState } from "react";
import { Stock } from "@/types";
import { useStockData } from "@/hooks/use-stock-data";
import { toast } from "sonner";

export const useStockListState = (onEdit: (stock: Stock) => void, onDelete: (stock: Stock) => void) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentEditStock, setCurrentEditStock] = useState<Stock | null>(null);
  const [ticker, setTicker] = useState<string | null>(null);
  const { refreshStockData } = useStockData(ticker);

  const openEditDialog = (stock: Stock) => {
    setCurrentEditStock(stock);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (stock: Stock) => {
    onDelete(stock);
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

  return {
    isEditDialogOpen,
    setIsEditDialogOpen,
    currentEditStock,
    handleDelete,
    openEditDialog,
    handleRefreshStock
  };
};
