
import { useState, useEffect } from "react";
import { Stock } from "@/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface EditStockDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStock: (stock: Stock) => void;
  stock: Stock | null;
}

export const EditStockDialog = ({ isOpen, onOpenChange, onUpdateStock, stock }: EditStockDialogProps) => {
  const [quantity, setQuantity] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [dividendYield, setDividendYield] = useState("");
  const [dividendFrequency, setDividendFrequency] = useState<"monthly" | "quarterly" | "semi-annual" | "annual">("quarterly");

  useEffect(() => {
    if (stock) {
      setQuantity(stock.quantity.toString());
      setPurchasePrice(stock.purchasePrice.toString());
      setDividendYield(stock.dividendYield?.toString() || "");
      setDividendFrequency(stock.dividendFrequency || "quarterly");
    }
  }, [stock]);

  const handleEditStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stock || !quantity || !purchasePrice) {
      toast.error("Please fill all required fields");
      return;
    }
    
    onUpdateStock({
      ...stock,
      quantity: parseFloat(quantity),
      purchasePrice: parseFloat(purchasePrice),
      dividendYield: dividendYield ? parseFloat(dividendYield) : undefined,
      dividendFrequency: dividendYield ? dividendFrequency : undefined
    });
    
    toast.success(`Updated ${stock.ticker}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {stock?.ticker}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleEditStock} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-quantity">Quantity*</Label>
            <Input
              id="edit-quantity"
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
            <Label htmlFor="edit-price">Purchase Price*</Label>
            <Input
              id="edit-price"
              type="number"
              placeholder="e.g. 150.50"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              required
              min="0.01"
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-dividend-yield">Dividend Yield (%)</Label>
            <Input
              id="edit-dividend-yield"
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
              <Label htmlFor="edit-dividend-frequency">Dividend Frequency</Label>
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
          <DialogFooter>
            <Button type="submit">Update Stock</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
