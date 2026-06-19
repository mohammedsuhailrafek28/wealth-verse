import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Target, AlertCircle, Zap, Award } from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);

  const profilesQuery = trpc.profiles.list.useQuery();
  const activeProfileQuery = trpc.profiles.getActive.useQuery();
  const dashboardQuery = trpc.dashboard.getSummary.useQuery(undefined, {
    enabled: !!selectedProfileId || !!activeProfileQuery.data,
  });

  const setProfileMutation = trpc.profiles.setActive.useMutation({
    onSuccess: () => {
      dashboardQuery.refetch();
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  useEffect(() => {
    if (activeProfileQuery.data && !selectedProfileId) {
      setSelectedProfileId(activeProfileQuery.data.id);
    }
  }, [activeProfileQuery.data, selectedProfileId]);

  if (!isAuthenticated) return null;

  const handleProfileChange = (profileId: string) => {
    const id = parseInt(profileId);
    setSelectedProfileId(id);
    setProfileMutation.mutate({ demoProfileId: id });
  };

  const data = dashboardQuery.data;
  const isLoading = dashboardQuery.isLoading;
  const apiError = profilesQuery.error || activeProfileQuery.error || dashboardQuery.error;

  // Score color mapping
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-blue-600 dark:text-blue-400";
    if (score >= 40) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100 dark:bg-green-900";
    if (score >= 60) return "bg-blue-100 dark:bg-blue-900";
    if (score >= 40) return "bg-yellow-100 dark:bg-yellow-900";
    return "bg-red-100 dark:bg-red-900";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/20 bg-white/80 backdrop-blur-md dark:bg-slate-900/80">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">WealthVerse</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-48">
              <Select value={selectedProfileId?.toString() || ""} onValueChange={handleProfileChange}>
                <SelectTrigger className="bg-white dark:bg-slate-800">
                  <SelectValue placeholder="Select Profile" />
                </SelectTrigger>
                <SelectContent>
                  {profilesQuery.data?.map((profile) => (
                    <SelectItem key={profile.id} value={profile.id.toString()}>
                      {profile.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" size="sm">
              {user?.name || "User"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 space-y-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner />
          </div>
        ) : apiError ? (
          <Card className="card-base p-8 space-y-3">
            <h2 className="text-2xl font-bold">Unable to load dashboard</h2>
            <p className="text-muted-foreground">
              {apiError.message || "Check your DATABASE_URL or enable WEALTHVERSE_DEMO_MODE=true for local demo data."}
            </p>
          </Card>
        ) : profilesQuery.data && profilesQuery.data.length === 0 ? (
          <Card className="card-base p-8 space-y-3">
            <h2 className="text-2xl font-bold">No demo profiles found</h2>
            <p className="text-muted-foreground">
              Seed demo data into the database, or run with WEALTHVERSE_DEMO_MODE=true to use built-in local demo data.
            </p>
          </Card>
        ) : data ? (
          <>
            {/* Welcome Section */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Welcome back, {data.profile.name}!</h2>
              <p className="text-muted-foreground">
                {data.profile.age} years old • {data.profile.occupation} • {data.profile.riskProfile} risk profile
              </p>
            </div>

            {/* Financial Health Score */}
            <div className="grid gap-6 lg:grid-cols-4">
              <Card className="card-base p-6 space-y-4 lg:col-span-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-muted-foreground">Financial Health</h3>
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className={`flex items-center gap-4 ${getScoreBgColor(data.financialHealth.overallScore)} rounded-lg p-4`}>
                  <div className={`text-5xl font-bold ${getScoreColor(data.financialHealth.overallScore)}`}>
                    {data.financialHealth.overallScore}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium capitalize">{data.financialHealth.category}</p>
                    <p className="text-xs text-muted-foreground">Out of 100</p>
                  </div>
                </div>
              </Card>

              {/* Key Metrics */}
              <Card className="card-base p-6 space-y-4">
                <h3 className="font-semibold text-muted-foreground">Monthly Income</h3>
                <p className="text-3xl font-bold">₹{data.monthlyIncome.toLocaleString("en-IN")}</p>
              </Card>

              <Card className="card-base p-6 space-y-4">
                <h3 className="font-semibold text-muted-foreground">Monthly Expenses</h3>
                <p className="text-3xl font-bold">₹{data.monthlyExpenses.toLocaleString("en-IN")}</p>
              </Card>

              <Card className="card-base p-6 space-y-4">
                <h3 className="font-semibold text-muted-foreground">Savings Rate</h3>
                <p className="text-3xl font-bold">{data.savingsRate.toFixed(1)}%</p>
              </Card>
            </div>

            {/* Score Breakdown */}
            <div className="grid gap-6 lg:grid-cols-5">
              {[
                { label: "Savings", score: data.financialHealth.savingsScore },
                { label: "Investment", score: data.financialHealth.investmentScore },
                { label: "Debt", score: data.financialHealth.debtScore },
                { label: "Emergency Fund", score: data.financialHealth.emergencyFundScore },
              ].map((item) => (
                <Card key={item.label} className="card-base p-4 space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold">{item.score}</div>
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                      {Math.round((item.score / 25) * 100)}%
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Top Recommendations */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Top Recommendations</h3>
              <div className="grid gap-4">
                {data.topRecommendations.map((rec, i) => (
                  <Card key={i} className="card-base p-6 space-y-4 border-l-4 border-l-blue-600">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <h4 className="font-semibold text-lg">{rec.recommendation}</h4>
                        <p className="text-muted-foreground">{rec.expectedBenefit}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`badge-base ${rec.riskLevel === "low" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : rec.riskLevel === "moderate" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"}`}>
                          {rec.riskLevel}
                        </span>
                        <span className="badge-base bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                          {rec.confidenceScore}%
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Why this was suggested:</p>
                      <ul className="space-y-1">
                        {rec.reasons.map((reason, j) => (
                          <li key={j} className="text-sm text-muted-foreground flex gap-2">
                            <span className="text-blue-600">•</span>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-4">
              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => setLocation("/spending")}>
                View Spending
              </Button>
              <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => setLocation("/goals")}>
                Plan Goals
              </Button>
              <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => setLocation("/recommendations")}>
                All Recommendations
              </Button>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={() => setLocation("/avatar")}>
                Avatar Advisor
              </Button>
            </div>

            {/* Gamification */}
            {(data.savingsStreak > 0 || data.badges.length > 0) && (
              <Card className="card-base p-6 space-y-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
                <h3 className="font-semibold flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-600" />
                  Achievements
                </h3>
                <div className="space-y-4">
                  {data.savingsStreak > 0 && (
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg">
                      <div>
                        <p className="font-medium">Savings Streak</p>
                        <p className="text-sm text-muted-foreground">{data.savingsStreak} months</p>
                      </div>
                      <div className="text-2xl">🔥</div>
                    </div>
                  )}
                  {data.badges.map((badge, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg">
                      <div>
                        <p className="font-medium">{badge.title}</p>
                        <p className="text-sm text-muted-foreground">{badge.description}</p>
                      </div>
                      <div className="text-2xl">⭐</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        ) : (
          <Card className="card-base p-8 space-y-3">
            <h2 className="text-2xl font-bold">No dashboard data available</h2>
            <p className="text-muted-foreground">
              Select a demo profile or verify that demo data is available.
            </p>
          </Card>
        )}
      </main>
    </div>
  );
}
