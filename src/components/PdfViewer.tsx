import React, { useState, useRef } from 'react';
import { 
  Globe, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  ExternalLink, 
  FileText, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';
import { JournalMetadata } from '../types';

interface PdfViewerProps {
  journal: JournalMetadata;
  currentLanguage: 'id' | 'en';
  onLanguageChange: (lang: 'id' | 'en') => void;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  journal,
  currentLanguage,
  onLanguageChange,
}) => {
  const [zoom, setZoom] = useState<number>(100);
  const containerRef = useRef<HTMLDivElement>(null);

  const activePdfUrl = currentLanguage === 'id' ? journal.pdfPathId : journal.pdfPathEn;
  const activePdfTitle = currentLanguage === 'id' 
    ? 'Naskah Jurnal Versi Bahasa Indonesia' 
    : 'English Journal Manuscript Version';

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 15, 175));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 15, 75));
  const handleResetZoom = () => setZoom(100);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error('Fullscreen error:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div 
      ref={containerRef}
      className="flex flex-col h-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-lg"
    >
      {/* Top Controls & Language Switcher Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Language Selector Tabs */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Bahasa Naskah:</span>
          </span>

          <div className="flex bg-slate-200/70 p-1 rounded-xl border border-slate-200 shadow-inner">
            <button
              onClick={() => onLanguageChange('id')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentLanguage === 'id'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/50'
              }`}
            >
              <span className="text-base">🇮🇩</span>
              <span>Bahasa Indonesia</span>
              {currentLanguage === 'id' && <CheckCircle2 className="w-3.5 h-3.5 text-white ml-1" />}
            </button>

            <button
              onClick={() => onLanguageChange('en')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentLanguage === 'en'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/50'
              }`}
            >
              <span className="text-base">🇬🇧</span>
              <span>English Version</span>
              {currentLanguage === 'en' && <CheckCircle2 className="w-3.5 h-3.5 text-white ml-1" />}
            </button>
          </div>
        </div>

        {/* Right: PDF Reader Tools (Zoom, Reset, Fullscreen, Download) */}
        <div className="flex items-center space-x-1.5">
          <div className="flex items-center bg-white px-2 py-1 rounded-lg border border-slate-200 text-slate-700 text-xs shadow-sm">
            <button 
              onClick={handleZoomOut}
              className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
              title="Perkecil (Zoom Out)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono font-bold text-indigo-600 min-w-[42px] text-center">
              {zoom}%
            </span>
            <button 
              onClick={handleZoomIn}
              className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
              title="Perbesar (Zoom In)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={handleResetZoom}
              className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors ml-1 border-l border-slate-200 pl-1.5"
              title="Reset Zoom 100%"
            >
              <RotateCcw className="w-3 h-3 text-slate-500" />
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-white text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-100 transition-colors shadow-sm"
            title="Layar Penuh (Fullscreen)"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <a
            href={activePdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors text-xs font-semibold shadow-sm"
            title="Buka PDF di Tab Baru"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Buka PDF</span>
          </a>
        </div>
      </div>

      {/* Journal Information Banner */}
      <div className="bg-slate-100/70 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center space-x-2 truncate">
          <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span className="font-bold text-slate-800 truncate">{activePdfTitle}</span>
          <span className="text-slate-400">•</span>
          <span className="truncate hidden md:inline">{journal.authors}</span>
        </div>
        <div className="shrink-0 text-[11px] bg-white px-2 py-0.5 rounded text-indigo-700 border border-slate-200 font-semibold shadow-2xs">
          PDF Reader
        </div>
      </div>

      {/* PDF Main Render Viewport */}
      <div className="relative flex-1 bg-slate-200/50 overflow-auto flex items-center justify-center p-2">
        <div 
          className="w-full h-full min-h-[550px] transition-all duration-200"
          style={{
            transform: zoom !== 100 ? `scale(${zoom / 100})` : 'none',
            transformOrigin: 'top center'
          }}
        >
          <iframe
            key={activePdfUrl}
            src={`${activePdfUrl}#toolbar=1&navpanes=0&view=FitH`}
            className="w-full h-full min-h-[600px] border-0 rounded-xl shadow-md bg-white"
            title={activePdfTitle}
          />
        </div>
      </div>

      {/* Footer Info Bar */}
      <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 flex items-center justify-between text-[11px] text-slate-600">
        <div className="flex items-center space-x-1.5">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Membaca artikel sambil mengisi kuesioner di sebelah kanan</span>
        </div>
        <div>
          <span>Versi Aktif: <strong className="text-slate-900 uppercase font-bold">{currentLanguage}</strong></span>
        </div>
      </div>
    </div>
  );
};
