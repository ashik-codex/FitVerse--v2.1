import { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Toast from "./components/Toast";
import Dashboard from "./pages/Dashboard";
import WorkoutPlanner from "./pages/WorkoutPlanner";
import LiveWorkout from "./pages/LiveWorkout";
import ExerciseLibrary from "./pages/ExerciseLibrary";
import Nutrition from "./pages/Nutrition";
import Progress from "./pages/Progress";
import Analytics from "./pages/Analytics";
import History from "./pages/History";
import Challenges from "./pages/Challenges";
import SmartCoach from "./pages/SmartCoach";
import Settings from "./pages/Settings";
import { useFitness } from "./context/FitnessContext";

const pageTitles = {
  dashboard: "Dashboard",
  planner: "Workout Planner",
  live: "Live Workout",
  exercises: "Exercise Library",
  nutrition: "Nutrition",
  progress: "Progress",
  analytics: "Analytics",
  history: "History",
  challenges: "Challenges",
  coach: "Smart Coach",
  settings: "Settings",
};

const validPages = new Set(Object.keys(pageTitles));
const LAST_PAGE_KEY = "fitverse_last_page";

const accentMap = {
  violet: ["#8b5cf6", "#c084fc"],
  cyan: ["#06b6d4", "#67e8f9"],
  green: ["#22c55e", "#86efac"],
  orange: ["#f97316", "#fdba74"],
  pink: ["#ec4899", "#f9a8d4"],
};

function pageFromHash() {
  const hashPage = window.location.hash.replace(/^#\/?/, "");
  if (validPages.has(hashPage)) return hashPage;
  const saved = localStorage.getItem(LAST_PAGE_KEY);
  return validPages.has(saved) ? saved : "dashboard";
}

export default function App() {
  const {
    profile,
    settings,
    setSettings,
    activeWorkout,
    toast,
    setToast,
    nutrition,
    history,
    plans,
    analytics,
  } = useFitness();

  const [page, setPage] = useState(pageFromHash);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useCallback((nextPage) => {
    const safePage = validPages.has(nextPage) ? nextPage : "dashboard";
    setPage(safePage);
    localStorage.setItem(LAST_PAGE_KEY, safePage);
    const nextHash = `#/${safePage}`;
    if (window.location.hash !== nextHash) window.history.pushState(null, "", nextHash);
  }, []);

  useEffect(() => {
    const handleHashChange = () => setPage(pageFromHash());
    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, []);

  const notifications = useMemo(() => [
    {
      id: 1,
      icon: "⚡",
      title: activeWorkout ? "Workout in progress" : "Workout ready",
      message: activeWorkout ? `Continue ${activeWorkout.name}.` : `${plans[0]?.name || "Your plan"} is ready to start.`,
      page: activeWorkout ? "live" : "planner",
    },
    {
      id: 2,
      icon: "🥚",
      title: "Protein reminder",
      message: `${Math.max(0, nutrition.proteinTarget - analytics.consumed.protein)}g remaining today.`,
      page: "nutrition",
    },
    {
      id: 3,
      icon: "↗",
      title: "Analytics updated",
      message: `${history.length} sessions and ${Math.round(analytics.totalVolume / 100) / 10}k kg volume are now tracked.`,
      page: "analytics",
    },
  ], [activeWorkout, plans, nutrition.proteinTarget, analytics, history.length]);

  const pages = {
    dashboard: <Dashboard navigate={navigate} />,
    planner: <WorkoutPlanner navigate={navigate} />,
    live: <LiveWorkout />,
    exercises: <ExerciseLibrary />,
    nutrition: <Nutrition />,
    progress: <Progress />,
    analytics: <Analytics />,
    history: <History />,
    challenges: <Challenges />,
    coach: <SmartCoach navigate={navigate} />,
    settings: <Settings />,
  };

  const [accent, accentSoft] = accentMap[settings.accent] || accentMap.violet;

  useEffect(() => {
    document.title = `${pageTitles[page]} · FitVerse`;
    localStorage.setItem(LAST_PAGE_KEY, page);
    if (!window.location.hash) window.history.replaceState(null, "", `#/${page}`);
    setSidebarOpen(false);
    document.querySelector(".content-area")?.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <div
      className={`app-shell theme-${settings.theme}`}
      style={{ "--accent": accent, "--accent-soft": accentSoft }}
    >
      <Sidebar
        page={page}
        setPage={navigate}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeWorkout={activeWorkout}
      />

      <div className="app-main">
        <Topbar
          title={pageTitles[page]}
          profile={profile}
          onMenu={() => setSidebarOpen(true)}
          onNavigate={navigate}
          settings={settings}
          setSettings={setSettings}
          notifications={notifications}
          accent={accent}
          accentSoft={accentSoft}
        />

        <main className="content-area">
          <div className="page-transition" key={page}>
            {pages[page]}
          </div>
        </main>
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
