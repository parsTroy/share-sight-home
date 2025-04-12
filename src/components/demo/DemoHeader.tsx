
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const DemoHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-primary/5 py-4 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Demo Dashboard</h1>
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
