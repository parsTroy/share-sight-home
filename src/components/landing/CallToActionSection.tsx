
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const CallToActionSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="bg-primary text-primary-foreground py-16 px-6 md:px-10">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Start Building Your Dividend Stream?</h2>
        <p className="mb-8 text-lg">
          Join thousands of investors who are making smarter dividend investment decisions with Dividnd.
        </p>
        <Button 
          variant="secondary" 
          size="lg" 
          onClick={() => navigate("/dashboard")}
        >
          Create Your Free Account
        </Button>
      </div>
    </section>
  );
};
