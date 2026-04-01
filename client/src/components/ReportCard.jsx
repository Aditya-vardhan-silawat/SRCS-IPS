import SeverityBadge from "./SeverityBadge";
import { BASE_URL } from "../config/apiConfig";

export default function ReportCard({ report, onUpvote, canUpvote }) {
  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/400x300?text=No+Image";
    // If it's a relative path, prepend BASE_URL
    if (url.startsWith("/")) return `${BASE_URL}${url}`;
    return url;
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 mb-6 border border-gray-100 dark:border-gray-700 transition-all hover:shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
          {report.category}
        </span>
        <SeverityBadge severity={report.severity} />
      </div>
      
      <p className="text-gray-700 dark:text-gray-300 text-base mb-4 leading-relaxed whitespace-pre-wrap">
        {report.description}
      </p>
      
      {report.images && report.images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
          {report.images.map((img) => (
            <div key={img.filename} className="relative group overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600">
              <img 
                src={getImageUrl(img.url)} 
                alt="report evidence" 
                loading="lazy"
                className="w-full h-32 sm:h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/400x300?text=Image+Load+Error";
                }}
              />
            </div>
          ))}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(report.createdAt).toLocaleString()}
        </span>
        <button 
          onClick={onUpvote} 
          disabled={!canUpvote}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all ${
            canUpvote 
              ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg" 
              : "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
          }`}
        >
          <span>⬆</span> 
          <span>Upvote ({report.upvotes})</span>
        </button>
      </div>
    </div>
  );
}
