
import { PricingPlan } from "./PricingPlan";

export const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 px-6 md:px-10 bg-muted/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that works for you. Start with our free tier and upgrade as your portfolio grows.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PricingPlan
            title="Free"
            price="$0"
            period="/forever"
            description="Perfect for beginners starting their dividend journey"
            features={[
              "Track up to 10 stocks",
              "Basic portfolio analytics",
              "Dividend tracking"
            ]}
            disabledFeatures={[
              "Advanced analytics",
              "Priority support"
            ]}
            buttonVariant="outline"
          />
          
          <PricingPlan
            title="Premium Monthly"
            price="$7.99"
            period="/month"
            description="Ideal for active investors building their portfolio"
            features={[
              "Unlimited stocks",
              "Advanced portfolio analytics",
              "Dividend forecasting",
              "Stock recommendations",
              "Priority email support"
            ]}
            popular={true}
            annual={false}
          />
          
          <PricingPlan
            title="Premium Annual"
            price="$79"
            period="/year"
            description="Best value for committed dividend investors"
            features={[
              "Unlimited stocks",
              "Advanced portfolio analytics",
              "Dividend forecasting",
              "Stock recommendations",
              "Priority email support",
              "Save 17% (2 months free)"
            ]}
            annual={true}
            buttonVariant="outline"
          />
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Questions about our pricing? <a href="#" className="text-primary underline">Contact us</a>
          </p>
        </div>
      </div>
    </section>
  );
};
