import React, { useState, useEffect } from 'react';
import { 
  JournalMetadata, 
  Question, 
  ResponseItem 
} from './types';
import { 
  initialJournalMetadata, 
  initialQuestions, 
  initialResponses 
} from './data/initialData';
import { Navbar } from './components/Navbar';
import { PdfViewer } from './components/PdfViewer';
import { QuestionnaireForm } from './components/QuestionnaireForm';
import { SuccessModal } from './components/SuccessModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { RespondentStatsModal } from './components/RespondentStatsModal';

const APP_RESPONSES_KEY = 'quisioner_app_responses_v1';
const APP_QUESTIONS_KEY = 'quisioner_app_questions_v1';
const APP_JOURNAL_KEY = 'quisioner_app_journal_v1';

export function App() {
  // Navigation & Authentication state
  const [activeTab, setActiveTab] = useState<'public' | 'admin'>('public');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [isRespondentStatsOpen, setIsRespondentStatsOpen] = useState<boolean>(false);

  // Active language choice for reading PDF ('id' | 'en')
  const [currentLanguage, setCurrentLanguage] = useState<'id' | 'en'>('id');

  const [isInitializing, setIsInitializing] = useState(true);

  // Main data state
  const [journal, setJournal] = useState<JournalMetadata>(initialJournalMetadata);
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [responses, setResponses] = useState<ResponseItem[]>(initialResponses);

  // Load from Database
  useEffect(() => {
    const fetchDb = async () => {
      try {
        const apiUrl = import.meta.env.DEV ? 'http://localhost:3000' : '';
        const res = await fetch(`${apiUrl}/api/db`);
        if (res.ok) {
          const data = await res.json();
          if (data.journal && data.journal.length > 0) setJournal(data.journal[0]);
          if (data.questions) setQuestions(data.questions);
          if (data.responses) setResponses(data.responses);
        }
      } catch (e) {
        console.error('Failed fetching DB:', e);
      } finally {
        setIsInitializing(false);
      }
    };
    fetchDb();
  }, []);

  // Latest submitted response for success modal
  const [submittedResponse, setSubmittedResponse] = useState<ResponseItem | null>(null);

  // Persist responses, questions, journal to Database API
  useEffect(() => {
    if (isInitializing) return;
    
    const saveDb = async () => {
      try {
        const apiUrl = import.meta.env.DEV ? 'http://localhost:3000' : '';
        await fetch(`${apiUrl}/api/db`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            journal: [journal],
            questions,
            responses
          })
        });
      } catch (e) {
        console.error('Failed saving DB:', e);
      }
    };

    const timeoutId = setTimeout(() => saveDb(), 500);
    return () => clearTimeout(timeoutId);
  }, [journal, questions, responses, isInitializing]);

  const handleFormSubmit = (response: ResponseItem) => {
    setResponses((prev) => [response, ...prev]);
    setSubmittedResponse(response);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      
      {/* Top Main Navigation Bar */}
      <Navbar
        journal={journal}
        isAdmin={isAdmin}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onAdminLogout={() => {
          setIsAdmin(false);
          setActiveTab('public');
        }}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        onOpenRespondentStats={() => setIsRespondentStatsOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col bg-slate-50">
        
        {activeTab === 'public' ? (
          /* Public Questionnaire Split Screen Layout */
          <div className="flex-1 p-3 sm:p-5 max-w-[1700px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 bg-slate-50">
            
            {/* Sisi Kiri: PDF Reader Area (7 Columns on Large screen) */}
            <div className="lg:col-span-7 h-[650px] lg:h-[calc(100vh-100px)] lg:sticky lg:top-[80px]">
              <PdfViewer
                journal={journal}
                currentLanguage={currentLanguage}
                onLanguageChange={setCurrentLanguage}
              />
            </div>

            {/* Sisi Kanan: Form Kuesioner Area (5 Columns on Large screen) */}
            <div className="lg:col-span-5 h-full min-h-[600px] lg:h-[calc(100vh-100px)]">
              <QuestionnaireForm
                journal={journal}
                questions={questions}
                currentLanguage={currentLanguage}
                onSubmit={handleFormSubmit}
                onOpenRespondentStats={() => setIsRespondentStatsOpen(true)}
              />
            </div>

          </div>
        ) : (
          /* Admin Dashboard Portal */
          <AdminDashboard
            journal={journal}
            setJournal={setJournal}
            questions={questions}
            setQuestions={setQuestions}
            responses={responses}
            setResponses={setResponses}
          />
        )}

      </main>

      {/* Respondent Statistics Modal (Public Access) */}
      <RespondentStatsModal
        isOpen={isRespondentStatsOpen}
        onClose={() => setIsRespondentStatsOpen(false)}
        questions={questions}
        responses={responses}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={() => {
          setIsAdmin(true);
          setIsAdminLoginOpen(false);
          setActiveTab('admin');
        }}
      />

      {/* Submission Success Modal */}
      {submittedResponse && (
        <SuccessModal
          response={submittedResponse}
          onReset={() => setSubmittedResponse(null)}
        />
      )}

    </div>
  );
}

export default App;
