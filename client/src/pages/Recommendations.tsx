import { useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Lightbulb, TrendingUp, PieChart, AlertCircle, Zap } from "lucide-react";
import { useLocation } from "wouter";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  savings: <Zap className="h-5 w-5" />,
  investment: <TrendingUp className="h-5 w-5" />,
  debt_management: <AlertCircle className="h-5 w-5" />,
  emergency_fund: <AlertCircle className="h-5 w-5" />,
  spending: <PieChart className="h-5 w-5" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  savings: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  investment: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  debt_management: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  emergency_fund: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  spending: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
};

export default function Recommendations() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const recsQuery = trpc.recommendations.list.useQuery();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) return null;

  const isLoading = recsQuery.isLoading;
  const recommendations = recsQuery.data || [];

  // Group by category
  const groupedByCategory = recommendations.reduce(
    (acc, rec) => {
      if (!acc[rec.category]) acc[rec.category] = [];
      acc[rec.category].push(rec);
      return acc;
    },
    {} as Record<string, typeof recommendations>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/20 bg-white/80 backdrop-blur-md dark:bg-slate-900/80">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Lightbulb className="h-6 w-6" />
            Personalized Recommendations
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
        ) : recommendations.length === 0 ? (
          <Card className="card-base p-12 text-center space-y-4">
            <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-lg font-medium">No recommendations available</p>
            <p className="text-muted-foreground">
              Check back later for personalized financial recommendations
            </p>
          </Card>
        ) : (
          <>
            {/* Overview Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="card-base p-4 space-y-2">
                <p className="text-sm text-muted-foreground">Total Recommendations</p>
                <p className="text-3xl font-bold">{recommendations.length}</p>
              </Card>

              <Card className="card-base p-4 space-y-2">
                <p className="text-sm text-muted-foreground">Average Confidence</p>
                <p className="text-3xl font-bold">
                  {Math.round(
                    recommendations.reduce((sum, r) => sum + r.confidenceScore, 0) /
                      recommendations.length
                  )}
                  %
                </p>
              </Card>

              <Card className="card-base p-4 space-y-2">
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-3xl font-bold">
                  {recommendations.filter((r) => r.riskLevel === "high").length}
                </p>
              </Card>
            </div>

            {/* Recommendations by Category */}
            {Object.entries(groupedByCategory).map(([category, recs]) => (
              <div key={category} className="space-y-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  {CATEGORY_ICONS[category]}
                  {category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, " ")}
                </h2>

                <div className="grid gap-4">
                  {recs.map((rec, i) => (
                    <Card
                      key={i}
                      className="card-base p-6 space-y-4 border-l-4 border-l-blue-600 hover:shadow-lg transition-shadow"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <h3 className="text-lg font-bold">{rec.recommendation}</h3>
                          <p className="text-muted-foreground">{rec.expectedBenefit}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <span
                            className={`badge-base ${
                              rec.riskLevel === "low"
                                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                : rec.riskLevel === "moderate"
                                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                                  : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {rec.riskLevel} risk
                          </span>
                          <span className="badge-base bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                            {rec.confidenceScore}% confidence
                          </span>
                        </div>
                      </div>

                      {/* Category Badge */}
                      <div className="flex gap-2">
                        <span className={`badge-base ${CATEGORY_COLORS[rec.category]}`}>
                          {rec.category.replace(/_/g, " ")}
                        </span>
                      </div>

                      {/* Why This Was Suggested */}
                      <div className="space-y-3 pt-2 border-t border-slate-300 dark:border-slate-600">
                        <p className="font-semibold text-sm">Why this was suggested</p>
                        <ul className="space-y-2">
                          {rec.reasons.map((reason, j) => (
                            <li key={j} className="flex gap-3 text-sm">
                              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-bold text-blue-700 dark:text-blue-300">
                                ✓
                              </span>
                              <span className="text-muted-foreground">{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action Button */}
                      <div className="pt-2 border-t border-slate-300 dark:border-slate-600">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Learn More
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => setLocation("/avatar")}>
                Talk to Avatar Advisor
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
