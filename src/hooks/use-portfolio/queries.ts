
import { supabase } from "@/integrations/supabase/client";
import { Stock } from "@/types";
import { toast } from "sonner";

// Fetch stocks from Supabase
export const fetchStocks = async (userId: string | undefined) => {
  if (!userId) return [];
  
  const { data, error } = await supabase
    .from('stocks')
    .select('*')
    .eq('user_id', userId)
    .order('ticker');
    
  if (error) {
    toast.error(`Failed to load stocks: ${error.message}`);
    return [];
  }
  
  return data.map((stock: any) => ({
    id: stock.id,
    ticker: stock.ticker,
    quantity: Number(stock.quantity),
    purchasePrice: Number(stock.purchase_price),
    currentPrice: Number(stock.current_price),
    dividendYield: stock.dividend_yield ? Number(stock.dividend_yield) : undefined,
    dividendFrequency: stock.dividend_frequency as any,
    exDividendDate: stock.ex_dividend_date
  }));
};

// Fetch dividend goal from Supabase
export const fetchDividendGoal = async (userId: string | undefined) => {
  if (!userId) return null;
  
  const { data, error } = await supabase
    .from('dividend_goals')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  if (error && error.code !== 'PGRST116') {
    toast.error(`Failed to load dividend goal: ${error.message}`);
    return null;
  }
  
  if (data) {
    return data;
  } else {
    // Create a default goal if none exists
    const { data: newGoal, error: insertError } = await supabase
      .from('dividend_goals')
      .insert([{ user_id: userId, annual_goal: 5000 }])
      .select()
      .single();
      
    if (insertError) {
      toast.error(`Failed to create dividend goal: ${insertError.message}`);
      return null;
    }
    
    return newGoal;
  }
};
