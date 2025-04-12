
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";

export const LandingHeader = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  
  return (
    <header className="py-4 px-6 md:px-10 flex justify-between items-center border-b bg-background">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-primary">Dividnd</h1>
      </div>
      <div className="flex space-x-4 items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
        
        {user ? (
          <Button onClick={() => navigate("/dashboard")}>
            Dashboard
          </Button>
        ) : (
          <>
            <Button variant="outline" onClick={() => navigate("/auth")}>
              Log in
            </Button>
            <Button onClick={() => navigate("/auth")}>
              Sign up
            </Button>
          </>
        )}
      </div>
    </header>
  );
};
