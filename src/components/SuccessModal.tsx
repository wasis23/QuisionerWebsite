import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';
import { ResponseItem } from '../types';

interface SuccessModalProps {
  response: ResponseItem;
  onReset: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ response, onReset }) => {
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 text-center">
        
        {/* Animated Check Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/25 ring-4 ring-emerald-100 animate-bounce">
          <CheckCircle2 className="w-9 h-9 text-white" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tanggapan Terverifikasi &amp; Tersimpan</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Terima Kasih atas Partisipasi Anda!
          </h2>
          <p className="text-sm text-slate-600 font-medium">
            Ulasan dan nilai evaluasi Anda untuk artikel jurnal ilmiah ini telah berhasil dicatat ke dalam database penelitian.
          </p>
        </div>

        {/* Response Summary Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs text-slate-700 font-medium">
          <div className="flex justify-between">
            <span className="text-slate-500">Identitas Responden:</span>
            <span className="font-bold text-slate-900">{response.respondent.name || 'Anonim'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Pekerjaan:</span>
            <span className="font-bold text-slate-900">{response.respondent.occupation}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Rating Keseluruhan:</span>
            <span className="font-bold text-amber-600">
              {'⭐'.repeat(Number(response.answers.q_r4) || 5)} ({response.answers.q_r4}/5)
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onReset}
            className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Isi Kuesioner Baru</span>
          </button>
        </div>

      </div>
    </div>
  );
};
