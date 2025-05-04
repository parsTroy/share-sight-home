
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface StockRefreshButtonProps {
  onRefresh: (stock: any) => void;
  isRefreshing?: boolean;
  stock?: any;
  buttonText?: string;
}

export const StockRefreshButton = ({ 
  onRefresh, 
  isRefreshing = false, 
  stock,
  buttonText
}: StockRefreshButtonProps) => {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={() => onRefresh(stock)}
      disabled={isRefreshing}
    >
      <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
      {buttonText || 'Refresh'}
    </Button>
  );
};
