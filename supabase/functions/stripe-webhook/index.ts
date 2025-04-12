
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook function started");
    
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    
    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Initialize Supabase client with service role to bypass RLS
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );
    
    // Get the webhook payload
    const payload = await req.text();
    const signature = req.headers.get("stripe-signature");
    
    // Webhook secret should be set in environment variables
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      throw new Error("Webhook secret not configured");
    }
    
    // Verify the webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(payload, signature!, webhookSecret);
    } catch (err) {
      logStep("Webhook signature verification failed", { error: err.message });
      return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 });
    }
    
    logStep("Received event", { type: event.type });
    
    // Handle specific event types
    switch (event.type) {
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        const subscription = event.data.object;
        const customerId = subscription.customer as string;
        
        // Get customer email from Stripe
        const customer = await stripe.customers.retrieve(customerId);
        if (customer.deleted) {
          throw new Error("Customer was deleted");
        }
        
        const email = customer.email;
        if (!email) {
          throw new Error("Customer email not found");
        }
        
        logStep("Processing subscription event", { 
          email, 
          subscriptionStatus: subscription.status,
          subscriptionId: subscription.id
        });
        
        // Update subscription status in database
        const isActive = subscription.status === "active";
        const subscriptionEnd = isActive 
          ? new Date(subscription.current_period_end * 1000).toISOString() 
          : null;
          
        // Determine subscription tier from price/product
        let subscriptionTier = "free";
        if (isActive) {
          // Default to "premium" if active - you could make this more granular by checking the price ID
          subscriptionTier = "premium";
          
          // Get the stock limit for premium tier
          const { data: limitData } = await supabaseClient
            .from("subscription_limits")
            .select("max_stocks")
            .eq("tier", "premium")
            .single();
            
          const stockLimit = limitData ? limitData.max_stocks : 999999; // Default to unlimited
          
          logStep("Active subscription details", {
            tier: subscriptionTier,
            stockLimit,
            endDate: subscriptionEnd
          });
        } else {
          // Get the stock limit for free tier
          const { data: limitData } = await supabaseClient
            .from("subscription_limits")
            .select("max_stocks")
            .eq("tier", "free")
            .single();
            
          const stockLimit = limitData ? limitData.max_stocks : 10; // Default to 10
          
          logStep("Inactive subscription details", {
            tier: subscriptionTier,
            stockLimit,
            endDate: null
          });
        }
        
        // Update the subscribers table
        const { error } = await supabaseClient
          .from("subscribers")
          .upsert({
            email,
            stripe_customer_id: customerId,
            subscribed: isActive,
            subscription_tier: subscriptionTier,
            subscription_end: subscriptionEnd,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'email' });
          
        if (error) {
          logStep("Error updating subscriber", { error: error.message });
          throw error;
        }
        
        logStep("Subscription status updated successfully");
        break;
        
      case "invoice.payment_failed":
        // Handle failed payments, could send notification to user
        const invoice = event.data.object;
        const invoiceCustomerId = invoice.customer as string;
        const invoiceCustomer = await stripe.customers.retrieve(invoiceCustomerId);
        
        if (!invoiceCustomer.deleted && invoiceCustomer.email) {
          logStep("Payment failed for customer", { 
            email: invoiceCustomer.email, 
            invoiceId: invoice.id 
          });
          
          // Update subscription status if needed or flag account for follow up
        }
        break;
        
      default:
        logStep("Unhandled event type", { type: event.type });
    }
    
    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("Error processing webhook", { error: errorMessage });
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
