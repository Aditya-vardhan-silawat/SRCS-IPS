import { useState } from "react";
import { submitReport } from "../api/reportsApi";

const CATEGORIES = [
  "Academic",
  "Staff Behavior",
  "Facilities",
  "Mental Pressure",
  "Harassment",
  "Other"
];

export default function ReportForm({ onSubmitted }) {
  const [category, setCategory] = useState("Academic");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleFileChange(e) {
    const list = Array.from(e.target.files || []);
    setFiles(list.slice(0, 3));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const result = await submitReport({
        category,
        description,
        images: files
      });
      setSuccess(`Report submitted with severity: ${result.severity}`);
      setDescription("");
      setFiles([]);
      if (onSubmitted) onSubmitted();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden p-8 border border-gray-100 dark:border-gray-700">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span>🛡️</span> Submit an Anonymous Report
        </h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Issue Category
            </label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-3"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Describe the issue
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              placeholder="Describe what happened, where and when. Do not include your name or personal identifiers."
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 px-4 placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Attach images (optional, max 3)
            </label>
            <input 
              type="file" 
              accept="image/png,image/jpeg" 
              multiple 
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 dark:text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100
                dark:file:bg-indigo-900 dark:file:text-indigo-300
              " 
            />
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all ${
              submitting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {submitting ? "Submitting..." : "Submit Anonymously"}
          </button>

          {error && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200 text-sm border border-red-100 dark:border-red-800">
              ⚠️ {error}
            </div>
          )}
          
          {success && (
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-200 text-sm border border-green-100 dark:border-green-800">
              ✅ {success}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
