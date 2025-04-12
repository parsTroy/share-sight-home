
import { LandingHeader } from "@/components/LandingHeader";
import { Card, CardContent } from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Mock data for demo
const portfolioData = [
  { name: 'Jan', value: 5000 },
  { name: 'Feb', value: 5200 },
  { name: 'Mar', value: 5100 },
  { name: 'Apr', value: 5400 },
  { name: 'May', value: 5600 },
  { name: 'Jun', value: 5800 },
  { name: 'Jul', value: 6100 },
  { name: 'Aug', value: 6400 },
  { name: 'Sep', value: 6300 },
  { name: 'Oct', value: 6700 },
  { name: 'Nov', value: 6900 },
  { name: 'Dec', value: 7200 },
];

const dividendData = [
  { name: 'Jan', value: 120 },
  { name: 'Feb', value: 0 },
  { name: 'Mar', value: 150 },
  { name: 'Apr', value: 0 },
  { name: 'May', value: 180 },
  { name: 'Jun', value: 0 },
  { name: 'Jul', value: 200 },
  { name: 'Aug', value: 0 },
  { name: 'Sep', value: 220 },
  { name: 'Oct', value: 0 },
  { name: 'Nov', value: 250 },
  { name: 'Dec', value: 0 },
];

const sectorData = [
  { name: 'Technology', value: 35 },
  { name: 'Healthcare', value: 20 },
  { name: 'Financials', value: 15 },
  { name: 'Consumer Staples', value: 10 },
  { name: 'Energy', value: 8 },
  { name: 'Utilities', value: 7 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28'];

const stockData = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 175.42, change: 1.23, yield: 0.65, shares: 10, value: 1754.20 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 335.18, change: -0.87, yield: 0.82, shares: 5, value: 1675.90 },
  { symbol: 'GOOG', name: 'Alphabet Inc.', price: 138.21, change: 0.54, yield: 0.0, shares: 8, value: 1105.68 },
  { symbol: 'JNJ', name: 'Johnson & Johnson', price: 158.76, change: -0.32, yield: 2.95, shares: 7, value: 1111.32 },
  { symbol: 'PG', name: 'Procter & Gamble', price: 142.38, change: 0.21, yield: 2.54, shares: 12, value: 1708.56 },
  { symbol: 'KO', name: 'Coca-Cola Co.', price: 59.87, change: 0.08, yield: 3.08, shares: 20, value: 1197.40 },
];

const Demo = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LandingHeader />
      
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
      
      <main className="flex-grow p-6 md:p-10 max-w-7xl mx-auto w-full">
        {/* Portfolio Overview */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                  <h3 className="text-2xl font-bold">$8,553.06</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-500">+8.2%</span>
                <span className="text-sm text-muted-foreground ml-2">from last month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Annual Dividend</p>
                  <h3 className="text-2xl font-bold">$1,120</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-500">+12.5%</span>
                <span className="text-sm text-muted-foreground ml-2">from last year</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Yield</p>
                  <h3 className="text-2xl font-bold">2.47%</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-500">+0.1%</span>
                <span className="text-sm text-muted-foreground ml-2">from last month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Income</p>
                  <h3 className="text-2xl font-bold">$93.33</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-500">+5.3%</span>
                <span className="text-sm text-muted-foreground ml-2">from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <h3 className="font-semibold flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Portfolio Growth
                  </h3>
                  <p className="text-sm text-muted-foreground">12-month portfolio value</p>
                </div>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={portfolioData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <h3 className="font-semibold flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Monthly Dividends
                  </h3>
                  <p className="text-sm text-muted-foreground">12-month dividend income</p>
                </div>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dividendData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Stock Table & Sector Allocation */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Stock Holdings</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left font-medium p-2 pl-0">Symbol</th>
                        <th className="text-left font-medium p-2">Company</th>
                        <th className="text-right font-medium p-2">Price</th>
                        <th className="text-right font-medium p-2">Change</th>
                        <th className="text-right font-medium p-2">Yield</th>
                        <th className="text-right font-medium p-2">Shares</th>
                        <th className="text-right font-medium p-2 pr-0">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockData.map((stock) => (
                        <tr key={stock.symbol} className="border-b">
                          <td className="p-2 pl-0 font-medium">{stock.symbol}</td>
                          <td className="p-2">{stock.name}</td>
                          <td className="p-2 text-right">${stock.price.toFixed(2)}</td>
                          <td className={`p-2 text-right ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                          </td>
                          <td className="p-2 text-right">{stock.yield.toFixed(2)}%</td>
                          <td className="p-2 text-right">{stock.shares}</td>
                          <td className="p-2 pr-0 text-right">${stock.value.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-1">
                    <h3 className="font-semibold flex items-center gap-2">
                      <PieChartIcon className="h-5 w-5" />
                      Sector Allocation
                    </h3>
                    <p className="text-sm text-muted-foreground">Portfolio diversification</p>
                  </div>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sectorData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {sectorData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* CTA Banner */}
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

export default Demo;
