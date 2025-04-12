
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { usePortfolio } from "@/hooks/use-portfolio";
import { Target } from "lucide-react";
import { toast } from "sonner";

export const DividendGoalTracker = () => {
  const { dividendGoal, setDividendGoal } = usePortfolio();
  const [editMode, setEditMode] = useState(false);
  const [goalInput, setGoalInput] = useState(dividendGoal.toString());
  
  const handleSaveGoal = () => {
    const newGoal = parseFloat(goalInput);
    if (isNaN(newGoal) || newGoal <= 0) {
      toast.error("Please enter a valid positive number");
      return;
    }
    
    setDividendGoal(newGoal);
    setEditMode(false);
    toast.success("Dividend goal updated successfully");
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <Target className="h-5 w-5 mr-2" />
          Dividend Goal
        </CardTitle>
      </CardHeader>
      <CardContent>
        {editMode ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="dividend-goal" className="text-sm font-medium mb-1 block">
                Set Your Annual Dividend Goal
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input 
                    id="dividend-goal"
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    className="pl-7"
                    placeholder="Enter amount"
                    type="number"
                    min="0"
                  />
                </div>
                <Button onClick={handleSaveGoal}>Save</Button>
                <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Set a realistic annual dividend goal to track your income progress.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Annual Goal</p>
              <p className="text-3xl font-bold">${dividendGoal.toLocaleString()}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              This is your target annual dividend income from your portfolio.
            </p>
            <Button variant="outline" onClick={() => setEditMode(true)}>
              Edit Goal
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
