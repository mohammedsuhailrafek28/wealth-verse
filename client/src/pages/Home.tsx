import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { TrendingUp, Target, AlertCircle, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="border-b border-white/20 bg-white/80 backdrop-blur-md dark:bg-slate-900/80">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">WealthVerse</h1>
          </div>
          <a href={getLoginUrl()}>
            <Button className="bg-blue-600 hover:bg-blue-700">Sign In</Button>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left: Content */}
          <div className="space-y-8 animate-slide-in-up">
            <div className="space-y-4">
              <h2 className="text-5xl font-bold tracking-tight text-foreground">
                Your AI-Powered Financial Advisor
              </h2>
              <p className="text-xl text-muted-foreground">
                Get personalized wealth guidance, track your financial health, and achieve your goals with intelligent insights tailored to your unique situation.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <a href={getLoginUrl()}>
                <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-lg">
                  Get Started
                </Button>
              </a>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg">
                Learn More
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">✓</span>
                </div>
                <span className="text-sm font-medium">Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">✓</span>
                </div>
                <span className="text-sm font-medium">AI-Powered</span>
              </div>
            </div>
          </div>

          {/* Right: Features Preview */}
          <div className="grid gap-4 sm:grid-cols-2 animate-slide-in-down">
            {/* Feature Card 1 */}
            <div className="card-base p-6 space-y-3 hover:shadow-lg transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold">Financial Health Score</h3>
              <p className="text-sm text-muted-foreground">
                Real-time assessment of your overall financial wellness
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="card-base p-6 space-y-3 hover:shadow-lg transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold">Goal Planning</h3>
              <p className="text-sm text-muted-foreground">
                Set and track financial goals with personalized timelines
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="card-base p-6 space-y-3 hover:shadow-lg transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900">
                <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="font-semibold">Smart Alerts</h3>
              <p className="text-sm text-muted-foreground">
                Stay informed with timely notifications about your finances
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="card-base p-6 space-y-3 hover:shadow-lg transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                <Sparkles className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold">AI Recommendations</h3>
              <p className="text-sm text-muted-foreground">
                Personalized suggestions to optimize your financial strategy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-white/20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm py-20">
        <div className="container space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to take control of your financial future
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Spending Insights",
                description: "Analyze your spending patterns and identify savings opportunities",
              },
              {
                title: "Investment Tracking",
                description: "Monitor your investments and get recommendations aligned with your risk profile",
              },
              {
                title: "Avatar Advisor",
                description: "Interact with your personal AI advisor for personalized financial guidance",
              },
              {
                title: "Goal Tracking",
                description: "Set multiple financial goals and track progress towards each one",
              },
              {
                title: "Gamification",
                description: "Earn badges and maintain savings streaks to stay motivated",
              },
              {
                title: "Explainable AI",
                description: "Understand exactly why each recommendation is made for you",
              },
            ].map((feature, i) => (
              <div key={i} className="card-base p-6 space-y-3">
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20 text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold">Ready to Transform Your Finances?</h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of users who are taking control of their financial future
          </p>
        </div>
        <a href={getLoginUrl()}>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8">
            Start Your Journey Today
          </Button>
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/20 bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm py-8">
        <div className="container flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2026 WealthVerse. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
