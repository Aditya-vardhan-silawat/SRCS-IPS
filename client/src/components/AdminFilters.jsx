export default function AdminFilters({ sort, setSort }) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Sort by:
      </label>
      <select 
        value={sort} 
        onChange={(e) => setSort(e.target.value)}
        className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 pl-3 pr-8 text-sm"
      >
        <option value="severity">Severity</option>
        <option value="upvotes">Upvotes</option>
        <option value="date">Date</option>
      </select>
    </div>
  );
}
