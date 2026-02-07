export default function SeverityBadge({ severity }) {
  const styles = {
    LOW: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    MEDIUM: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    HIGH: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    CRITICAL: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
  };

  const className = styles[severity] || styles.LOW;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {severity}
    </span>
  );
}
