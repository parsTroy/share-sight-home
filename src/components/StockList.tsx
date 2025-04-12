
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "./ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";
import { ArrowDown, ArrowUp, Plus, Trash, Edit } from "lucide-react";
import { toast } from "sonner";
import { usePortfolio } from "@/hooks/use-portfolio";
import { Stock } from "@/types";

export const StockList = () => {
  const { stocks, addStock, removeStock, updateStock } = usePortfolio();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [ticker, setTicker] = useState("");
  const [quantity, setQuantity] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [dividendYield, setDividendYield] = useState("");
  const [dividendFrequency, setDividendFrequency] = useState<"monthly" | "quarterly" | "semi-annual" | "annual">("quarterly");
  const [currentEditStock, setCurrentEditStock] = useState<Stock | null>(null);

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker || !quantity || !purchasePrice) {
      toast.error("Please fill all required fields");
      return;
    }
    
    addStock({
      id: Date.now().toString(),
      ticker: ticker.toUpperCase(),
      quantity: parseFloat(quantity),
      purchasePrice: parseFloat(purchasePrice),
      currentPrice: parseFloat(purchasePrice) * (1 + Math.random() * 0.2 - 0.1), // Mock price
      dividendYield: dividendYield ? parseFloat(dividendYield) : undefined,
      dividendFrequency: dividendYield ? dividendFrequency : undefined
    });
    
    toast.success(`Added ${ticker.toUpperCase()} to your portfolio`);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEditStock || !quantity || !purchasePrice) {
      toast.error("Please fill all required fields");
      return;
    }
    
    updateStock({
      ...currentEditStock,
      quantity: parseFloat(quantity),
      purchasePrice: parseFloat(purchasePrice),
      dividendYield: dividendYield ? parseFloat(dividendYield) : undefined,
      dividendFrequency: dividendYield ? dividendFrequency : undefined
    });
    
    toast.success(`Updated ${currentEditStock.ticker}`);
    resetForm();
    setIsEditDialogOpen(false);
    setCurrentEditStock(null);
  };

  const resetForm = () => {
    setTicker("");
    setQuantity("");
    setPurchasePrice("");
    setDividendYield("");
    setDividendFrequency("quarterly");
  };

  const openEditDialog = (stock: Stock) => {
    setCurrentEditStock(stock);
    setQuantity(stock.quantity.toString());
    setPurchasePrice(stock.purchasePrice.toString());
    setDividendYield(stock.dividendYield?.toString() || "");
    setDividendFrequency(stock.dividendFrequency || "quarterly");
    setIsEditDialogOpen(true);
  };

  const handleDelete = (stock: Stock) => {
    removeStock(stock.id);
    toast.success(`Removed ${stock.ticker} from your portfolio`);
  };

  // Calculate annual dividend income for a stock
  const calculateAnnualDividend = (stock: Stock) => {
    if (!stock.dividendYield) return 0;
    return (stock.quantity * stock.currentPrice * (stock.dividendYield / 100));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Your Stocks</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Stock
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a stock to your portfolio</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddStock} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="ticker">Ticker Symbol*</Label>
                <Input
                  id="ticker"
                  placeholder="e.g. AAPL"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value)}
                  required
                />
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
              <DialogFooter>
                <Button type="submit">Add Stock</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit {currentEditStock?.ticker}</DialogTitle>
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
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Avg. Price</TableHead>
              <TableHead className="text-right">Current Price</TableHead>
              <TableHead className="text-right">Change</TableHead>
              <TableHead className="text-right">Market Value</TableHead>
              <TableHead className="text-right">Div Yield</TableHead>
              <TableHead className="text-right">Est. Annual Div</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stocks.length > 0 ? (
              stocks.map((stock) => {
                const priceChange = stock.currentPrice - stock.purchasePrice;
                const priceChangePercent = (priceChange / stock.purchasePrice) * 100;
                const marketValue = stock.quantity * stock.currentPrice;
                const annualDividend = calculateAnnualDividend(stock);
                
                return (
                  <TableRow key={stock.id}>
                    <TableCell className="font-medium">{stock.ticker}</TableCell>
                    <TableCell className="text-right">{stock.quantity}</TableCell>
                    <TableCell className="text-right">${stock.purchasePrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${stock.currentPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <span className={`flex items-center justify-end ${priceChange >= 0 ? 'text-gain' : 'text-loss'}`}>
                        {priceChange >= 0 ? (
                          <ArrowUp className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowDown className="h-4 w-4 mr-1" />
                        )}
                        {Math.abs(priceChangePercent).toFixed(2)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">${marketValue.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      {stock.dividendYield ? `${stock.dividendYield}%` : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {annualDividend > 0 ? `$${annualDividend.toFixed(2)}` : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => openEditDialog(stock)}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(stock)}
                          className="h-8 w-8 text-destructive"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-6">
                  <div className="text-muted-foreground">
                    No stocks in your portfolio yet. Add your first stock to get started!
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setIsAddDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Stock
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
