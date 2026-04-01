import { useState } from "react";
import { COLLEGE_NAME, COLLEGE_LOGO_URL, TAGLINE } from "../config/branding";

export default function Layout({ children, onAdminClick, isLoggedIn, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <header className="bg-slate-900 text-white shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <img 
                src={COLLEGE_LOGO_URL} 
                alt={COLLEGE_NAME} 
                className="h-12 w-12 sm:h-14 sm:w-14 object-contain bg-white rounded-xl p-1 shadow-inner" 
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold tracking-tight text-white">{COLLEGE_NAME}</h1>
                <h2 className="text-xs text-slate-400 font-medium uppercase tracking-wider">{TAGLINE}</h2>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold tracking-tight text-white">SRCS</h1>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {isLoggedIn ? (
                <button 
                  onClick={onLogout}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  Logout
                </button>
              ) : (
                <button 
                  onClick={onAdminClick}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  Admin Access
                </button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-800 border-t border-slate-700 py-4 px-4 space-y-3 animate-in slide-in-from-top duration-200">
            {isLoggedIn ? (
              <button 
                onClick={() => { onLogout(); setIsMenuOpen(false); }}
                className="w-full text-left px-4 py-3 rounded-xl text-base font-bold bg-red-600/20 text-red-400 border border-red-600/30"
              >
                Logout
              </button>
            ) : (
              <button 
                onClick={() => { onAdminClick(); setIsMenuOpen(false); }}
                className="w-full text-left px-4 py-3 rounded-xl text-base font-bold bg-indigo-600 text-white shadow-lg"
              >
                Admin Access
              </button>
            )}
          </div>
        )}
      </header>

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">SRCS-IPS Anonymous Reporting</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                Built as a privacy-first, 100% anonymous reporting system. We do not store IP addresses, cookies, or any personal identifiers.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 md:justify-end text-sm">
              {isLoggedIn ? (
                <button onClick={onLogout} className="text-red-600 font-semibold hover:underline">Logout</button>
              ) : (
                <button onClick={onAdminClick} className="text-indigo-600 font-semibold hover:underline">Admin Login</button>
              )}
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <span className="text-gray-500 dark:text-gray-400 italic">Security First Architecture</span>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700 text-center text-xs text-gray-400 uppercase tracking-widest">
            © {new Date().getFullYear()} advansal
          </div>
        </div>
      </footer>
    </div>
  );
}
