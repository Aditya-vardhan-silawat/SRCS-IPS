import { useEffect, useState } from "react";
import { fetchReports, upvoteReport } from "../api/reportsApi";
import ReportCard from "./ReportCard";

export default function IssueList() {
  const [sort, setSort] = useState("date");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setError("");
    setLoading(true);
    try {
      const data = await fetchReports(sort);
      setReports(data);
    } catch (err) {
      setError(err.message);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Public Issues</h3>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Sort by:
          </label>
          <select 
            value={sort} 
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 pl-3 pr-8 text-sm"
          >
            <option value="date">Newest</option>
            <option value="severity">Severity</option>
            <option value="upvotes">Upvotes</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}
      
      {error && (
        <div className="p-4 rounded-lg bg-red-50 text-red-700 border border-red-100 text-center">
          {error}
        </div>
      )}
      
      {!loading && reports.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <p>No reports yet.</p>
        </div>
      )}

      <div className="grid gap-6">
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
