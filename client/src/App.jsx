import { useState, useEffect } from "react";
import Layout from "./components/Layout";
import ReportPage from "./pages/ReportPage";
import PublicFeedPage from "./pages/PublicFeedPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import LoginPage from "./pages/LoginPage";

export default function App() {
  const [view, setView] = useState("report");
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
    setView("report");
  }

  return (
    <Layout
      onAdminClick={() => setView(isAdmin ? "admin" : "login")}
      isLoggedIn={isAdmin}
      onLogout={handleLogout}
    >
      <nav className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setView("report")}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            view === "report"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          Submit Report
        </button>
        <button
          onClick={() => setView("feed")}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            view === "feed"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          Public Issues
        </button>
        {isAdmin && (
          <button
            onClick={() => setView("admin")}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              view === "admin"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            Admin Dashboard
          </button>
        )}
      </nav>

      <div className="w-full max-w-4xl mx-auto">
        {view === "report" && <ReportPage />}
        {view === "feed" && <PublicFeedPage />}
        {view === "login" && <LoginPage onLoginSuccess={handleLoginSuccess} />}
        {view === "admin" && (
          isAdmin ? <AdminDashboardPage /> : <LoginPage onLoginSuccess={handleLoginSuccess} />
        )}
      </div>
    </Layout>
  );
}
