
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const Footer = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Thank you for subscribing!",
        description: "You'll now receive our bi-monthly dividend stock newsletter.",
      });
      
      // Clear form
      setName("");
      setEmail("");
      setIsSubscribing(false);
    }, 1000);
  };

  return (
    <footer className="bg-background border-t py-8 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Subscribe to Our Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Stay updated with our bi-monthly dividend stock picks and market insights
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div>
                <Input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full md:w-3/4"
                />
              </div>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button type="submit" disabled={isSubscribing}>
                  {isSubscribing ? "Subscribing..." : "Subscribe"}
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</Link>
                </li>
                <li>
                  <Link to="/demo" className="text-muted-foreground hover:text-foreground">Demo</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact & Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link>
                </li>
                <li>
                  <Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms</Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-muted">
          <div className="mb-6 md:mb-0">
            <h2 className="text-xl font-bold text-primary">Dividnd</h2>
            <p className="text-sm text-muted-foreground">
              &copy; 2025 Dividnd. All rights reserved.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <a 
              href="mailto:support@dividnd.com" 
              className="text-muted-foreground hover:text-foreground"
            >
              support@dividnd.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
