import React, { useMemo } from 'react';
import { Question, ResponseItem } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  BarChart3, 
  Users, 
  Star, 
  X, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle,
  BookOpen
} from 'lucide-react';

interface RespondentStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  responses: ResponseItem[];
}

export const RespondentStatsModal: React.FC<RespondentStatsModalProps> = ({
  isOpen,
  onClose,
  questions,
  responses,
}) => {
  if (!isOpen) return null;

  const totalRespondents = responses.length;

  // Calculate Overall Average Score across all rating questions
  const overallMeanScore = useMemo(() => {
    let sum = 0;
    let count = 0;
    responses.forEach((resp) => {
      Object.entries(resp.answers).forEach(([_, val]) => {
        if (typeof val === 'number') {
          sum += val;
          count += 1;
        }
      });
    });
    return count > 0 ? (sum / count).toFixed(2) : '0.00';
  }, [responses]);

  // Chart Data: All Questions Mean Score
  const meanScoreChartData = useMemo(() => {
    const ratingQuestions = questions.filter((q) => q.type !== 'text');
    return ratingQuestions.map((q, idx) => {
      let sum = 0;
      let count = 0;
      responses.forEach((resp) => {
        const val = resp.answers[q.id];
        if (typeof val === 'number' && val >= 1 && val <= 5) {
          sum += val;
          count += 1;
        }
      });

      const mean = count > 0 ? Number((sum / count).toFixed(2)) : 0;
      const shortCode = `Q${idx + 1}`;

      return {
        id: q.id,
        shortCode,
        shortTitle: `${shortCode}: ${q.text.length > 25 ? q.text.substring(0, 25) + '...' : q.text}`,
        fullTitle: q.text,
        section: q.section,
        meanScore: mean,
        totalCount: count,
      };
    });
  }, [questions, responses]);

  // Identify Highest & Lowest Understood Questions
  const sortedData = useMemo(() => {
    return [...meanScoreChartData].sort((a, b) => b.meanScore - a.meanScore);
  }, [meanScoreChartData]);

  const highestUnderstood = sortedData[0];
  const lowestUnderstood = sortedData[sortedData.length - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
        
        {/* Header Bar */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full text-xs font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>STATISTIK HASIL PENILAIAN RESPONDEN</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Rata-Rata Skor &amp; Pemahaman Responden
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Data analitik gabungan dari seluruh responden untuk membantu Anda mengetahui tingkat pemahaman terhadap materi jurnal ini.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-700">Total Tanggapan Masuk</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">{totalRespondents} Responden</h3>
              <p className="text-xs text-indigo-600 font-medium mt-0.5">Partisipan aktif kuesioner</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-800">Rata-Rata Skala Evaluasi</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">{overallMeanScore} <span className="text-xs font-semibold text-slate-500">/ 5.00</span></h3>
              <p className="text-xs text-amber-700 font-medium mt-0.5">Skor rerata gabungan</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md">
              <Star className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Highest / Lowest Understanding Callout Cards */}
        {sortedData.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highestUnderstood && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="flex items-center space-x-1.5 text-emerald-800 text-xs font-extrabold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Paling Dipahami Responden (Skor Tertinggi)</span>
                </div>
                <p className="text-xs font-bold text-slate-900">{highestUnderstood.fullTitle}</p>
                <div className="text-xs text-emerald-700 font-bold">
                  Rata-Rata Skor: <strong>{highestUnderstood.meanScore} / 5.00</strong>
                </div>
              </div>
            )}

            {lowestUnderstood && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                <div className="flex items-center space-x-1.5 text-amber-800 text-xs font-extrabold">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>Perlu Pemahaman Lebih (Skor Terendah)</span>
                </div>
                <p className="text-xs font-bold text-slate-900">{lowestUnderstood.fullTitle}</p>
                <div className="text-xs text-amber-700 font-bold">
                  Rata-Rata Skor: <strong>{lowestUnderstood.meanScore} / 5.00</strong>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Rata-Rata Skor per Indikator Bar Chart */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <span>Rata-Rata Skor per Indikator Pertanyaan (Skala 1.0 - 5.0)</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Grafik rata-rata penilaian responden untuk masing-masing indikator kuesioner.
            </p>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={meanScoreChartData} margin={{ top: 20, right: 20, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis dataKey="shortCode" tick={{ fill: '#334155', fontSize: 12, fontWeight: 700 }} />
                <YAxis domain={[0, 5]} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip 
                  formatter={(value: any) => [`${value} / 5.00`, 'Rata-Rata Skor']}
                  labelFormatter={(label: any) => {
                    const item = meanScoreChartData.find(d => d.shortCode === label);
                    return item ? item.fullTitle : label;
                  }}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', color: '#0f172a', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="meanScore" name="Rata-Rata Skor" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabel Statistik Deskriptif per Indikator (Tanpa Modus) */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>Tabel Statistik Deskriptif per Indikator (Rata-Rata / Mean)</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-white border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                  <th className="p-3">Kode &amp; Pertanyaan Kuesioner</th>
                  <th className="p-3 text-center">Bagian</th>
                  <th className="p-3 text-center">Jumlah Responden</th>
                  <th className="p-3 text-center">Rata-Rata (Mean)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800 bg-white">
                {meanScoreChartData.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-semibold text-slate-900">
                      <span className="font-bold text-indigo-600 mr-2">{q.shortCode}:</span>
                      {q.fullTitle}
                    </td>
                    <td className="p-3 text-center uppercase text-[10px] font-bold">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {q.section}
                      </span>
                    </td>
                    <td className="p-3 text-center font-bold">{q.totalCount}</td>
                    <td className="p-3 text-center font-bold text-indigo-700">{q.meanScore} / 5.00</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
