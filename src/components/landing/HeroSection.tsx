
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="px-6 py-20 md:py-32 md:px-10 flex flex-col items-center text-center max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
        Track Your Investments with <span className="text-primary">Dividnd</span>
      </h1>
      <p className="text-lg text-muted-foreground mb-10 max-w-2xl">
        A simple and beautiful way to monitor your dividend portfolio. 
        Get real-time updates, track performance, and make informed investment decisions.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => navigate("/dashboard")} size="lg">
          Get Started for Free
        </Button>
        <Button variant="outline" size="lg" onClick={() => navigate("/demo")}>
          View Demo
        </Button>
      </div>
    </section>
  );
};
