
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.3';

// This function can be scheduled to run daily to update all stock prices

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    
    // Get all unique tickers across all users
    const { data: tickers, error: tickersError } = await supabase
      .from('stocks')
      .select('ticker')
      .order('ticker');
      
    if (tickersError) {
      throw new Error(`Error fetching tickers: ${tickersError.message}`);
    }
    
    console.log(`Found ${tickers.length} unique tickers to update`);
    const uniqueTickers = Array.from(new Set(tickers.map(t => t.ticker)));
    
    // Process 5 tickers at a time (Alpha Vantage rate limit)
    const results = [];
    let processed = 0;
    
    for (const ticker of uniqueTickers) {
      // Rate limit: 5 API calls per minute (Alpha Vantage free tier)
      if (processed > 0 && processed % 5 === 0) {
        console.log(`Processed ${processed} tickers, pausing for rate limit...`);
        await new Promise(resolve => setTimeout(resolve, 62000)); // 62 seconds to be safe
      }
      
      try {
        // Fetch quote data
        const quoteUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${ALPHA_VANTAGE_API_KEY}`;
        const quoteResponse = await fetch(quoteUrl);
        const quoteData = await quoteResponse.json();
        
        if (!quoteData['Global Quote'] || !quoteData['Global Quote']['05. price']) {
          console.warn(`No price data found for ${ticker}`);
          results.push({
            ticker,
            status: 'error',
            message: 'No price data found'
          });
          continue;
        }
        
        const currentPrice = parseFloat(quoteData['Global Quote']['05. price']);
        
        // Get company overview for dividend data
        const overviewUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${ALPHA_VANTAGE_API_KEY}`;
        const overviewResponse = await fetch(overviewUrl);
        const overviewData = await overviewResponse.json();
        
        const dividendYield = overviewData.DividendYield 
          ? parseFloat(overviewData.DividendYield) * 100 
          : null;
        
        const exDividendDate = overviewData.ExDividendDate || null;
        
        // Update all stocks with this ticker
        const { error: updateError } = await supabase
          .from('stocks')
          .update({
            current_price: currentPrice,
            dividend_yield: dividendYield,
            ex_dividend_date: exDividendDate,
            updated_at: new Date().toISOString()
          })
          .eq('ticker', ticker);
          
        if (updateError) {
          throw new Error(`Error updating ${ticker}: ${updateError.message}`);
        }
        
        // Cache the data
        const { error: cacheError } = await supabase
          .from('stock_data_cache')
          .upsert({
            ticker: ticker,
            price: currentPrice,
            dividend_yield: dividendYield,
            ex_dividend_date: exDividendDate,
            updated_at: new Date().toISOString()
          }, { onConflict: 'ticker' });
          
        if (cacheError) {
          console.warn(`Error caching data for ${ticker}: ${cacheError.message}`);
        }
        
        results.push({
          ticker,
          status: 'success',
          price: currentPrice,
          dividendYield
        });
        
        console.log(`Updated ${ticker}: $${currentPrice}, yield: ${dividendYield}%`);
        
      } catch (error) {
        console.error(`Error processing ${ticker}:`, error);
        results.push({
          ticker,
          status: 'error',
          message: error.message
        });
      }
      
      processed++;
    }
    
    return new Response(
      JSON.stringify({
        message: `Updated ${results.filter(r => r.status === 'success').length} of ${uniqueTickers.length} stocks`,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in update-stock-prices function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
