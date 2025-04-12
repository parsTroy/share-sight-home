
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading: authLoading } = useAuth();
  const { checkSubscription, isLoading: subscriptionLoading } = useSubscription();

  // Check both authentication and subscription status
  const isLoading = authLoading || subscriptionLoading;

  // When page loads, ensure subscription is checked
  React.useEffect(() => {
    if (user) {
      checkSubscription();
    }
  }, [user, checkSubscription]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
};
