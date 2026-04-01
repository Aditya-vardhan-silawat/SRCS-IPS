import { useState, useEffect } from "react";
import Layout from "./components/Layout";
import ReportPage from "./pages/ReportPage";
import PublicFeedPage from "./pages/PublicFeedPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import TrackStatusPage from "./pages/TrackStatusPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";

export default function App() {
  const [view, setView] = useState("home");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      setIsAdmin(true);
    }
  }, []);

  function handleLoginSuccess() {
    setIsAdmin(true);
    setView("admin");
  }

  function handleLogout() {
    localStorage.removeItem("admin_token");
    setIsAdmin(false);
    setView("home");
  }

  return (
    <Layout
      onAdminClick={() => setView(isAdmin ? "admin" : "login")}
      isLoggedIn={isAdmin}
      onLogout={handleLogout}
    >
      <nav className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-10 p-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <button
          onClick={() => setView("home")}
          className={`px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 ${
            view === "home"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
              : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          Home
        </button>
        <button
          onClick={() => setView("report")}
          className={`px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 ${
            view === "report"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
              : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          Submit Report
        </button>
        <button
          onClick={() => setView("feed")}
          className={`px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 ${
            view === "feed"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
              : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          Public Feed
        </button>
        <button
          onClick={() => setView("track")}
          className={`px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 ${
            view === "track"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
              : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          Track Status
        </button>
        {isAdmin && (
          <button
            onClick={() => setView("admin")}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 ${
              view === "admin"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            Dashboard
          </button>
        )}
      </nav>

      <div className="w-full">
        {view === "home" && (
          <LandingPage 
            onStartReporting={() => setView("report")}
            onTrackStatus={() => setView("track")}
            onViewFeed={() => setView("feed")}
          />
        )}
        {view === "report" && <ReportPage />}
        {view === "feed" && <PublicFeedPage />}
        {view === "track" && <TrackStatusPage />}
        {view === "login" && <LoginPage onLoginSuccess={handleLoginSuccess} />}
        {view === "admin" && (
          isAdmin ? <AdminDashboardPage /> : <LoginPage onLoginSuccess={handleLoginSuccess} />
        )}
      </div>
    </Layout>
  );
}
