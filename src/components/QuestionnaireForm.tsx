import React, { useState, useEffect } from 'react';
import { 
  Question, 
  RespondentIdentity, 
  ResponseItem 
} from '../types';
import { 
  Send, 
  Star, 
  User, 
  GraduationCap, 
  CheckCircle, 
  AlertCircle, 
  RotateCcw,
  Save,
  BookOpen,
  BarChart3,
  Sparkles
} from 'lucide-react';

interface QuestionnaireFormProps {
  questions: Question[];
  currentLanguage: 'id' | 'en';
  onSubmit: (response: ResponseItem) => void;
  onOpenRespondentStats?: () => void;
}

const DRAFT_KEY = 'quisioner_draft_answers_v1';
const DRAFT_RESPONDENT_KEY = 'quisioner_draft_respondent_v1';

export const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({
  questions,
  currentLanguage,
  onSubmit,
  onOpenRespondentStats,
}) => {
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [respondent, setRespondent] = useState<RespondentIdentity>({
    name: '',
    gender: '',
    age: '',
    education: '',
    occupation: '',
  });
  const [starHover, setStarHover] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [startTime] = useState<number>(Date.now());
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const savedAnswers = localStorage.getItem(DRAFT_KEY);
      const savedRespondent = localStorage.getItem(DRAFT_RESPONDENT_KEY);
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
      }
      if (savedRespondent) {
        setRespondent(JSON.parse(savedRespondent));
      }
    } catch (e) {
      console.error('Failed to load draft:', e);
    }
  }, []);

  // Auto-save draft on answers/respondent change
  useEffect(() => {
    try {
      if (Object.keys(answers).length > 0 || respondent.gender !== '') {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(answers));
        localStorage.setItem(DRAFT_RESPONDENT_KEY, JSON.stringify(respondent));
        setIsSaved(true);
        const timer = setTimeout(() => setIsSaved(false), 2000);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.error('Draft save failed:', e);
    }
  }, [answers, respondent]);

  const handleRatingSelect = (questionId: string, rating: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: rating,
    }));
    setErrorMessage(null);
  };

  const handleTextChange = (questionId: string, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: text,
    }));
  };

  const handleRespondentChange = (field: keyof RespondentIdentity, value: string) => {
    setRespondent((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrorMessage(null);
  };

  const clearDraft = () => {
    if (window.confirm('Apakah Anda yakin ingin mengosongkan seluruh isian formulir?')) {
      setAnswers({});
      setRespondent({
        name: '',
        gender: '',
        age: '',
        education: '',
        occupation: '',
      });
      localStorage.removeItem(DRAFT_KEY);
      localStorage.removeItem(DRAFT_RESPONDENT_KEY);
    }
  };

  // Calculate completion percentage
  const requiredQuestions = questions.filter((q) => q.required);
  const answeredRequiredCount = requiredQuestions.filter((q) => {
    const val = answers[q.id];
    if (q.type === 'text') return typeof val === 'string' && val.trim() !== '';
    return typeof val === 'number' && val >= 1 && val <= 5;
  }).length;
  
  const totalRequiredFields = requiredQuestions.length + 4; // gender, age, education, occupation
  const filledRespondentCount = [
    respondent.gender,
    respondent.age,
    respondent.education,
    respondent.occupation,
  ].filter((v) => v !== '').length;

  const totalCompleted = answeredRequiredCount + filledRespondentCount;
  const progressPercent = Math.round((totalCompleted / totalRequiredFields) * 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate Respondent Required Fields
    if (!respondent.gender || !respondent.age || !respondent.education || !respondent.occupation) {
      setErrorMessage('Mohon lengkapi seluruh Bagian I (Identitas Responden) terlebih dahulu.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Validate Required Questions
    for (const q of requiredQuestions) {
      if (answers[q.id] === undefined || answers[q.id] === null || answers[q.id] === '') {
        setErrorMessage(`Mohon jawab pertanyaan: "${q.text}"`);
        const el = document.getElementById(`question-card-${q.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
    }

    const timeSpentSeconds = Math.round((Date.now() - startTime) / 1000);

    const responseItem: ResponseItem = {
      id: `resp-${Date.now()}`,
      timestamp: new Date().toISOString(),
      languageRead: currentLanguage,
      respondent,
      answers,
      timeSpentSeconds,
    };

    // Clear local storage draft
    localStorage.removeItem(DRAFT_KEY);
    localStorage.removeItem(DRAFT_RESPONDENT_KEY);

    onSubmit(responseItem);
  };

  const knowledgeQuestions = questions.filter((q) => q.section === 'knowledge');
  const evaluationQuestions = questions.filter((q) => q.section === 'evaluation');
  const reviewQuestions = questions.filter((q) => q.section === 'review');

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-lg">
      
      {/* Header Sticky Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Formulir Evaluasi &amp; Review
            </span>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Lembar Penilaian Jurnal Ilmiah
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            {isSaved && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 animate-fade-in">
                <Save className="w-3 h-3" />
                <span className="hidden sm:inline">Tersimpan</span>
              </span>
            )}

            <button
              type="button"
              onClick={clearDraft}
              className="p-1.5 rounded-lg bg-slate-200/80 text-slate-600 hover:text-rose-600 hover:bg-slate-300 transition-colors"
              title="Reset Isian Formulir"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-600 font-medium">
            <span>Kelengkapan Pengisian:</span>
            <span className="font-bold text-indigo-700">{progressPercent}% ({totalCompleted}/{totalRequiredFields})</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden p-0.5">
            <div 
              className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500 h-full rounded-full transition-all duration-300 shadow-xs"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Form Content Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 bg-slate-50/50">
        
        {/* Banner Button: View Respondent Analytics */}
        {onOpenRespondentStats && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 border border-indigo-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-1.5 text-xs font-extrabold text-indigo-700">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Statistik Penilaian Terkumpul</span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Ingin mengetahui indikator mana yang paling dipahami oleh responden lain?
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenRespondentStats}
              className="flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm shrink-0"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Lihat Rata-Rata Skor</span>
            </button>
          </div>
        )}

        {/* Error Notification Alert */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-3 shadow-xs animate-shake">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* BAGIAN I: IDENTITAS RESPONDEN */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                I
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                  BAGIAN I: IDENTITAS RESPONDEN
                </h3>
                <p className="text-xs text-slate-500 font-medium">Profil singkat pengisi kuesioner</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
              
              {/* Nama (Optional) */}
              <div className="space-y-1 sm:col-span-2">
                <label className="block">Nama Lengkap &amp; Gelar <span className="text-slate-400 font-normal">(Opsional / Boleh Anonim)</span></label>
                <input
                  type="text"
                  value={respondent.name}
                  onChange={(e) => handleRespondentChange('name', e.target.value)}
                  placeholder="Contoh: Dr. Ahmad Subandi, M.Kes / Anonim"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium text-xs focus:outline-none focus:border-indigo-600"
                />
              </div>

              {/* Jenis Kelamin */}
              <div className="space-y-1">
                <label className="block">Jenis Kelamin <span className="text-rose-500">*</span></label>
                <select
                  value={respondent.gender}
                  onChange={(e) => handleRespondentChange('gender', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium text-xs focus:outline-none focus:border-indigo-600"
                >
                  <option value="">-- Pilih Jenis Kelamin --</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              {/* Usia */}
              <div className="space-y-1">
                <label className="block">Usia Responden <span className="text-rose-500">*</span></label>
                <select
                  value={respondent.age}
                  onChange={(e) => handleRespondentChange('age', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium text-xs focus:outline-none focus:border-indigo-600"
                >
                  <option value="">-- Pilih Rentang Usia --</option>
                  <option value="< 20 tahun">&lt; 20 tahun</option>
                  <option value="20 - 30 tahun">20 - 30 tahun</option>
                  <option value="31 - 40 tahun">31 - 40 tahun</option>
                  <option value="41 - 50 tahun">41 - 50 tahun</option>
                  <option value="> 50 tahun">&gt; 50 tahun</option>
                </select>
              </div>

              {/* Pendidikan */}
              <div className="space-y-1">
                <label className="block">Pendidikan Terakhir <span className="text-rose-500">*</span></label>
                <select
                  value={respondent.education}
                  onChange={(e) => handleRespondentChange('education', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium text-xs focus:outline-none focus:border-indigo-600"
                >
                  <option value="">-- Pilih Pendidikan --</option>
                  <option value="SMA / SMK">SMA / SMK</option>
                  <option value="Diploma (D3/D4)">Diploma (D3/D4)</option>
                  <option value="Sarjana (S1)">Sarjana (S1)</option>
                  <option value="Magister (S2)">Magister (S2)</option>
                  <option value="Doktor (S3)">Doktor (S3)</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              {/* Pekerjaan */}
              <div className="space-y-1">
                <label className="block">Pekerjaan / Profesi <span className="text-rose-500">*</span></label>
                <select
                  value={respondent.occupation}
                  onChange={(e) => handleRespondentChange('occupation', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium text-xs focus:outline-none focus:border-indigo-600"
                >
                  <option value="">-- Pilih Pekerjaan --</option>
                  <option value="Tenaga Medis / Kesehatan">Tenaga Medis / Kesehatan</option>
                  <option value="Praktisi Hukum / Pengacara">Praktisi Hukum / Pengacara</option>
                  <option value="Akademisi / Dosen / Peneliti">Akademisi / Dosen / Peneliti</option>
                  <option value="Mahasiswa">Mahasiswa</option>
                  <option value="Pegawai Swasta / PNS">Pegawai Swasta / PNS</option>
                  <option value="Masyarakat Umum">Masyarakat Umum</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

            </div>
          </div>

          {/* BAGIAN II: PENGETAHUAN RESPONDEN */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                II
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                  BAGIAN II: PENGETAHUAN RESPONDEN
                </h3>
                <p className="text-xs text-slate-500 font-medium">Skala Penilaian: 1 = Sangat Tidak Paham s/d 5 = Sangat Paham</p>
              </div>
            </div>

            <div className="space-y-4">
              {knowledgeQuestions.map((q, index) => (
                <div 
                  key={q.id} 
                  id={`question-card-${q.id}`}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
                >
                  <div className="flex items-start space-x-2">
                    <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                      {q.text} {q.required && <span className="text-rose-500">*</span>}
                    </p>
                  </div>

                  {/* 1-5 Scale Radio Group */}
                  <div className="grid grid-cols-5 gap-1.5 sm:gap-2 pt-1">
                    {[1, 2, 3, 4, 5].map((val) => {
                      const isSelected = answers[q.id] === val;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleRatingSelect(q.id, val)}
                          className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center space-y-1 ${
                            isSelected
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-md scale-[1.02]'
                              : 'bg-white border-slate-300 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50/50'
                          }`}
                        >
                          <span className="text-sm">{val}</span>
                          <span className="text-[10px] font-normal text-center hidden sm:block">
                            {val === 1 && 'Sangat Tidak Paham'}
                            {val === 2 && 'Tidak Paham'}
                            {val === 3 && 'Cukup Paham'}
                            {val === 4 && 'Paham'}
                            {val === 5 && 'Sangat Paham'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BAGIAN III: EVALUASI KETERBACAAN JURNAL */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                III
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                  BAGIAN III: EVALUASI KETERBACAAN JURNAL
                </h3>
                <p className="text-xs text-slate-500 font-medium">Skala Penilaian: 1 = Sangat Rendah s/d 5 = Sangat Tinggi</p>
              </div>
            </div>

            <div className="space-y-4">
              {evaluationQuestions.map((q, index) => (
                <div 
                  key={q.id} 
                  id={`question-card-${q.id}`}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
                >
                  <div className="flex items-start space-x-2">
                    <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {knowledgeQuestions.length + index + 1}
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                      {q.text} {q.required && <span className="text-rose-500">*</span>}
                    </p>
                  </div>

                  {/* 1-5 Scale Radio Group */}
                  <div className="grid grid-cols-5 gap-1.5 sm:gap-2 pt-1">
                    {[1, 2, 3, 4, 5].map((val) => {
                      const isSelected = answers[q.id] === val;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleRatingSelect(q.id, val)}
                          className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center space-y-1 ${
                            isSelected
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-md scale-[1.02]'
                              : 'bg-white border-slate-300 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50/50'
                          }`}
                        >
                          <span className="text-sm">{val}</span>
                          <span className="text-[10px] font-normal text-center hidden sm:block">
                            {val === 1 && 'Sangat Rendah'}
                            {val === 2 && 'Rendah'}
                            {val === 3 && 'Cukup'}
                            {val === 4 && 'Tinggi'}
                            {val === 5 && 'Sangat Tinggi'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BAGIAN IV: REVIEW TERBUKA & RATING KESELURUHAN */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                IV
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                  BAGIAN IV: REVIEW TERBUKA &amp; RATING KESELURUHAN
                </h3>
                <p className="text-xs text-slate-500 font-medium">Masukan kualitatif &amp; nilai bintang akhir</p>
              </div>
            </div>

            <div className="space-y-5">
              {reviewQuestions.map((q) => {
                if (q.type === 'star') {
                  const currentVal = (answers[q.id] as number) || 0;
                  return (
                    <div 
                      key={q.id} 
                      id={`question-card-${q.id}`}
                      className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-3"
                    >
                      <label className="block text-xs sm:text-sm font-bold text-slate-900">
                        {q.text} {q.required && <span className="text-rose-500">*</span>}
                      </label>

                      {/* Interactive 5-Star Rating */}
                      <div className="flex items-center justify-center space-x-2 py-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setStarHover(star)}
                            onMouseLeave={() => setStarHover(0)}
                            onClick={() => handleRatingSelect(q.id, star)}
                            className="p-1 focus:outline-none transition-transform transform hover:scale-125"
                          >
                            <Star
                              className={`w-8 h-8 ${
                                (starHover || currentVal) >= star
                                  ? 'fill-amber-400 text-amber-500 drop-shadow-sm'
                                  : 'text-slate-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <p className="text-center text-xs font-bold text-amber-700">
                        {currentVal > 0 ? `Memberikan ${currentVal} Bintang ⭐` : 'Pilih 1 - 5 Bintang'}
                      </p>
                    </div>
                  );
                }

                return (
                  <div key={q.id} className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-800">
                      {q.text}
                    </label>
                    <textarea
                      rows={3}
                      value={(answers[q.id] as string) || ''}
                      onChange={(e) => handleTextChange(q.id, e.target.value)}
                      placeholder="Tuliskan masukan atau saran konstruktif Anda di sini..."
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center space-x-2 group"
            >
              <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              <span>KIRIM TANGGAPAN KUESIONER</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
