
import { Stock } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { StockTableRow } from "./StockTableRow";

interface StockTableProps {
  stocks: Stock[];
  onEdit: (stock: Stock) => void;
  onDelete: (stock: Stock) => void;
  onRefresh: (stock: Stock) => void;
  onOpenAddDialog: () => void;
}

export const StockTable = ({ stocks, onEdit, onDelete, onRefresh, onOpenAddDialog }: StockTableProps) => {
  return (
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
            stocks.map((stock) => (
              <StockTableRow 
                key={stock.id}
                stock={stock} 
                onEdit={onEdit} 
                onDelete={onDelete} 
                onRefresh={onRefresh} 
              />
            ))
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
                  onClick={onOpenAddDialog}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Stock
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
