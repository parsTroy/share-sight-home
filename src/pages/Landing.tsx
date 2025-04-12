
import { Button } from "@/components/ui/button";
import { LandingHeader } from "@/components/LandingHeader";
import { useNavigate } from "react-router-dom";
import { CircleDollarSign, CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { useState } from "react";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { startCheckout } = useSubscription();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LandingHeader />
      
      <main className="flex-grow">
        {/* Hero Section */}
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
            <Button variant="outline" size="lg">
              View Demo
            </Button>
          </div>
        </section>

        {/* Pricing Plans Section */}
        <section id="pricing" className="py-20 px-6 md:px-10 bg-muted/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose the plan that works for you. Start with our free tier and upgrade as your portfolio grows.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Free Plan */}
              <div className="border bg-card rounded-lg shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b">
                  <h3 className="text-xl font-semibold mb-2">Free</h3>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">$0</span>
                    <span className="text-muted-foreground ml-1">/forever</span>
                  </div>
                  <p className="mt-4 text-muted-foreground">Perfect for beginners starting their dividend journey</p>
                </div>
                <div className="p-6 flex-grow">
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Track up to 10 stocks</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Basic portfolio analytics</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Dividend tracking</span>
                    </li>
                    <li className="flex items-center">
                      <XCircle className="h-5 w-5 text-gray-300 dark:text-gray-600 mr-2 flex-shrink-0" />
                      <span className="text-muted-foreground">Advanced analytics</span>
                    </li>
                    <li className="flex items-center">
                      <XCircle className="h-5 w-5 text-gray-300 dark:text-gray-600 mr-2 flex-shrink-0" />
                      <span className="text-muted-foreground">Priority support</span>
                    </li>
                  </ul>
                </div>
                <div className="p-6 pt-0">
                  <Button 
                    onClick={() => navigate("/auth")} 
                    className="w-full" 
                    variant="outline"
                  >
                    Sign Up Free
                  </Button>
                </div>
              </div>
              
              {/* Premium Monthly Plan */}
              <div className="border bg-card rounded-lg shadow-sm overflow-hidden flex flex-col border-primary">
                <div className="bg-primary/10 p-2 text-center">
                  <span className="text-sm font-medium text-primary">MOST POPULAR</span>
                </div>
                <div className="p-6 border-b">
                  <h3 className="text-xl font-semibold mb-2">Premium Monthly</h3>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">$7.99</span>
                    <span className="text-muted-foreground ml-1">/month</span>
                  </div>
                  <p className="mt-4 text-muted-foreground">Ideal for active investors building their portfolio</p>
                </div>
                <div className="p-6 flex-grow">
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Unlimited stocks</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Advanced portfolio analytics</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Dividend forecasting</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Stock recommendations</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Priority email support</span>
                    </li>
                  </ul>
                </div>
                <div className="p-6 pt-0">
                  <Button 
                    className="w-full" 
                    onClick={() => {
                      if (user) {
                        setIsLoading(true);
                        startCheckout(false).finally(() => setIsLoading(false));
                      } else {
                        navigate("/auth");
                      }
                    }}
                    disabled={isLoading}
                  >
                    {user ? "Subscribe Now" : "Sign Up & Subscribe"}
                  </Button>
                </div>
              </div>
              
              {/* Premium Annual Plan */}
              <div className="border bg-card rounded-lg shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b">
                  <h3 className="text-xl font-semibold mb-2">Premium Annual</h3>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">$79</span>
                    <span className="text-muted-foreground ml-1">/year</span>
                  </div>
                  <p className="mt-4 text-muted-foreground">Best value for committed dividend investors</p>
                </div>
                <div className="p-6 flex-grow">
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Unlimited stocks</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Advanced portfolio analytics</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Dividend forecasting</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Stock recommendations</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Priority email support</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="font-medium">Save 17% (2 months free)</span>
                    </li>
                  </ul>
                </div>
                <div className="p-6 pt-0">
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => {
                      if (user) {
                        setIsLoading(true);
                        startCheckout(true).finally(() => setIsLoading(false));
                      } else {
                        navigate("/auth");
                      }
                    }}
                    disabled={isLoading}
                  >
                    {user ? "Subscribe Now" : "Sign Up & Subscribe"}
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <p className="text-muted-foreground">
                Questions about our pricing? <a href="#" className="text-primary underline">Contact us</a>
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-secondary py-20 px-6 md:px-10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Dividnd?</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-Time Tracking</h3>
                <p className="text-muted-foreground">
                  Monitor your portfolio with real-time stock prices and performance metrics.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Visual Analytics</h3>
                <p className="text-muted-foreground">
                  Beautiful charts and visualizations to understand your portfolio's performance.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Dividend Insights</h3>
                <p className="text-muted-foreground">
                  Get insights on your dividend income and suggestions to boost your passive income.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-20 px-6 md:px-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
            
            <div className="bg-card border rounded-lg p-8 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mr-4">
                  <span className="text-lg font-bold">JD</span>
                </div>
                <div>
                  <h4 className="font-semibold">Jane Doe</h4>
                  <p className="text-sm text-muted-foreground">Dividend Investor</p>
                </div>
              </div>
              <p className="text-lg italic">
                "Dividnd has transformed the way I manage my dividend portfolio. 
                Its clean interface and real-time updates make tracking my passive income effortless. 
                I've achieved my dividend income goals faster than I expected!"
              </p>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
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
      </main>

      <footer className="bg-background border-t py-8 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-xl font-bold text-primary">Dividnd</h2>
              <p className="text-sm text-muted-foreground">
                &copy; 2025 Dividnd. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-foreground">Terms</a>
              <a href="#" className="text-muted-foreground hover:text-foreground">Privacy</a>
              <a href="#" className="text-muted-foreground hover:text-foreground">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
