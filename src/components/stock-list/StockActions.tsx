
import { Button } from "@/components/ui/button";
import { RefreshCw, Edit, Trash } from "lucide-react";
import { Stock } from "@/types";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface StockActionsProps {
  stock: Stock;
  onEdit: (stock: Stock) => void;
  onDelete: (stock: Stock) => void;
  onRefresh: (stock: Stock) => void;
}

export const StockActions = ({ stock, onEdit, onDelete, onRefresh }: StockActionsProps) => {
  return (
    <div className="flex justify-end space-x-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => onRefresh(stock)}
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Refresh market data</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onEdit(stock)}
        className="h-8 w-8"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onDelete(stock)}
        className="h-8 w-8 text-destructive"
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};
