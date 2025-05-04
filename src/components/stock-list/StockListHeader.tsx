
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface StockListHeaderProps {
  onOpenAddDialog: () => void;
}

export const StockListHeader = ({ onOpenAddDialog }: StockListHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-medium">Your Stocks</h2>
      <Button size="sm" onClick={onOpenAddDialog}>
        <Plus className="h-4 w-4 mr-1" /> Add Stock
      </Button>
    </div>
  );
};
