
import { useState } from "react";
import { Stock } from "@/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useStockData } from "@/hooks/use-stock-data";
import { RefreshCw, Plus } from "lucide-react";

interface AddStockDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddStock: (stock: Stock) => void;
}

export const AddStockDialog = ({ isOpen, onOpenChange, onAddStock }: AddStockDialogProps) => {
  const [ticker, setTicker] = useState("");
  const [quantity, setQuantity] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [dividendYield, setDividendYield] = useState("");
  const [dividendFrequency, setDividendFrequency] = useState<"monthly" | "quarterly" | "semi-annual" | "annual">("quarterly");
  const [isLookingUpTicker, setIsLookingUpTicker] = useState(false);
  const { stockData, isLoading, refreshStockData } = useStockData(ticker || null);

  const resetForm = () => {
    setTicker("");
    setQuantity("");
    setPurchasePrice("");
    setDividendYield("");
    setDividendFrequency("quarterly");
  };

  const handleLookupTicker = async () => {
    if (!ticker) {
      toast.error("Please enter a ticker symbol");
      return;
    }
    
    try {
      setIsLookingUpTicker(true);
      const data = await refreshStockData(false);
      
      if (data) {
        toast.success(`Found stock info for ${ticker.toUpperCase()}`);
        setDividendYield(data.dividendYield?.toString() || "");
        if (data.dividendYield) {
          setDividendFrequency("quarterly"); // Default to quarterly
        }
      }
    } catch (error) {
      console.error("Error looking up ticker:", error);
    } finally {
      setIsLookingUpTicker(false);
    }
  };

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker || !quantity || !purchasePrice) {
      toast.error("Please fill all required fields");
      return;
    }
    
    try {
      setIsLookingUpTicker(true);
      // Try to get real stock data first
      const realData = await refreshStockData(false);
      
      const newStock: Stock = {
        id: Date.now().toString(),
        ticker: ticker.toUpperCase(),
        quantity: parseFloat(quantity),
        purchasePrice: parseFloat(purchasePrice),
        currentPrice: realData ? realData.price : parseFloat(purchasePrice),
        dividendYield: realData?.dividendYield ? realData.dividendYield : (dividendYield ? parseFloat(dividendYield) : undefined),
        dividendFrequency: (realData?.dividendYield || dividendYield) ? dividendFrequency : undefined,
        exDividendDate: realData?.dividendDate || undefined
      };
      
      onAddStock(newStock);
      
      toast.success(`Added ${ticker.toUpperCase()} to your portfolio`);
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding stock:", error);
      toast.error("Failed to add stock. Please try again.");
    } finally {
      setIsLookingUpTicker(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a stock to your portfolio</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAddStock} className="space-y-4 pt-4">
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="ticker">Ticker Symbol*</Label>
                <Input
                  id="ticker"
                  placeholder="e.g. AAPL"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  required
                />
              </div>
              <div className="flex items-end">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleLookupTicker}
                  disabled={isLookingUpTicker || !ticker}
                >
                  {isLookingUpTicker ? (
                    <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-1" />
                  )}
                  Lookup
                </Button>
              </div>
            </div>
            {stockData && (
              <div className="text-sm text-green-600">
                Current price: ${stockData.price?.toFixed(2)}
                {stockData.dividendYield && ` • Dividend: ${stockData.dividendYield?.toFixed(2)}%`}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity*</Label>
            <Input
              id="quantity"
              type="number"
              placeholder="e.g. 10"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              min="0.01"
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Purchase Price*</Label>
            <Input
              id="price"
              type="number"
              placeholder="e.g. 150.50"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              required
              min="0.01"
              step="0.01"
            />
          </div>
          {!stockData && (
            <>
              <div className="space-y-2">
                <Label htmlFor="dividend-yield">Dividend Yield (%)</Label>
                <Input
                  id="dividend-yield"
                  type="number"
                  placeholder="e.g. 2.5"
                  value={dividendYield}
                  onChange={(e) => setDividendYield(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
              {dividendYield && parseFloat(dividendYield) > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="dividend-frequency">Dividend Frequency</Label>
                  <Select
                    value={dividendFrequency}
                    onValueChange={(value) => setDividendFrequency(value as "monthly" | "quarterly" | "semi-annual" | "annual")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="semi-annual">Semi-Annual</SelectItem>
                      <SelectItem value="annual">Annual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}
          <DialogFooter>
            <Button type="submit" disabled={isLookingUpTicker}>
              {isLookingUpTicker ? 'Adding...' : 'Add Stock'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
