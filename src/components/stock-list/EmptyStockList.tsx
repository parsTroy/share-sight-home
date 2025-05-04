
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyStockListProps {
  onOpenAddDialog: () => void;
}

export const EmptyStockList = ({ onOpenAddDialog }: EmptyStockListProps) => {
  return (
    <div className="text-center py-6">
      <div className="text-muted-foreground">
        No stocks in your portfolio yet. Add your first stock to get started!
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        className="mt-2"
        onClick={onOpenAddDialog}
      >
        <Plus className="h-4 w-4 mr-1" /> Add Stock
      </Button>
    </div>
  );
};
