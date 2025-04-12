
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const DemoCallToAction = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-primary rounded-lg p-6 text-primary-foreground">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-xl font-bold mb-2">Ready to track your own portfolio?</h3>
          <p>Sign up now and start building your passive income strategy.</p>
        </div>
        <Button variant="secondary" onClick={() => navigate("/auth")}>
          Create Your Free Account
        </Button>
      </div>
    </div>
  );
};
