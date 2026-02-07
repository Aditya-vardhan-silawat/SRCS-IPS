import SeverityBadge from "./SeverityBadge";

export default function ReportCard({ report, onUpvote, canUpvote }) {
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
        <div className="grid grid-cols-3 gap-4 mb-4">
          {report.images.map((img) => (
            <img 
              key={img.filename} 
              src={img.url} 
              alt="report evidence" 
              className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
            />
          ))}
        </div>
      )}
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(report.createdAt).toLocaleString()}
        </span>
        <button 
          onClick={onUpvote} 
          disabled={!canUpvote}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            canUpvote 
              ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50" 
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
