
import { Stock } from "@/types";
import { TableCell, TableRow } from "@/components/ui/table";
import { ArrowUp, ArrowDown } from "lucide-react";
import { StockActions } from "./StockActions";

interface StockTableRowProps {
  stock: Stock;
  onEdit: (stock: Stock) => void;
  onDelete: (stock: Stock) => void;
  onRefresh: (stock: Stock) => void;
}

export const StockTableRow = ({ stock, onEdit, onDelete, onRefresh }: StockTableRowProps) => {
  // Calculate values
  const priceChange = stock.currentPrice - stock.purchasePrice;
  const priceChangePercent = (priceChange / stock.purchasePrice) * 100;
  const marketValue = stock.quantity * stock.currentPrice;
  const annualDividend = calculateAnnualDividend(stock);
  
  return (
    <TableRow key={stock.id}>
      <TableCell className="font-medium">{stock.ticker}</TableCell>
      <TableCell className="text-right">{stock.quantity}</TableCell>
      <TableCell className="text-right">${stock.purchasePrice.toFixed(2)}</TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end space-x-1">
          <span>${stock.currentPrice.toFixed(2)}</span>
          <StockActions 
            stock={stock} 
            onEdit={onEdit} 
            onDelete={onDelete} 
            onRefresh={onRefresh} 
          />
        </div>
      </TableCell>
      <TableCell className="text-right">
        <span className={`flex items-center justify-end ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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
        <div className="flex items-center justify-end space-x-1">
          <span>{stock.dividendYield ? `${stock.dividendYield.toFixed(2)}%` : '-'}</span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        {annualDividend > 0 ? `$${annualDividend.toFixed(2)}` : '-'}
      </TableCell>
      <TableCell className="text-right">
        <StockActions 
          stock={stock} 
          onEdit={onEdit} 
          onDelete={onDelete} 
          onRefresh={onRefresh} 
        />
      </TableCell>
    </TableRow>
  );
};

// Helper function to calculate annual dividend income for a stock
const calculateAnnualDividend = (stock: Stock) => {
  if (!stock.dividendYield) return 0;
  return (stock.quantity * stock.currentPrice * (stock.dividendYield / 100));
};
