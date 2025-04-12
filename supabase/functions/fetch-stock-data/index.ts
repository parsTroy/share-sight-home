
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request body
    const { ticker, updateDatabase = false, userId } = await req.json();
    
    if (!ticker) {
      return new Response(
        JSON.stringify({ error: 'Ticker symbol is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // First, check if we have recent data in cache (less than 24 hours old)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if we have cached data that's recent (less than 24 hours old)
    const { data: cachedData, error: cacheError } = await supabase
      .from('stock_data_cache')
      .select('*')
      .eq('ticker', ticker.toUpperCase())
      .single();

    // If we have recent cached data, return it
    if (cachedData && !cacheError) {
      const cachedTime = new Date(cachedData.updated_at);
      const currentTime = new Date();
      const hoursSinceCached = (currentTime.getTime() - cachedTime.getTime()) / (1000 * 60 * 60);

      if (hoursSinceCached < 24 && !updateDatabase) {
        console.log(`Returning cached data for ${ticker}, cached ${hoursSinceCached.toFixed(2)} hours ago`);
        return new Response(
          JSON.stringify({
            ticker: cachedData.ticker,
            price: cachedData.price,
            dividendYield: cachedData.dividend_yield,
            dividendDate: cachedData.ex_dividend_date,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // If no recent cached data, fetch from Alpha Vantage
    const apiKey = Deno.env.get('ALPHA_VANTAGE_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Alpha Vantage API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log(`Fetching data for ${ticker} from Alpha Vantage...`);
    
    // Get quote data for current price
    const quoteUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${apiKey}`;
    const quoteResponse = await fetch(quoteUrl);
    const quoteData = await quoteResponse.json();

    // Get overview data for dividend information
    const overviewUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${apiKey}`;
    const overviewResponse = await fetch(overviewUrl);
    const overviewData = await overviewResponse.json();

    // Check for API errors or rate limiting
    if (quoteData['Error Message'] || quoteData['Note'] || overviewData['Error Message'] || overviewData['Note']) {
      const errorMessage = quoteData['Error Message'] || quoteData['Note'] || overviewData['Error Message'] || overviewData['Note'];
      console.error(`Alpha Vantage API error: ${errorMessage}`);
      
      // If we have any cached data, return that instead with a warning
      if (cachedData) {
        return new Response(
          JSON.stringify({
            ticker: cachedData.ticker,
            price: cachedData.price,
            dividendYield: cachedData.dividend_yield,
            dividendDate: cachedData.ex_dividend_date,
            warning: 'Using cached data due to API limitations: ' + errorMessage
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: `Alpha Vantage API error: ${errorMessage}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
      );
    }

    // Extract the data we need
    const price = parseFloat(quoteData['Global Quote']?.['05. price'] || '0');
    const dividendYield = parseFloat(overviewData['DividendYield'] || '0');
    const exDividendDate = overviewData['ExDividendDate'] || null;

    // Prepare the response data
    const stockData = {
      ticker: ticker.toUpperCase(),
      price: price || 0,
      dividendYield: dividendYield || 0,
      dividendDate: exDividendDate
    };

    // Update the cache in the database
    if (price > 0) {
      const { error: upsertError } = await supabase
        .from('stock_data_cache')
        .upsert({
          ticker: ticker.toUpperCase(),
          price,
          dividend_yield: dividendYield > 0 ? dividendYield : null,
          ex_dividend_date: exDividendDate ? new Date(exDividendDate) : null,
          updated_at: new Date()
        });
      
      if (upsertError) {
        console.error(`Error updating cache: ${upsertError.message}`);
      }

      // If requested to update user's stock in database, do so
      if (updateDatabase && userId && price > 0) {
        const { error: updateStockError } = await supabase
          .from('stocks')
          .update({
            current_price: price,
            dividend_yield: dividendYield > 0 ? dividendYield : null,
            ex_dividend_date: exDividendDate ? new Date(exDividendDate) : null,
          })
          .eq('ticker', ticker.toUpperCase())
          .eq('user_id', userId);
        
        if (updateStockError) {
          console.error(`Error updating user stock: ${updateStockError.message}`);
        } else {
          console.log(`Updated stock ${ticker} for user ${userId} in database`);
        }
      }
    }

    return new Response(
      JSON.stringify(stockData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error(`Error in fetch-stock-data function: ${error.message}`);
    return new Response(
      JSON.stringify({ error: `Internal server error: ${error.message}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
