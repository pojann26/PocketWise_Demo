'use client';

import React, { useState } from 'react';
import { ArrowLeft, MoreHorizontal, TrendingUp, Briefcase } from 'lucide-react';
import { Transaction, UserProfile } from '@/types';

interface IncomeTabProps {
  profile: UserProfile;
  transactions: Transaction[];
  onBackToDashboard: () => void;
}

export default function IncomeTab({ profile, transactions, onBackToDashboard }: IncomeTabProps) {
  const [period, setPeriod] = useState<'1M' | 'All'>('All');

  // Format Helper
  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  // Get only credit transactions (income)
  const creditTransactions = transactions.filter((t) => t.type === 'credit');

  const totalIncome = creditTransactions.reduce((sum, tx) => sum + tx.amount, 0);

  // Divide into "Saku" (Allowance) vs "Lainnya" (Freelance/ Kerja/ Lainnya)
  const sakuIncome = creditTransactions
    .filter((tx) => tx.category === 'Saku')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const freelanceIncome = totalIncome - sakuIncome;

  const sakuPercent = totalIncome > 0 ? (sakuIncome / totalIncome) * 100 : 0;
  const freelancePercent = totalIncome > 0 ? (freelanceIncome / totalIncome) * 100 : 0;

  // Formatting large numbers for chart center (e.g. "Rp 2.0M")
  const formatCompact = (num: number) => {
    if (num >= 1000000) {
      return 'Rp ' + (num / 1000000).toFixed(1) + 'M';
    }
    return formatRupiah(num);
  };

  // Cards color list (lime, mint, purple)
  const cardStyles = [
    { bg: 'bg-[#D4FC79]', text: 'text-neutral-900', labelColor: 'text-neutral-800/60', symbol: 'S' },
    { bg: 'bg-[#A8FF78]/30 border border-[#A8FF78]/60', text: 'text-emerald-900', labelColor: 'text-emerald-800/60', symbol: 'F' },
    { bg: 'bg-indigo-100', text: 'text-indigo-900', labelColor: 'text-indigo-800/60', symbol: 'O' }
  ];

  return (
    <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 scrollbar-none pb-24">
      {/* Header */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBackToDashboard}
          className="w-10 h-10 rounded-full bg-white border border-neutral-100 shadow-sm flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-colors"
          aria-label="Kembali"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base font-extrabold text-neutral-900">Income</h2>
        <button
          className="w-10 h-10 rounded-full bg-white border border-neutral-100 shadow-sm flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-colors"
          aria-label="More Options"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Filter Period (Simulated tabs) */}
      <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-white border border-neutral-100 shadow-sm">
        <button
          onClick={() => setPeriod('1M')}
          className={`py-2 rounded-lg text-[10px] font-extrabold transition-all uppercase ${
            period === '1M'
              ? 'bg-neutral-900 text-white shadow-sm'
              : 'text-neutral-400 hover:text-neutral-700'
          }`}
        >
          Bulan Ini
        </button>
        <button
          onClick={() => setPeriod('All')}
          className={`py-2 rounded-lg text-[10px] font-extrabold transition-all uppercase ${
            period === 'All'
              ? 'bg-neutral-900 text-white shadow-sm'
              : 'text-neutral-400 hover:text-neutral-700'
          }`}
        >
          Semua Data
        </button>
      </div>

      {/* Donut Chart Container (Dark card styling matching mockup) */}
      <div className="bg-[#141414] rounded-3xl p-6 text-white shadow-xl flex flex-col items-center space-y-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />

        {/* Ring Donut Chart */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Ring Outer (conic gradient representation) */}
          <div
            className="w-44 h-44 rounded-full flex items-center justify-center shadow-lg"
            style={{
              background: `conic-gradient(#FFFFFF 0% ${sakuPercent}%, #3B82F6 ${sakuPercent}% 100%)`,
            }}
          >
            {/* Center Hole to make it a ring */}
            <div className="w-[124px] h-[124px] rounded-full bg-[#141414] flex flex-col items-center justify-center p-3 text-center border-4 border-[#141414]">
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Total Income</span>
              <span className="text-sm font-black text-white mt-1 leading-none break-all">{formatCompact(totalIncome)}</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full grid grid-cols-2 gap-4 pt-2 border-t border-neutral-800/80">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-bold uppercase">
              <span className="w-2.5 h-2.5 rounded-full bg-white block"></span>
              <span>Kiriman Saku</span>
            </div>
            <div className="text-xs font-black pl-4">
              {formatRupiah(sakuIncome)}{' '}
              <span className="text-[10px] text-neutral-500 font-medium">({Math.round(sakuPercent)}%)</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-bold uppercase">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 block"></span>
              <span>Freelance/Lain</span>
            </div>
            <div className="text-xs font-black pl-4">
              {formatRupiah(freelanceIncome)}{' '}
              <span className="text-[10px] text-neutral-500 font-medium">({Math.round(freelancePercent)}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Earnings Grid Section (Matching reference visual) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-neutral-800">Earnings</h3>
        
        {creditTransactions.length === 0 ? (
          <div className="text-center py-6 bg-white rounded-2xl border border-neutral-100 text-neutral-400 text-xs">
            Belum ada catatan pendapatan.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {creditTransactions.map((tx, idx) => {
              const cardStyle = cardStyles[idx % cardStyles.length];
              return (
                <div 
                  key={tx.id} 
                  className={`rounded-2xl p-4 shadow-sm flex flex-col justify-between min-h-[100px] transition-transform hover:scale-[1.02] ${cardStyle.bg}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="w-8 h-8 rounded-full bg-white/80 border border-neutral-100 flex items-center justify-center font-bold text-neutral-800 text-xs">
                      {cardStyle.symbol}
                    </div>
                    <span className="text-[8px] font-bold text-neutral-900 bg-white/50 px-1.5 py-0.5 rounded-full">
                      {tx.category}
                    </span>
                  </div>

                  <div className="mt-3">
                    <span className={`text-[9px] font-bold block uppercase tracking-wider ${cardStyle.labelColor}`}>
                      {tx.title}
                    </span>
                    <span className={`text-xs font-black ${cardStyle.text}`}>
                      {formatRupiah(tx.amount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Analytics Prediction Card (Monthly Forecast representation) */}
      {(() => {
        // Calculate current month's variable vs fixed expenses
        const categoryDebits: Record<string, number> = {};
        transactions
          .filter((tx) => tx.type === 'debit')
          .forEach((tx) => {
            categoryDebits[tx.category] = (categoryDebits[tx.category] || 0) + tx.amount;
          });

        // Elapsed days in current month (June 12, 2026 -> 12 elapsed days)
        const elapsedDays = 12; 
        const variableSum = (categoryDebits['Makan'] || 0) + 
                            (categoryDebits['Kopi'] || 0) + 
                            (categoryDebits['Hiburan'] || 0) + 
                            (categoryDebits['Transport'] || 0) + 
                            (categoryDebits['Lainnya'] || 0);

        const fixedSum = categoryDebits['Kosan'] || 0; // kosan is fixed monthly

        // Predicted spending for current month (extrapolated)
        const variableProjected = variableSum * (30 / elapsedDays);
        const totalProjected = fixedSum + variableProjected;

        // Current month's spending percentage of monthly allowance (budget base = 2.000.000)
        const allowance = profile.monthlyAllowance || 2000000;
        const currentMonthPercent = Math.round((totalProjected / allowance) * 100) || 90;

        // Generate 5 forecast months starting from current month (June 2026)
        const baseDate = new Date('2026-06-12');
        const monthOffsets = [0, -8, 12, -15, -5]; // Jun (current), Jul (hemat), Agt (boros), Sep (hemat), Okt (normal)

        const forecastData = Array.from({ length: 5 }).map((_, index) => {
          const d = new Date(baseDate);
          d.setMonth(baseDate.getMonth() + index);
          
          const offset = monthOffsets[index];
          let projectedPercent = currentMonthPercent + offset;
          
          // Clamp percentage for display aesthetics
          projectedPercent = Math.max(15, Math.min(150, projectedPercent));
          const isSaving = projectedPercent <= 100; // <= 100% of allowance is hemat (Green), > 100% is boros (Red)

          return {
            name: d.toLocaleDateString('id-ID', { month: 'short' }), // "Jun", "Jul", dll
            percentage: projectedPercent,
            isSaving,
          };
        });

        // Find max percentage to scale visual heights
        const maxPercent = Math.max(...forecastData.map((d) => d.percentage), 100);

        return (
          <div className="bg-[#EBF7EE]/40 border border-emerald-100/30 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <h3 className="text-xs font-bold text-neutral-800">Prediksi Pengeluaran Bulanan</h3>
              </div>
              <div className="flex items-center gap-2 text-[9px] font-bold">
                <span className="flex items-center gap-1 text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Hemat
                </span>
                <span className="flex items-center gap-1 text-red-600">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span> Boros
                </span>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2.5 pt-1">
              {forecastData.map((item, index) => {
                const isActive = index === 0; // Current month (Juni) stands out as solid
                const heightPercent = Math.max((item.percentage / maxPercent) * 100, 15);

                return (
                  <div key={item.name} className="flex flex-col items-center gap-2">
                    {/* Tall rounded pill track */}
                    <div className="w-full bg-white rounded-2xl border border-neutral-100/50 h-32 flex flex-col justify-end overflow-hidden p-1 relative shadow-inner">
                      
                      {/* Fill Bar */}
                      {isActive ? (
                        /* Solid Gradient Fill for current month */
                        <div
                          className="w-full rounded-xl transition-all duration-500 shadow-sm"
                          style={{
                            height: `${heightPercent}%`,
                            background: item.isSaving
                              ? 'linear-gradient(to top, #065f46, #059669, #34d399)'
                              : 'linear-gradient(to top, #991b1b, #dc2626, #f87171)'
                          }}
                        />
                      ) : (
                        /* Striped Hatching Fill for future predicted months */
                        <div
                          className="w-full rounded-xl border border-neutral-100/30 transition-all duration-500"
                          style={{
                            height: `${heightPercent}%`,
                            backgroundColor: item.isSaving ? 'rgba(16, 185, 129, 0.02)' : 'rgba(239, 68, 68, 0.02)',
                            backgroundImage: item.isSaving
                              ? 'repeating-linear-gradient(-45deg, rgba(16, 185, 129, 0.18) 0px, rgba(16, 185, 129, 0.18) 2px, transparent 2px, transparent 8px)'
                              : 'repeating-linear-gradient(-45deg, rgba(239, 68, 68, 0.18) 0px, rgba(239, 68, 68, 0.18) 2px, transparent 2px, transparent 8px)',
                          }}
                        />
                      )}

                      {/* Percentage Overlay (Centering text in the track context for absolute readability) */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                        <span className={`text-[9px] font-black ${
                          isActive 
                            ? 'text-white drop-shadow-sm' 
                            : item.isSaving 
                              ? 'text-emerald-700 font-bold' 
                              : 'text-red-600 font-bold'
                        }`}>
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                    
                    {/* Label with dynamic active bullet indicator */}
                    <span className={`text-[9px] font-extrabold flex items-center gap-0.5 ${
                      isActive ? 'text-neutral-900 font-black' : 'text-neutral-400'
                    }`}>
                      {item.name}
                      {isActive && <span className="w-1 h-1 rounded-full bg-neutral-950"></span>}
                    </span>
                  </div>
                );
              })}
            </div>
            
            <p className="text-[9px] text-neutral-500 leading-relaxed italic text-center pt-1 border-t border-neutral-100/80">
              *Prediksi dalam persen terhadap uang saku bulanan kamu ({formatCompact(allowance)}).
            </p>
          </div>
        );
      })()}
    </div>
  );
}
