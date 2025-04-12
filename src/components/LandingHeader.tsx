
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";

export const LandingHeader = () => {
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("Please connect to Supabase first to enable authentication");
    // In a real app with Supabase, we would use:
    // supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword })
    setIsLoginOpen(false);
    navigate("/dashboard");
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("Please connect to Supabase first to enable authentication");
    // In a real app with Supabase, we would use:
    // supabase.auth.signUp({ email: signupEmail, password: signupPassword })
    setIsSignupOpen(false);
    navigate("/dashboard");
  };

  return (
    <header className="py-4 px-6 md:px-10 flex justify-between items-center border-b">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-primary">ShareSight</h1>
      </div>
      <div className="flex space-x-4">
        <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Log in</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log in to ShareSight</DialogTitle>
              <DialogDescription>
                Enter your credentials to access your portfolio
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleLogin} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Log in</Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
          <DialogTrigger asChild>
            <Button>Sign up</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create your ShareSight account</DialogTitle>
              <DialogDescription>
                Start tracking your investments in minutes
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSignup} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Create account</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
};
