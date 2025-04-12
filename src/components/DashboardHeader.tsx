
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import { User, Settings, LogOut } from "lucide-react";
import { toast } from "sonner";

export const DashboardHeader = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    toast.info("Please connect to Supabase first to enable authentication");
    // In a real app with Supabase, we would use:
    // supabase.auth.signOut()
    navigate("/");
  };

  return (
    <header className="py-4 px-6 flex justify-between items-center border-b bg-white">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-primary">ShareSight</h1>
      </div>
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
