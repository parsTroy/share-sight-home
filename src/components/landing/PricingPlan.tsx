
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { useState } from "react";

type PricingPlanProps = {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  disabledFeatures?: string[];
  popular?: boolean;
  annual?: boolean;
  buttonVariant?: "default" | "outline";
};

export const PricingPlan = ({
  title,
  price,
  period,
  description,
  features,
  disabledFeatures = [],
  popular = false,
  annual = false,
  buttonVariant = "default"
}: PricingPlanProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { startCheckout } = useSubscription();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubscribe = () => {
    if (title === "Free") {
      navigate("/auth");
      return;
    }
    
    if (user) {
      setIsLoading(true);
      startCheckout(annual).finally(() => setIsLoading(false));
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className={`border bg-card rounded-lg shadow-sm overflow-hidden flex flex-col ${popular ? 'border-primary' : ''}`}>
      {popular && (
        <div className="bg-primary/10 p-2 text-center">
          <span className="text-sm font-medium text-primary">MOST POPULAR</span>
        </div>
      )}
      <div className="p-6 border-b">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold">{price}</span>
          <span className="text-muted-foreground ml-1">{period}</span>
        </div>
        <p className="mt-4 text-muted-foreground">{description}</p>
      </div>
      <div className="p-6 flex-grow">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
          {disabledFeatures.map((feature, index) => (
            <li key={`disabled-${index}`} className="flex items-center">
              <XCircle className="h-5 w-5 text-gray-300 dark:text-gray-600 mr-2 flex-shrink-0" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-6 pt-0">
        <Button 
          onClick={handleSubscribe}
          className="w-full" 
          variant={buttonVariant}
          disabled={isLoading}
        >
          {user ? (title === "Free" ? "Sign Up Free" : "Subscribe Now") : (title === "Free" ? "Sign Up Free" : "Sign Up & Subscribe")}
        </Button>
      </div>
    </div>
  );
};
