'use client';

import React from 'react';
import { Sparkles, RefreshCw, AlertCircle, Bot } from 'lucide-react';

interface InsightCardProps {
  insight: string;
  loading: boolean;
  isMock: boolean;
  onRefresh: () => void;
  error?: string;
}

export default function InsightCard({ insight, loading, isMock, onRefresh, error }: InsightCardProps) {
  return (
    <div className="w-full relative overflow-hidden rounded-3xl bg-neutral-900 border border-neutral-800 p-5 shadow-xl text-white transition-all duration-300">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-lime-400/20 rounded-full blur-xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-6 -mb-6 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-lime-400/20 text-lime-400">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold text-sm leading-tight text-neutral-100">Smart Financial Advisor</h3>
            <span className="text-[10px] text-neutral-400">Powered by Gemini AI</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
            isMock 
              ? 'bg-neutral-800 text-neutral-400 border border-neutral-700' 
              : 'bg-lime-900/30 text-lime-400 border border-lime-800/50'
          }`}>
            {isMock ? 'Simulasi' : 'Live AI'}
          </span>

          {/* Refresh Action */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700/50 text-neutral-300 transition-colors disabled:opacity-50"
            title="Analisis ulang"
            aria-label="Refresh AI Insight"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-lime-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="relative z-10 text-xs text-neutral-200 leading-relaxed min-h-[48px] flex items-center">
        {loading ? (
          <div className="w-full space-y-2 py-1">
            <div className="h-3.5 bg-neutral-800 rounded-md w-11/12 animate-pulse" />
            <div className="h-3.5 bg-neutral-800 rounded-md w-full animate-pulse" />
            <div className="h-3.5 bg-neutral-800 rounded-md w-3/4 animate-pulse" />
          </div>
        ) : error ? (
          <div className="flex gap-2 items-start text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-300">Gagal memuat rekomendasi</p>
              <p className="text-[10px] text-red-400/80">{error}</p>
            </div>
          </div>
        ) : (
          <p className="font-medium italic text-neutral-200">
            &ldquo;{insight || "Belum ada analisis. Tekan tombol refresh untuk meminta rekomendasi dari AI."}&rdquo;
          </p>
        )}
      </div>

      {/* Hint for setting API key if in simulated mode */}
      {isMock && !loading && !error && (
        <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-center gap-1.5 text-[9px] text-neutral-500">
          <Bot className="w-3 h-3" />
          <span>Atur Gemini API Key di tab Settings untuk beralih ke analisis langsung.</span>
        </div>
      )}
    </div>
  );
}
