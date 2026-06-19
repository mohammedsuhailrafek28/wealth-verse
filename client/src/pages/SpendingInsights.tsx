import { useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { TrendingDown, AlertTriangle } from "lucide-react";
import { useLocation } from "wouter";

const COLORS = ["#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#06B6D4", "#6366F1"];

export default function SpendingInsights() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const breakdownQuery = trpc.spending.getBreakdown.useQuery();
  const unusualQuery = trpc.spending.getUnusual.useQuery();
  const opportunitiesQuery = trpc.spending.getOpportunities.useQuery();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) return null;

  const isLoading = breakdownQuery.isLoading || unusualQuery.isLoading || opportunitiesQuery.isLoading;

  // Transform breakdown data for pie chart
  const breakdownData = Object.entries(breakdownQuery.data || {}).map(([category, amount]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: amount as number,
  }));

  const totalSpending = breakdownData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/20 bg-white/80 backdrop-blur-md dark:bg-slate-900/80">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold">Spending Insights</h1>
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
            {/* Spending Breakdown */}
            <Card className="card-base p-6 space-y-6">
              <h2 className="text-2xl font-bold">Category-wise Spending</h2>
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Pie Chart */}
                <div className="flex items-center justify-center">
                  {breakdownData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={breakdownData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ₹${(value as number).toLocaleString("en-IN")}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {breakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-muted-foreground">No spending data available</p>
                  )}
                </div>

                {/* Category List */}
                <div className="space-y-3">
                  {breakdownData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-4 w-4 rounded-full"
                          style={{ backgroundColor: COLORS[i % COLORS.length] }}
                        />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{(item.value as number).toLocaleString("en-IN")}</p>
                        <p className="text-xs text-muted-foreground">
                          {(((item.value as number) / totalSpending) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Unusual Expenses */}
            {unusualQuery.data && unusualQuery.data.length > 0 && (
              <Card className="card-base p-6 space-y-4 border-l-4 border-l-orange-500">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-orange-500" />
                  Unusual Expenses Detected
                </h2>
                <p className="text-muted-foreground">
                  These expenses are significantly higher than your typical spending in these categories.
                </p>
                <div className="space-y-3">
                  {unusualQuery.data.map((expense, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                      <div>
                        <p className="font-medium capitalize">{expense.category}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-orange-600">₹{(expense.amount as number).toLocaleString("en-IN")}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Savings Opportunities */}
            {opportunitiesQuery.data && opportunitiesQuery.data.length > 0 && (
              <Card className="card-base p-6 space-y-4 border-l-4 border-l-green-500">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <TrendingDown className="h-6 w-6 text-green-500" />
                  Savings Opportunities
                </h2>
                <p className="text-muted-foreground">
                  Here are areas where you can reduce spending and save more money.
                </p>
                <div className="space-y-3">
                  {opportunitiesQuery.data.map((opp, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div>
                        <p className="font-medium">{opp.suggestion}</p>
                        <p className="text-sm text-muted-foreground capitalize">{opp.category}</p>
                      </div>
                      <p className="text-lg font-bold text-green-600">+₹{opp.amount.toLocaleString("en-IN")}</p>
                    </div>
                  ))}
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
