import { useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Progress } from "@/components/ui/progress";
import { Target, Home, Car, BookOpen, Umbrella, Landmark } from "lucide-react";
import { useLocation } from "wouter";

const GOAL_ICONS: Record<string, React.ReactNode> = {
  house: <Home className="h-6 w-6" />,
  car: <Car className="h-6 w-6" />,
  education: <BookOpen className="h-6 w-6" />,
  emergency_fund: <Umbrella className="h-6 w-6" />,
  retirement: <Landmark className="h-6 w-6" />,
};

const GOAL_COLORS: Record<string, string> = {
  house: "from-purple-500 to-pink-500",
  car: "from-blue-500 to-cyan-500",
  education: "from-green-500 to-emerald-500",
  emergency_fund: "from-orange-500 to-red-500",
  retirement: "from-indigo-500 to-blue-500",
};

export default function GoalPlanner() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const goalsQuery = trpc.goals.list.useQuery();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) return null;

  const isLoading = goalsQuery.isLoading;
  const goals = goalsQuery.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/20 bg-white/80 backdrop-blur-md dark:bg-slate-900/80">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Target className="h-6 w-6" />
            Goal Planner
          </h1>
          <Button variant="outline" onClick={() => setLocation("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 space-y-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner />
          </div>
        ) : (
          <>
            {/* Goals Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {goals.map((goal) => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100;
                const monthlyContribution = goal.monthlyContribution;
                const yearsRemaining = goal.timelineMonths / 12;

                return (
                  <Card
                    key={goal.id}
                    className={`card-base p-6 space-y-4 border-l-4 bg-gradient-to-br ${GOAL_COLORS[goal.goalType] || "from-blue-500 to-cyan-500"} bg-opacity-5`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${GOAL_COLORS[goal.goalType]} text-white`}>
                          {GOAL_ICONS[goal.goalType]}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg capitalize">{goal.goalType.replace("_", " ")}</h3>
                          <p className="text-xs text-muted-foreground">
                            {goal.timelineMonths} months • {yearsRemaining.toFixed(1)} years
                          </p>
                        </div>
                      </div>
                      <span className={`badge-base ${goal.priority === "high" ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" : goal.priority === "medium" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"}`}>
                        {goal.priority}
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">{progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    {/* Amounts */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-300 dark:border-slate-600">
                      <div>
                        <p className="text-xs text-muted-foreground">Current Amount</p>
                        <p className="font-bold">₹{goal.currentAmount.toLocaleString("en-IN")}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Target Amount</p>
                        <p className="font-bold">₹{goal.targetAmount.toLocaleString("en-IN")}</p>
                      </div>
                    </div>

                    {/* Monthly Contribution */}
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground">Monthly Contribution Needed</p>
                      <p className="text-2xl font-bold text-primary">₹{monthlyContribution.toLocaleString("en-IN")}</p>
                    </div>

                    {/* Remaining */}
                    <div className="text-sm text-muted-foreground">
                      <p>Remaining: ₹{(goal.targetAmount - goal.currentAmount).toLocaleString("en-IN")}</p>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Summary Section */}
            {goals.length > 0 && (
              <Card className="card-base p-6 space-y-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                <h2 className="text-2xl font-bold">Goals Summary</h2>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Total Target Amount</p>
                    <p className="text-3xl font-bold">
                      ₹{goals.reduce((sum, g) => sum + g.targetAmount, 0).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Total Saved So Far</p>
                    <p className="text-3xl font-bold">
                      ₹{goals.reduce((sum, g) => sum + g.currentAmount, 0).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Total Monthly Contribution</p>
                    <p className="text-3xl font-bold">
                      ₹{goals.reduce((sum, g) => sum + g.monthlyContribution, 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Overall Progress */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Overall Progress</p>
                  <Progress
                    value={
                      (goals.reduce((sum, g) => sum + g.currentAmount, 0) /
                        goals.reduce((sum, g) => sum + g.targetAmount, 0)) *
                      100
                    }
                    className="h-3"
                  />
                </div>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setLocation("/recommendations")}>
                View Recommendations
              </Button>
              <Button variant="outline" onClick={() => setLocation("/dashboard")}>
                Back to Dashboard
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
