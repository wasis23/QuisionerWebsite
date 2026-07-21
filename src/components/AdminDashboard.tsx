import React, { useState, useMemo } from 'react';
import { 
  Question, 
  ResponseItem, 
  JournalMetadata
} from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  BarChart3, 
  Users, 
  Star, 
  Filter, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Copy, 
  FileSpreadsheet, 
  Settings, 
  TrendingUp, 
  PieChart as PieChartIcon, 
  Eye,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

interface AdminDashboardProps {
  journal: JournalMetadata;
  setJournal: React.Dispatch<React.SetStateAction<JournalMetadata>>;
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  responses: ResponseItem[];
  setResponses: React.Dispatch<React.SetStateAction<ResponseItem[]>>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  journal,
  setJournal,
  questions,
  setQuestions,
  responses,
  setResponses,
}) => {
  const [adminTab, setAdminTab] = useState<'analytics' | 'form-builder' | 'journal-settings' | 'responses'>('analytics');
  
  // Filter States
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form Builder Edit Modal State
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isNewQuestionModalOpen, setIsNewQuestionModalOpen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Response detail modal
  const [selectedResponseDetail, setSelectedResponseDetail] = useState<ResponseItem | null>(null);

  // Filtered Responses (Combined Data Pool)
  const filteredResponses = useMemo(() => {
    return responses.filter((resp) => {
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const nameMatch = resp.respondent.name?.toLowerCase().includes(q);
        const occMatch = resp.respondent.occupation?.toLowerCase().includes(q);
        const eduMatch = resp.respondent.education?.toLowerCase().includes(q);
        if (!nameMatch && !occMatch && !eduMatch) {
          return false;
        }
      }
      return true;
    });
  }, [responses, searchQuery]);

  // Overall Statistics Calculation
  const totalRespondents = filteredResponses.length;

  // Calculate Overall Average Star / Scale Rating across all rating questions
  const overallMeanScore = useMemo(() => {
    let sum = 0;
    let count = 0;
    filteredResponses.forEach((resp) => {
      Object.entries(resp.answers).forEach(([_, val]) => {
        if (typeof val === 'number') {
          sum += val;
          count += 1;
        }
      });
    });
    return count > 0 ? (sum / count).toFixed(2) : '0.00';
  }, [filteredResponses]);

  // Star Rating Breakdown data for Donut Chart
  const starRatingData = useMemo(() => {
    const starCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    filteredResponses.forEach((r) => {
      const overallStar = r.answers['q_r4'];
      if (typeof overallStar === 'number' && overallStar >= 1 && overallStar <= 5) {
        starCounts[overallStar as 1|2|3|4|5] += 1;
      }
    });

    return [
      { name: '1 Bintang ⭐', value: starCounts[1], color: '#ef4444' },
      { name: '2 Bintang ⭐⭐', value: starCounts[2], color: '#f97316' },
      { name: '3 Bintang ⭐⭐⭐', value: starCounts[3], color: '#eab308' },
      { name: '4 Bintang ⭐⭐⭐⭐', value: starCounts[4], color: '#3b82f6' },
      { name: '5 Bintang ⭐⭐⭐⭐⭐', value: starCounts[5], color: '#10b981' },
    ];
  }, [filteredResponses]);

  // Chart Data: All Questions Mean Score Comparison
  const meanScoreChartData = useMemo(() => {
    const ratingQuestions = questions.filter((q) => q.type !== 'text');
    return ratingQuestions.map((q, idx) => {
      let sum = 0;
      let count = 0;
      filteredResponses.forEach((resp) => {
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
  }, [questions, filteredResponses]);

  // Chart Data: Single Selected Question Rating Breakdown (1-5)
  const singleQuestionBreakdownData = useMemo(() => {
    if (selectedQuestionId === 'all') return [];

    const q = questions.find((item) => item.id === selectedQuestionId);
    if (!q) return [];

    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    filteredResponses.forEach((resp) => {
      const val = resp.answers[q.id];
      if (typeof val === 'number' && val >= 1 && val <= 5) {
        counts[val as 1|2|3|4|5] += 1;
      }
    });

    return [
      { scoreName: 'Skala 1 (Sangat Rendah)', count: counts[1], fill: '#ef4444' },
      { scoreName: 'Skala 2 (Rendah)', count: counts[2], fill: '#f97316' },
      { scoreName: 'Skala 3 (Cukup)', count: counts[3], fill: '#eab308' },
      { scoreName: 'Skala 4 (Tinggi)', count: counts[4], fill: '#3b82f6' },
      { scoreName: 'Skala 5 (Sangat Tinggi)', count: counts[5], fill: '#10b981' },
    ];
  }, [questions, filteredResponses, selectedQuestionId]);

  // Per-Question Table Statistical Dataset
  const questionsAnalyticsData = useMemo(() => {
    return questions.filter((q) => q.type !== 'text').map((q) => {
      let totalSum = 0;
      let totalCount = 0;

      filteredResponses.forEach((resp) => {
        const val = resp.answers[q.id];
        if (typeof val === 'number' && val >= 1 && val <= 5) {
          totalSum += val;
          totalCount += 1;
        }
      });

      const meanScore = totalCount > 0 ? (totalSum / totalCount).toFixed(2) : '0.00';

      return {
        id: q.id,
        fullTitle: q.text,
        section: q.section,
        meanScore,
        totalCount,
      };
    });
  }, [questions, filteredResponses]);

  // Export to CSV Functionality
  const exportToCSV = () => {
    if (responses.length === 0) {
      alert('Belum ada data tanggapan untuk diekspor!');
      return;
    }

    const headers = [
      'ID Tanggapan',
      'Waktu',
      'Nama Responden',
      'Jenis Kelamin',
      'Usia',
      'Pendidikan',
      'Pekerjaan',
      'Durasi (Detik)',
      ...questions.map((q) => `"${q.text.replace(/"/g, '""')}"`),
    ];

    const rows = responses.map((r) => {
      const answersRow = questions.map((q) => {
        const val = r.answers[q.id];
        if (val === undefined || val === null) return '""';
        return `"${String(val).replace(/"/g, '""')}"`;
      });

      return [
        r.id,
        r.timestamp,
        `"${(r.respondent.name || 'Anonim').replace(/"/g, '""')}"`,
        `"${r.respondent.gender}"`,
        `"${r.respondent.age}"`,
        `"${r.respondent.education}"`,
        `"${r.respondent.occupation.replace(/"/g, '""')}"`,
        r.timeSpentSeconds || 0,
        ...answersRow,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Hasil_Kuesioner_Jurnal_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyShareableLink = () => {
    const url = window.location.origin + window.location.pathname;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const activeQuestionText = useMemo(() => {
    if (selectedQuestionId === 'all') return null;
    const found = questions.find(q => q.id === selectedQuestionId);
    return found ? found.text : null;
  }, [selectedQuestionId, questions]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      
      {/* Top Header / Sub-Nav */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">
            
            {/* Title & Badge */}
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  ADMIN PORTAL
                </span>
                <span className="text-xs text-slate-500 font-medium">Dashboard Analisis Terpadu</span>
              </div>
              <h1 className="text-xl font-extrabold text-slate-900 mt-1">
                Panel Manajemen &amp; Statistik Kuesioner Jurnal
              </h1>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={copyShareableLink}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all shadow-xs"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                <span>{copiedLink ? 'Link Tersalin!' : 'Bagikan Kuesioner'}</span>
              </button>

              <button
                onClick={exportToCSV}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Ekspor Data (CSV)</span>
              </button>
            </div>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="flex space-x-1 overflow-x-auto border-t border-slate-200 pt-2 pb-1">
            <button
              onClick={() => setAdminTab('analytics')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                adminTab === 'analytics'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analitik &amp; Visualisasi Grafik</span>
            </button>

            <button
              onClick={() => setAdminTab('responses')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                adminTab === 'responses'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Tabel Tanggapan ({responses.length})</span>
            </button>

            <button
              onClick={() => setAdminTab('form-builder')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                adminTab === 'form-builder'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>Kelola Pertanyaan Kuesioner</span>
            </button>

            <button
              onClick={() => setAdminTab('journal-settings')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                adminTab === 'journal-settings'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Pengaturan Jurnal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

        {/* TAB 1: ANALYTICS & CHARTS */}
        {adminTab === 'analytics' && (
          <div className="space-y-6">
            
            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Total Respondents Card */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Responden</p>
                  <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{totalRespondents}</h3>
                  <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center">
                    <TrendingUp className="w-3.5 h-3.5 mr-1" /> Tanggapan Terverifikasi
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              {/* Overall Average Score Card */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Rata-Rata Skala Evaluasi</p>
                  <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{overallMeanScore} <span className="text-sm font-semibold text-slate-400">/ 5.00</span></h3>
                  <p className="text-xs text-indigo-600 font-semibold mt-1">Skor Gabungan Seluruh Responden</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
                  <Star className="w-6 h-6" />
                </div>
              </div>

              {/* Questionnaire Status Card */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between sm:col-span-2 lg:col-span-1">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Status Kuesioner Publik</p>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-1 flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${journal.isOpen ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                    {journal.isOpen ? 'Aktif (Menerima Isian)' : 'Ditutup'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Bisa diatur melalui Pengaturan Jurnal</p>
                </div>
                <button
                  onClick={() => setJournal((prev) => ({ ...prev, isOpen: !prev.isOpen }))}
                  className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors"
                  title="Toggle Status"
                >
                  {journal.isOpen ? <ToggleRight className="w-6 h-6 text-emerald-600" /> : <ToggleLeft className="w-6 h-6 text-slate-400" />}
                </button>
              </div>

            </div>

            {/* Filter & Controls Bar */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-700">Filter Grafik Pertanyaan:</span>
                
                <select
                  value={selectedQuestionId}
                  onChange={(e) => setSelectedQuestionId(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:border-indigo-600 max-w-xs sm:max-w-md truncate"
                >
                  <option value="all">📊 Ringkasan Rata-Rata Semua Pertanyaan</option>
                  {questions.filter(q => q.type !== 'text').map((q, i) => (
                    <option key={q.id} value={q.id}>Q{i + 1}: {q.text}</option>
                  ))}
                </select>
              </div>

              <div className="text-xs text-slate-500 font-medium">
                Menampilkan data gabungan dari <strong>{totalRespondents}</strong> responden.
              </div>
            </div>

            {/* Charts Grid Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Main Bar Chart */}
              <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                    <span>
                      {selectedQuestionId === 'all'
                        ? 'Rata-Rata Skor per Indikator Pertanyaan (Skala 1.0 - 5.0)'
                        : `Distribusi Frekuensi Jawaban: ${activeQuestionText}`}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedQuestionId === 'all'
                      ? 'Perbandingan nilai mean skor rata-rata dari seluruh responden untuk setiap indikator.'
                      : 'Frekuensi pemilih angka skala 1 (Sangat Rendah) hingga 5 (Sangat Tinggi) untuk indikator ini.'}
                  </p>
                </div>

                <div className="h-80 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    {selectedQuestionId === 'all' ? (
                      /* Overview Chart: Mean score per question */
                      <BarChart data={meanScoreChartData} margin={{ top: 20, right: 20, left: -20, bottom: 25 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="shortCode" tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }} />
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
                    ) : (
                      /* Detailed Breakdown Chart for Single Question */
                      <BarChart data={singleQuestionBreakdownData} margin={{ top: 20, right: 20, left: -20, bottom: 25 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="scoreName" tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} />
                        <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                        <Tooltip 
                          formatter={(value: any) => [`${value} Responden`, 'Jumlah Responden']}
                          contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', color: '#0f172a', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Bar dataKey="count" name="Jumlah Responden" radius={[6, 6, 0, 0]}>
                          {singleQuestionBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Overall Star Rating Donut Chart */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                    <PieChartIcon className="w-5 h-5 text-amber-500" />
                    <span>Proporsi Overall Star Rating</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Persentase penilaian rating bintang akhir dari responden.
                  </p>
                </div>

                <div className="h-64 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={starRatingData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {starRatingData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', color: '#0f172a', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {starRatingData.map((d) => (
                    <div key={d.name} className="flex items-center space-x-1.5 p-1.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></span>
                      <span className="text-slate-700 font-semibold truncate">{d.name}:</span>
                      <strong className="text-slate-900 ml-auto">{d.value}</strong>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Mean Statistical Metrics Table (Without Mode) */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span>Tabel Statistik Deskriptif per Indikator (Rata-Rata / Mean)</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                      <th className="p-3">Kode &amp; Pertanyaan Kuesioner</th>
                      <th className="p-3 text-center">Bagian</th>
                      <th className="p-3 text-center">Jumlah Responden</th>
                      <th className="p-3 text-center">Rata-Rata (Mean)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                    {questionsAnalyticsData.map((q, i) => (
                      <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-semibold text-slate-900">
                          <span className="font-bold text-indigo-600 mr-2">Q{i + 1}:</span>
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
        )}

        {/* TAB 2: RESPONSES TABLE */}
        {adminTab === 'responses' && (
          <div className="space-y-4">
            
            {/* Search Bar */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari berdasarkan nama, pekerjaan..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-indigo-600 font-medium"
                />
              </div>

              <div className="text-xs text-slate-500 font-medium">
                Total Tanggapan: <strong>{filteredResponses.length}</strong>
              </div>
            </div>

            {/* Responses List Table */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs overflow-x-auto">
              {filteredResponses.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-sm">
                  Belum ada tanggapan responden yang cocok dengan pencarian.
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                      <th className="p-3">Waktu</th>
                      <th className="p-3">Nama Responden</th>
                      <th className="p-3">Jenis Kelamin</th>
                      <th className="p-3">Usia</th>
                      <th className="p-3">Pendidikan</th>
                      <th className="p-3">Pekerjaan</th>
                      <th className="p-3 text-center">Overall Rating</th>
                      <th className="p-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                    {filteredResponses.map((resp) => (
                      <tr key={resp.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 text-slate-500 whitespace-nowrap">
                          {new Date(resp.timestamp).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                        </td>
                        <td className="p-3 font-bold text-slate-900">{resp.respondent.name || 'Anonim'}</td>
                        <td className="p-3">{resp.respondent.gender}</td>
                        <td className="p-3">{resp.respondent.age}</td>
                        <td className="p-3">{resp.respondent.education}</td>
                        <td className="p-3">{resp.respondent.occupation}</td>
                        <td className="p-3 text-center font-bold text-amber-600">
                          {resp.answers['q_r4'] ? `⭐ ${resp.answers['q_r4']}/5` : '-'}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => setSelectedResponseDetail(resp)}
                            className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors"
                            title="Lihat Detail Jawaban"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: FORM BUILDER */}
        {adminTab === 'form-builder' && (
          <div className="space-y-4">
            
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex justify-between items-center">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Kelola Pertanyaan Kuesioner</h3>
                <p className="text-xs text-slate-500 font-medium">Tambah, edit, atau sesuaikan pertanyaan kuesioner.</p>
              </div>

              <button
                onClick={() => {
                  setEditingQuestion({
                    id: `q_${Date.now()}`,
                    section: 'knowledge',
                    type: 'comprehension',
                    text: '',
                    required: true,
                  });
                  setIsNewQuestionModalOpen(true);
                }}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Pertanyaan</span>
              </button>
            </div>

            <div className="space-y-3">
              {questions.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {q.section}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">Tipe: {q.type}</span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900">{q.text}</p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => {
                        setEditingQuestion(q);
                        setIsNewQuestionModalOpen(true);
                      }}
                      className="p-2 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-colors"
                      title="Edit Pertanyaan"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm('Apakah Anda yakin ingin menghapus pertanyaan ini?')) {
                          setQuestions((prev) => prev.filter((item) => item.id !== q.id));
                        }
                      }}
                      className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition-colors"
                      title="Hapus Pertanyaan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 4: JOURNAL SETTINGS */}
        {adminTab === 'journal-settings' && (
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 max-w-3xl">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Pengaturan Metadata Jurnal</h3>
              <p className="text-xs text-slate-500 font-medium">Ubah judul, penulis, dan lokasi file PDF jurnal.</p>
            </div>

            <div className="space-y-4 text-xs font-bold text-slate-700">
              
              <div className="space-y-1">
                <label>Judul Artikel Jurnal</label>
                <input
                  type="text"
                  value={journal.title}
                  onChange={(e) => setJournal({ ...journal, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium text-sm focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="space-y-1">
                <label>Penulis (Authors)</label>
                <input
                  type="text"
                  value={journal.authors}
                  onChange={(e) => setJournal({ ...journal, authors: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium text-sm focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label>Path PDF Bahasa Indonesia</label>
                  <input
                    type="text"
                    value={journal.pdfPathId}
                    onChange={(e) => setJournal({ ...journal, pdfPathId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium text-sm focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="space-y-1">
                  <label>Path PDF English Version</label>
                  <input
                    type="text"
                    value={journal.pdfPathEn}
                    onChange={(e) => setJournal({ ...journal, pdfPathEn: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium text-sm focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => alert('Pengaturan metadata jurnal berhasil disimpan!')}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-sm"
                >
                  Simpan Perubahan Metadata
                </button>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* EDIT/NEW QUESTION MODAL */}
      {isNewQuestionModalOpen && editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Form Pertanyaan Kuesioner</h3>
              <button onClick={() => setIsNewQuestionModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Teks Pertanyaan</label>
                <input
                  type="text"
                  value={editingQuestion.text}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, text: e.target.value })}
                  placeholder="Masukkan teks pertanyaan..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Bagian (Section)</label>
                  <select
                    value={editingQuestion.section}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, section: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium"
                  >
                    <option value="knowledge">Pengetahuan</option>
                    <option value="evaluation">Penilaian</option>
                    <option value="review">Review Terbuka</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Tipe Skala</label>
                  <select
                    value={editingQuestion.type}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium"
                  >
                    <option value="comprehension">Skala Pemahaman (1-5)</option>
                    <option value="readability">Skala Keterbacaan (1-5)</option>
                    <option value="star">Star Rating (⭐ 1-5)</option>
                    <option value="text">Teks Bebas</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setIsNewQuestionModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-600 hover:bg-slate-200"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setQuestions((prev) => {
                    const idx = prev.findIndex(q => q.id === editingQuestion.id);
                    if (idx >= 0) {
                      const updated = [...prev];
                      updated[idx] = editingQuestion;
                      return updated;
                    }
                    return [...prev, editingQuestion];
                  });
                  setIsNewQuestionModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-xs"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESPONSE DETAIL MODAL */}
      {selectedResponseDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-2xl w-full space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Detail Tanggapan Responden</h3>
              <button onClick={() => setSelectedResponseDetail(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-800">
              <p><strong>Nama:</strong> {selectedResponseDetail.respondent.name || 'Anonim'}</p>
              <p><strong>Pekerjaan:</strong> {selectedResponseDetail.respondent.occupation}</p>
              <p><strong>Pendidikan:</strong> {selectedResponseDetail.respondent.education}</p>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-indigo-700">Daftar Jawaban:</h4>
              {questions.map((q) => (
                <div key={q.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <p className="font-semibold text-slate-800">{q.text}</p>
                  <p className="text-amber-700 font-bold">
                    Jawaban: {selectedResponseDetail.answers[q.id] || '-'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
