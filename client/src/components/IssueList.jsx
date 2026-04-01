import { useEffect, useState } from "react";
import { fetchReports, upvoteReport } from "../api/reportsApi";
import ReportCard from "./ReportCard";

export default function IssueList() {
  const [sort, setSort] = useState("date");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRetrying, setIsRetrying] = useState(false);

  async function load() {
    setError("");
    setLoading(true);
    setIsRetrying(false);
    try {
      const data = await fetchReports(sort);
      setReports(data);
    } catch (err) {
      if (!err.status) {
        setIsRetrying(true);
        setError("Network issue detected. Retrying...");
      } else {
        setError(err.message || "Failed to load reports");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [sort]);

  function getUpvotedIds() {
    try {
      const raw = localStorage.getItem("scrs_upvoted");
      if (!raw) return new Set();
      return new Set(JSON.parse(raw));
    } catch {
      return new Set();
    }
  }

  function setUpvotedIds(set) {
    localStorage.setItem("scrs_upvoted", JSON.stringify(Array.from(set)));
  }

  async function handleUpvote(id) {
    const upvoted = getUpvotedIds();
    if (upvoted.has(id)) return;

    try {
      const result = await upvoteReport(id);
      upvoted.add(id);
      setUpvotedIds(upvoted);

      setReports((prev) =>
        prev.map((r) => (r._id === id ? { ...r, upvotes: result.upvotes } : r))
      );
    } catch (err) {
      alert(err.message);
    }
  }

  const upvoted = getUpvotedIds();

  const LoadingSkeleton = () => (
    <div className="space-y-6 animate-pulse">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-3xl p-8 h-64 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex justify-between mb-6">
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
          <div className="flex justify-between pt-6 border-t border-gray-100 dark:border-gray-700">
            <div className="h-4 w-32 bg-gray-100 dark:bg-gray-700 rounded"></div>
            <div className="h-10 w-24 bg-gray-100 dark:bg-gray-700 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
        <div>
          <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Public Issues</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Real-time reports from the community.</p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400 px-2">
            Sort
          </label>
          <select 
            value={sort} 
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-bold py-2 pl-3 pr-8 text-sm focus:ring-2 focus:ring-indigo-500"
          >
            <option value="date">Newest First</option>
            <option value="severity">High Severity</option>
            <option value="upvotes">Most Upvoted</option>
          </select>
        </div>
      </div>

      {loading && reports.length === 0 && <LoadingSkeleton />}
      
      {error && (
        <div className={`p-6 rounded-2xl border flex flex-col items-center gap-4 text-center ${
          isRetrying 
            ? "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-200 dark:border-amber-800"
            : "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800"
        }`}>
          <span className="text-2xl">{isRetrying ? "⏳" : "⚠️"}</span>
          <p className="font-semibold">{error}</p>
          {!isRetrying && (
            <button 
              onClick={load}
              className="px-6 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-current font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all active:scale-95"
            >
              Try Again
            </button>
          )}
        </div>
      )}
      
      {!loading && !error && reports.length === 0 && (
        <div className="text-center py-24 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="text-5xl mb-6">📝</div>
          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No reports found</h4>
          <p className="text-gray-500 dark:text-gray-400">Be the first one to report an issue!</p>
        </div>
      )}

      <div className="grid gap-8">
        {reports.map((report) => (
          <ReportCard
            key={report._id}
            report={report}
            onUpvote={() => handleUpvote(report._id)}
            canUpvote={!upvoted.has(report._id)}
          />
        ))}
      </div>
    </div>
  );
}
