
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export const DemoHeader = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleLogoClick = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };
  
  return (
    <div className="bg-primary/5 py-4 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 
              onClick={handleLogoClick}
              className="text-2xl font-bold cursor-pointer"
            >
              Demo Dashboard
            </h1>
            <p className="text-muted-foreground">This is a visual demo of what Dividnd offers</p>
          </div>
          <Button onClick={() => navigate("/auth")} className="whitespace-nowrap">
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
};
