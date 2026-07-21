import React from 'react';
import { BookOpen, Shield, ShieldCheck, LogOut, Sparkles, FileText, BarChart3 } from 'lucide-react';
import { JournalMetadata } from '../types';

interface NavbarProps {
  journal: JournalMetadata;
  isAdmin: boolean;
  activeTab: 'public' | 'admin';
  setActiveTab: (tab: 'public' | 'admin') => void;
  onOpenAdminLogin: () => void;
  onAdminLogout: () => void;
  currentLanguage: 'id' | 'en';
  onLanguageChange: (lang: 'id' | 'en') => void;
  onOpenRespondentStats?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  journal,
  isAdmin,
  activeTab,
  setActiveTab,
  onOpenAdminLogin,
  onAdminLogout,
  currentLanguage,
  onLanguageChange,
  onOpenRespondentStats,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand / Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/20 ring-1 ring-black/5">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                JournalReview
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <Sparkles className="w-3 h-3 mr-1 text-indigo-600" />
                Bilingual EHR &amp; Law
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate max-w-xs sm:max-w-md hidden md:block font-medium">
              {journal.title}
            </p>
          </div>
        </div>

        {/* Right: Actions & Navigation */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Button to view Respondent Statistics (Visible on Public View) */}
          {activeTab === 'public' && onOpenRespondentStats && (
            <button
              onClick={onOpenRespondentStats}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-all shadow-2xs"
              title="Lihat Rata-Rata Skor & Pemahaman Responden"
            >
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <span className="hidden md:inline">Statistik Penilaian Responden</span>
              <span className="md:hidden">Statistik</span>
            </button>
          )}

          {/* Quick PDF Language Toggle inside Nav if public view */}
          {activeTab === 'public' && (
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
              <button
                onClick={() => onLanguageChange('id')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  currentLanguage === 'id'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
                title="Baca Naskah Bahasa Indonesia"
              >
                <span className="text-sm">🇮🇩</span>
                <span className="hidden sm:inline">Bahasa Indonesia</span>
                <span className="sm:hidden">ID</span>
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  currentLanguage === 'en'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
                title="Read English Manuscript"
              >
                <span className="text-sm">🇬🇧</span>
                <span className="hidden sm:inline">English</span>
                <span className="sm:hidden">EN</span>
              </button>
            </div>
          )}

          {/* Tab Switchers: Public Questionnaire vs Admin Dashboard */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('public')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'public'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>Partisipan</span>
            </button>

            <button
              onClick={() => {
                if (isAdmin) {
                  setActiveTab('admin');
                } else {
                  onOpenAdminLogin();
                }
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'admin'
                  ? 'bg-indigo-600 text-white shadow-md font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isAdmin ? (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              ) : (
                <Shield className="w-3.5 h-3.5 text-amber-500" />
              )}
              <span>Dashboard Admin</span>
            </button>
          </div>

          {/* Admin Logout button if logged in */}
          {isAdmin && (
            <button
              onClick={onAdminLogout}
              className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition-colors"
              title="Logout Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
