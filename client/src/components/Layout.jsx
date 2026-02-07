import { COLLEGE_NAME, COLLEGE_LOGO_URL, TAGLINE } from "../config/branding";

export default function Layout({ children, onAdminClick, isLoggedIn, onLogout }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <header className="bg-slate-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <img 
              src={COLLEGE_LOGO_URL} 
              alt={COLLEGE_NAME} 
              className="h-16 w-16 object-contain bg-white rounded-lg p-1" 
            />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{COLLEGE_NAME}</h1>
              <h2 className="text-sm text-slate-300 font-medium">{TAGLINE}</h2>
            </div>
          </div>
          <p className="mt-4 text-slate-400 text-sm max-w-2xl">
            Anonymous, safe reporting for academic, staff behavior, facilities, and mental health issues.
          </p>
        </div>
      </header>

      <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <p>Built as a privacy-first, anonymous reporting system for ethical technology.</p>
          <div className="mt-4 sm:mt-0 flex gap-4">
            {isLoggedIn ? (
              <button 
                onClick={onLogout}
                className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                Admin Logout
              </button>
            ) : (
              <button 
                onClick={onAdminClick}
                className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                Admin Login
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
