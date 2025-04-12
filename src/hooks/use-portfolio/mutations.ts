
import { supabase } from "@/integrations/supabase/client";
import { Stock } from "@/types";

// Add a new stock mutation
export const addStock = async (stock: Stock, userId: string) => {
  if (!userId) throw new Error('User not authenticated');
  
  // Try to get real-time stock data first
  try {
    const { data: realTimeData, error: realTimeError } = await supabase.functions.invoke('fetch-stock-data', {
      body: { ticker: stock.ticker },
    });
    
    if (!realTimeError && realTimeData) {
      // Update stock with real-time data if available
      stock.currentPrice = realTimeData.price || stock.currentPrice;
      stock.dividendYield = realTimeData.dividendYield || stock.dividendYield;
      stock.exDividendDate = realTimeData.dividendDate || stock.exDividendDate;
    }
  } catch (e) {
    console.error('Error fetching real-time stock data:', e);
    // Continue with the provided stock data
  }
  
  const { error } = await supabase
    .from('stocks')
    .insert([{
      user_id: userId,
      ticker: stock.ticker,
      quantity: stock.quantity,
      purchase_price: stock.purchasePrice,
      current_price: stock.currentPrice,
      dividend_yield: stock.dividendYield,
      dividend_frequency: stock.dividendFrequency,
      ex_dividend_date: stock.exDividendDate
    }]);
    
  if (error) throw error;
};

// Remove a stock mutation
export const removeStock = async (id: string) => {
  const { error } = await supabase
    .from('stocks')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
};

// Update a stock mutation
export const updateStock = async (stock: Stock) => {
  const { error } = await supabase
    .from('stocks')
    .update({
      quantity: stock.quantity,
      purchase_price: stock.purchasePrice,
      current_price: stock.currentPrice,
      dividend_yield: stock.dividendYield,
      dividend_frequency: stock.dividendFrequency,
      ex_dividend_date: stock.exDividendDate
    })
    .eq('id', stock.id);
    
  if (error) throw error;
};

// Update dividend goal mutation
export const updateDividendGoal = async (goal: number, userId: string) => {
  if (!userId) throw new Error('User not authenticated');
  
  const { error } = await supabase
    .from('dividend_goals')
    .update({ annual_goal: goal })
    .eq('user_id', userId);
    
  if (error) throw error;
};
