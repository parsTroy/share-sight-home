
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StockData {
  symbol: string;
  price: number;
  dividendYield?: number;
  dividendDate?: string;
}

const ALPHA_VANTAGE_API_KEY = Deno.env.get('ALPHA_VANTAGE_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL || '', SUPABASE_ANON_KEY || '');
    
    // Get the request body
    const { ticker, updateDatabase = false, userId = null } = await req.json();
    
    if (!ticker) {
      return new Response(
        JSON.stringify({ error: 'Ticker symbol is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Check cache first (data less than 24 hours old)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    const { data: cachedData } = await supabase
      .from('stock_data_cache')
      .select('*')
      .eq('ticker', ticker)
      .gt('updated_at', oneDayAgo.toISOString())
      .single();
    
    if (cachedData) {
      console.log(`Using cached data for ${ticker}`);
      return new Response(
        JSON.stringify(cachedData),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Fetching fresh data for ${ticker} from Alpha Vantage`);
    
    // Get quote data (real-time price)
    const quoteUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const quoteResponse = await fetch(quoteUrl);
    const quoteData = await quoteResponse.json();
    
    if (!quoteData['Global Quote'] || !quoteData['Global Quote']['05. price']) {
      return new Response(
        JSON.stringify({ error: `No data found for ticker ${ticker}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }
    
    const currentPrice = parseFloat(quoteData['Global Quote']['05. price']);
    
    // Get company overview for dividend data
    const overviewUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const overviewResponse = await fetch(overviewUrl);
    const overviewData = await overviewResponse.json();
    
    const stockData: StockData = {
      symbol: ticker,
      price: currentPrice,
    };
    
    // Add dividend data if available
    if (overviewData.DividendYield) {
      stockData.dividendYield = parseFloat(overviewData.DividendYield) * 100; // Convert to percentage
    }
    
    if (overviewData.ExDividendDate) {
      stockData.dividendDate = overviewData.ExDividendDate;
    }
    
    // Cache the results
    const { error: cacheError } = await supabase
      .from('stock_data_cache')
      .upsert({
        ticker: ticker,
        price: stockData.price,
        dividend_yield: stockData.dividendYield || null,
        ex_dividend_date: stockData.dividendDate || null,
        updated_at: new Date().toISOString()
      }, { onConflict: 'ticker' });
    
    if (cacheError) {
      console.error('Error caching stock data:', cacheError);
    }
    
    // If updateDatabase is true, update the user's stock current price and dividend data
    if (updateDatabase && userId) {
      const { error: updateError } = await supabase
        .from('stocks')
        .update({
          current_price: stockData.price,
          dividend_yield: stockData.dividendYield || null,
          ex_dividend_date: stockData.dividendDate || null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('ticker', ticker);
      
      if (updateError) {
        console.error('Error updating stock data in database:', updateError);
      }
    }
    
    return new Response(
      JSON.stringify(stockData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in fetch-stock-data function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
