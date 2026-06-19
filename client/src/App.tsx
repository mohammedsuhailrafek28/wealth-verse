import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { useEffect, useState } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import SpendingInsights from "./pages/SpendingInsights";
import GoalPlanner from "./pages/GoalPlanner";
import Recommendations from "./pages/Recommendations";
import AvatarAdvisor from "./pages/AvatarAdvisor";
import { useAuth } from "./_core/hooks/useAuth";

let historyEventsPatched = false;

function useCurrentPath() {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const updatePath = () => setPath(window.location.pathname);

    if (!historyEventsPatched) {
      historyEventsPatched = true;
      const pushState = window.history.pushState;
      const replaceState = window.history.replaceState;

      window.history.pushState = function (...args) {
        const result = pushState.apply(this, args);
        window.dispatchEvent(new Event("wealthverse:navigation"));
        return result;
      };

      window.history.replaceState = function (...args) {
        const result = replaceState.apply(this, args);
        window.dispatchEvent(new Event("wealthverse:navigation"));
        return result;
      };
    }

    window.addEventListener("popstate", updatePath);
    window.addEventListener("wealthverse:navigation", updatePath);

    return () => {
      window.removeEventListener("popstate", updatePath);
      window.removeEventListener("wealthverse:navigation", updatePath);
    };
  }, []);

  return path;
}

function Router() {
  const { isAuthenticated } = useAuth();
  const location = useCurrentPath();

  if (location === "/") return isAuthenticated ? <Dashboard /> : <Home />;
  if (location === "/dashboard") return <Dashboard />;
  if (location === "/spending") return <SpendingInsights />;
  if (location === "/goals") return <GoalPlanner />;
  if (location === "/recommendations") return <Recommendations />;
  if (location === "/avatar") return <AvatarAdvisor />;
  return <NotFound />;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
