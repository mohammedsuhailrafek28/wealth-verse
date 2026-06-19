import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { MessageCircle, Volume2, Sparkles } from "lucide-react";
import { useLocation } from "wouter";

export default function AvatarAdvisor() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedRecIndex, setSelectedRecIndex] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const dashboardQuery = trpc.dashboard.getSummary.useQuery();
  const recsQuery = trpc.recommendations.list.useQuery();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) return null;

  const isLoading = dashboardQuery.isLoading || recsQuery.isLoading;
  const data = dashboardQuery.data;
  const recommendations = recsQuery.data || [];

  // Generate voice-style text for avatar
  const generateAvatarGreeting = () => {
    if (!data) return "";
    return `Hi ${data.profile.name}! Welcome back. I'm your financial advisor. Your financial health score is ${data.financialHealth.overallScore} out of 100, which is ${data.financialHealth.category}. I have some personalized recommendations to help you improve your financial wellness. Would you like to hear them?`;
  };

  const generateRecommendationVoiceText = (rec: (typeof recommendations)[0]) => {
    return `Here's my recommendation: ${rec.recommendation}. This could give you a benefit of ${rec.expectedBenefit}. The risk level is ${rec.riskLevel}. I'm ${rec.confidenceScore}% confident about this. Why am I suggesting this? ${rec.reasons.join(". ")}`;
  };

  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/20 bg-white/80 backdrop-blur-md dark:bg-slate-900/80">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6" />
            Avatar Advisor
          </h1>
          <Button variant="outline" onClick={() => setLocation("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner />
          </div>
        ) : data ? (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Avatar Section */}
            <div className="lg:col-span-1">
              <Card className="card-base p-8 space-y-6 sticky top-24">
                {/* Avatar Animation */}
                <div className="flex justify-center">
                  <div className={`relative w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-5xl shadow-lg transition-transform duration-300 ${isSpeaking ? "scale-110" : "scale-100"}`}>
                    <span className={`transition-all duration-300 ${isSpeaking ? "animate-pulse" : ""}`}>
                      💼
                    </span>
                  </div>
                </div>

                {/* Avatar Name */}
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold">WealthBot</h2>
                  <p className="text-sm text-muted-foreground">Your AI Financial Advisor</p>
                </div>

                {/* Status */}
                <div className="flex items-center justify-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span>Ready to help</span>
                </div>

                {/* Greeting Button */}
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleSpeak(generateAvatarGreeting())}
                  disabled={isSpeaking}
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  {isSpeaking ? "Speaking..." : "Hear Greeting"}
                </Button>
              </Card>
            </div>

            {/* Chat/Recommendations Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Greeting Message */}
              <Card className="card-base p-6 space-y-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="font-semibold text-sm text-blue-900 dark:text-blue-100">WealthBot</p>
                    <p className="text-sm text-muted-foreground">{generateAvatarGreeting()}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSpeak(generateAvatarGreeting())}
                      disabled={isSpeaking}
                    >
                      <Volume2 className="h-4 w-4 mr-2" />
                      {isSpeaking ? "Playing..." : "Play"}
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Recommendations */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold">My Recommendations for You</h3>

                {recommendations.length === 0 ? (
                  <Card className="card-base p-6 text-center text-muted-foreground">
                    No recommendations available at this time
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {recommendations.map((rec, i) => (
                      <Card
                        key={i}
                        className={`card-base p-4 space-y-3 cursor-pointer transition-all ${
                          selectedRecIndex === i
                            ? "ring-2 ring-blue-600 bg-blue-50 dark:bg-blue-900/20"
                            : "hover:shadow-md"
                        }`}
                        onClick={() => setSelectedRecIndex(selectedRecIndex === i ? null : i)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold">{rec.recommendation}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{rec.expectedBenefit}</p>
                          </div>
                          <span className={`badge-base flex-shrink-0 ${rec.riskLevel === "low" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : rec.riskLevel === "moderate" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"}`}>
                            {rec.confidenceScore}%
                          </span>
                        </div>

                        {selectedRecIndex === i && (
                          <div className="space-y-3 pt-3 border-t border-slate-300 dark:border-slate-600">
                            <div>
                              <p className="text-sm font-medium mb-2">Why this was suggested:</p>
                              <ul className="space-y-1">
                                {rec.reasons.map((reason, j) => (
                                  <li key={j} className="text-sm text-muted-foreground flex gap-2">
                                    <span>•</span>
                                    {reason}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <Button
                              size="sm"
                              className="w-full bg-blue-600 hover:bg-blue-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSpeak(generateRecommendationVoiceText(rec));
                              }}
                              disabled={isSpeaking}
                            >
                              <Volume2 className="h-4 w-4 mr-2" />
                              {isSpeaking ? "Speaking..." : "Hear Recommendation"}
                            </Button>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Questions */}
              <Card className="card-base p-6 space-y-4">
                <h3 className="font-semibold">Quick Questions</h3>
                <div className="grid gap-2">
                  {[
                    "What's my financial health score?",
                    "How can I improve my savings?",
                    "What are my financial goals?",
                    "How do I reduce debt?",
                  ].map((question, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      className="justify-start text-left"
                      onClick={() => handleSpeak(question)}
                      disabled={isSpeaking}
                    >
                      <MessageCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                      {question}
                    </Button>
                  ))}
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => setLocation("/recommendations")}>
                  View All Recommendations
                </Button>
                <Button variant="outline" onClick={() => setLocation("/dashboard")}>
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
