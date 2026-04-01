import { TAGLINE } from "../config/branding";

export default function LandingPage({ onStartReporting, onTrackStatus, onViewFeed }) {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative py-12 md:py-24 overflow-hidden rounded-3xl bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent"></div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
            Your Voice Matters, <br />
            <span className="text-indigo-400 italic">Your Identity Stays Hidden.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto">
            {TAGLINE}. Reporting issues shouldn't come with fear. Our platform ensures 100% anonymity for a safer campus environment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onStartReporting}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-indigo-500/20 transition-all active:scale-95"
            >
              🚀 Report an Incident
            </button>
            <button 
              onClick={onTrackStatus}
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold text-lg border border-slate-700 transition-all active:scale-95"
            >
              🔍 Track Status
            </button>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-2xl mb-6">
            🔒
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">100% Anonymous</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
            We do not store your name, email, or IP address. Every report is cryptographically separated from its sender.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-2xl mb-6">
            ⚡
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Instant Severity Scoring</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
            Our AI engine automatically calculates the severity of each report to ensure critical issues get immediate attention.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-2xl mb-6">
            📈
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Real-time Tracking</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
            Use your unique report code to check the status of your complaint and add follow-up details as needed.
          </p>
        </div>
      </section>

      {/* Stats / CTA */}
      <section className="bg-indigo-600 rounded-3xl p-10 md:p-16 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to make a difference?</h2>
        <p className="text-indigo-100 mb-10 max-w-xl mx-auto text-lg">
          Join hundreds of students in making our campus a better place for everyone.
        </p>
        <button 
          onClick={onViewFeed}
          className="px-10 py-4 bg-white text-indigo-600 rounded-2xl font-bold text-lg hover:bg-indigo-50 transition-all shadow-lg active:scale-95"
        >
          View Public Issues
        </button>
      </section>
    </div>
  );
}
