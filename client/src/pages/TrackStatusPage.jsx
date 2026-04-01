import { useState } from "react";
import { trackReport } from "../api/reportsApi";
import SeverityBadge from "../components/SeverityBadge";

export default function TrackStatusPage() {
  const [reportCode, setReportCode] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleTrack(e) {
    e.preventDefault();
    setError("");
    setData(null);
    setLoading(true);

    try {
      const result = await trackReport(reportCode);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-12 pb-24 px-4 sm:px-0">
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-8 sm:p-12 border border-gray-100 dark:border-gray-700 transition-all">
        <div className="mb-10 text-center sm:text-left">
          <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 flex flex-col sm:flex-row items-center gap-3">
            <span>🔍</span> Track Your Complaint
          </h3>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Enter your code to see live progress and updates.</p>
        </div>
        
        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={reportCode}
            onChange={(e) => setReportCode(e.target.value)}
            placeholder="Enter 7-digit code"
            required
            className="flex-1 rounded-2xl border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 py-4 px-6 transition-all outline-none font-mono text-xl tracking-widest text-center sm:text-left"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Tracking..." : "Check Status"}
          </button>
        </form>

        {error && (
          <div className="mt-8 p-5 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-200 text-sm font-bold border border-red-100 dark:border-red-800 animate-in fade-in duration-300 text-center">
            ⚠️ {error}
          </div>
        )}
      </div>

      {data && (
        <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
          <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-8 sm:p-12 border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-10 gap-6">
              <div>
                <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Main Report</h4>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Code:</span>
                  <span className="font-mono font-black text-indigo-600 dark:text-indigo-400">{data.report.reportCode}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
                <span className={`inline-flex items-center px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm ${
                  data.report.status === 'RESOLVED' ? 'bg-green-100 text-green-800 border border-green-200' :
                  data.report.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                  'bg-yellow-100 text-yellow-800 border border-yellow-200'
                }`}>
                  {data.report.status}
                </span>
                <SeverityBadge severity={data.report.severity} />
              </div>
            </div>
            
            <div className="prose prose-lg dark:prose-invert max-w-none mb-10">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 italic">{data.report.description}</p>
            </div>
            
            <div className="flex flex-wrap gap-6 pt-8 border-t border-gray-100 dark:border-gray-700 justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Category:</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{data.report.category}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Submitted:</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{new Date(data.report.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
              </div>
            </div>
          </div>

          {data.followUps.length > 0 && (
            <div className="space-y-6">
              <h4 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3 uppercase tracking-wider ml-4">
                <span>🔄</span> History ({data.followUps.length})
              </h4>
              {data.followUps.map((followUp, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-1 rounded-full">Follow-up #{idx + 1}</span>
                    <span className="text-xs font-bold text-gray-400">{new Date(followUp.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-base whitespace-pre-wrap leading-relaxed mb-6">{followUp.description}</p>
                  <div className="flex items-center gap-4">
                    <SeverityBadge severity={followUp.severity} />
                    <span className="text-[10px] font-black tracking-widest px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 uppercase">
                      {followUp.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
