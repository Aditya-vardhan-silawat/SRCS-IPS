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
  const [parentReportCode, setParentReportCode] = useState("");
  const [isFollowUp, setIsFollowUp] = useState(false);
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  function handleFileChange(e) {
    const list = Array.from(e.target.files || []);
    setFiles(list.slice(0, 3));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(null);
    setSubmitting(true);

    try {
      const result = await submitReport({
        category,
        description,
        images: files,
        parentReportCode: isFollowUp ? parentReportCode : null
      });
      setSuccess({
        message: "Your complaint has been submitted successfully.",
        reportCode: result.reportCode,
        severity: result.severity
      });
      setDescription("");
      setParentReportCode("");
      setIsFollowUp(false);
      setFiles([]);
      if (onSubmitted) onSubmitted();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl overflow-hidden p-6 sm:p-10 border border-gray-100 dark:border-gray-700">
        <div className="mb-10">
          <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <span>🛡️</span> Submit Report
          </h3>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Your identity is protected by our encryption layer.</p>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-4 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800 transition-all hover:shadow-md">
            <div className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="isFollowUp"
                checked={isFollowUp}
                onChange={(e) => setIsFollowUp(e.target.checked)}
                className="w-5 h-5 text-indigo-600 border-gray-300 rounded-lg focus:ring-indigo-500 transition-all"
              />
            </div>
            <label htmlFor="isFollowUp" className="text-sm font-bold text-indigo-900 dark:text-indigo-200 cursor-pointer">
              This is a follow-up to a previous report
            </label>
          </div>

          {isFollowUp && (
            <div className="animate-in slide-in-from-top duration-300">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">
                Previous Report Code
              </label>
              <input
                type="text"
                value={parentReportCode}
                onChange={(e) => setParentReportCode(e.target.value)}
                placeholder="e.g. 4829135"
                required={isFollowUp}
                className="w-full rounded-2xl border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 py-4 px-5 transition-all outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">
              Issue Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`py-3 px-4 rounded-xl text-sm font-bold border-2 transition-all ${
                    category === c
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20 scale-95"
                      : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-indigo-200"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">
              Describe the issue
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              placeholder="Provide details. Avoid names or personal info."
              className="w-full rounded-2xl border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 py-4 px-5 transition-all outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">
              Evidence (Max 3 Images)
            </label>
            <label className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 dark:border-gray-700 border-dashed rounded-2xl hover:border-indigo-400 transition-colors cursor-pointer group relative">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400 group-hover:text-indigo-500 transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                  <span className="relative bg-white dark:bg-gray-800 rounded-md font-bold text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                    <span>Upload images</span>
                    <input 
                      type="file" 
                      accept="image/png,image/jpeg" 
                      multiple 
                      onChange={handleFileChange}
                      className="sr-only" 
                    />
                  </span>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
              </div>
            </label>
            {files.length > 0 && (
              <div className="mt-4 flex gap-2">
                {Array.from(files).map((f, i) => (
                  <div key={i} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full border border-indigo-100 dark:border-indigo-800">
                    {f.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className={`w-full flex justify-center py-5 px-4 border border-transparent rounded-2xl shadow-xl text-lg font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition-all active:scale-95 ${
              submitting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {submitting ? "Processing..." : "Submit Anonymous Report"}
          </button>

          {error && (
            <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-200 text-sm font-bold border border-red-100 dark:border-red-800 animate-in fade-in duration-300">
              ⚠️ {error}
            </div>
          )}
          
          {success && (
            <div className="p-8 rounded-3xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-200 border border-green-100 dark:border-green-800 animate-in zoom-in duration-500">
              <div className="flex items-center gap-3 mb-6 font-extrabold text-xl">
                <span className="text-2xl">✅</span> {success.message}
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border-2 border-green-200 dark:border-green-700 shadow-lg">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Your Secure Report Code</p>
                <div className="flex items-center justify-between">
                  <p className="text-4xl font-mono font-black tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
                    {success.reportCode}
                  </p>
                  <button 
                    type="button"
                    onClick={() => navigator.clipboard.writeText(success.reportCode)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Copy Code"
                  >
                    📋
                  </button>
                </div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-4 leading-relaxed">
                  Save this code immediately. You will need it to track your report or file follow-up complaints. We cannot recover lost codes.
                </p>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
