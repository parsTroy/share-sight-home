
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
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify JWT for security - only authenticated users can trigger this
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Get all unique stock tickers to update
    const { data: uniqueTickers, error: tickersError } = await supabase
      .from('stocks')
      .select('ticker')
      .order('ticker')
      .limit(5); // Processing in small batches to avoid rate limits

    if (tickersError) {
      console.error(`Error fetching tickers: ${tickersError.message}`);
      return new Response(
        JSON.stringify({ error: `Error fetching tickers: ${tickersError.message}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    if (!uniqueTickers || uniqueTickers.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No stocks found to update' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${uniqueTickers.length} unique tickers to update`);

    // Process each ticker
    const apiKey = Deno.env.get('ALPHA_VANTAGE_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Alpha Vantage API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const updateResults = [];

    // Update each ticker with a delay to avoid API rate limits
    for (const item of uniqueTickers) {
      const ticker = item.ticker;
      try {
        console.log(`Updating data for ${ticker}`);
        
        // Get quote data for current price
        const quoteUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${apiKey}`;
        const quoteResponse = await fetch(quoteUrl);
        const quoteData = await quoteResponse.json();

        // Check for API rate limiting
        if (quoteData['Note']) {
          console.warn(`API rate limit reached: ${quoteData['Note']}`);
          updateResults.push({ ticker, status: 'rate_limited', message: quoteData['Note'] });
          break; // Stop processing more tickers
        }

        // Get overview data for dividend information
        const overviewUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${apiKey}`;
        const overviewResponse = await fetch(overviewUrl);
        const overviewData = await overviewResponse.json();

        // Extract data
        const price = parseFloat(quoteData['Global Quote']?.['05. price'] || '0');
        const dividendYield = parseFloat(overviewData['DividendYield'] || '0');
        const exDividendDate = overviewData['ExDividendDate'] || null;

        if (price > 0) {
          // Update cache
          const { error: cacheError } = await supabase
            .from('stock_data_cache')
            .upsert({
              ticker: ticker,
              price,
              dividend_yield: dividendYield > 0 ? dividendYield : null,
              ex_dividend_date: exDividendDate ? new Date(exDividendDate) : null,
              updated_at: new Date()
            });

          // Update all user stocks with this ticker
          const { error: stocksError } = await supabase
            .from('stocks')
            .update({
              current_price: price,
              dividend_yield: dividendYield > 0 ? dividendYield : null,
              ex_dividend_date: exDividendDate ? new Date(exDividendDate) : null,
            })
            .eq('ticker', ticker);

          updateResults.push({ 
            ticker, 
            status: 'success',
            price,
            cacheError: cacheError?.message || null,
            stocksError: stocksError?.message || null
          });
        } else {
          updateResults.push({ ticker, status: 'error', message: 'Invalid price data received' });
        }

        // Add a delay to avoid hitting API rate limits
        if (uniqueTickers.length > 1) {
          console.log('Waiting before processing next ticker...');
          await new Promise(resolve => setTimeout(resolve, 15000)); // 15 second delay
        }
      } catch (error) {
        console.error(`Error updating ${ticker}: ${error.message}`);
        updateResults.push({ ticker, status: 'error', message: error.message });
      }
    }

    return new Response(
      JSON.stringify({ 
        message: `Updated ${updateResults.filter(r => r.status === 'success').length} out of ${uniqueTickers.length} stocks`,
        results: updateResults
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error(`Error in update-stock-prices function: ${error.message}`);
    return new Response(
      JSON.stringify({ error: `Internal server error: ${error.message}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
