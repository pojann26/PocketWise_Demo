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

      {/* Analytics Prediction Card (Matching user mockup reference) */}
      {(() => {
        const predictionCategories = ['Kosan', 'Makan', 'Kopi', 'Hiburan', 'Transport'];

        // Sum up debit transactions by category
        const categoryDebits: Record<string, number> = {};
        transactions
          .filter((tx) => tx.type === 'debit')
          .forEach((tx) => {
            categoryDebits[tx.category] = (categoryDebits[tx.category] || 0) + tx.amount;
          });

        // Extrapolate (June 1 to 12 is 12 days, so 30 days is 30/12 = 2.5 factor)
        // Kosan is a fixed monthly expense (factor = 1.0)
        // Other categories are variable (factor = 2.5)
        const predictions = predictionCategories.map((cat) => {
          const currentSum = categoryDebits[cat] || 0;
          const factor = cat === 'Kosan' ? 1.0 : 2.5;
          const predictedAmount = currentSum * factor;
          return {
            category: cat,
            amount: predictedAmount,
          };
        });

        const totalPredicted = predictions.reduce((sum, item) => sum + item.amount, 0);

        // Map predictions to percentages of total predicted spend
        const predictionData = predictions.map((item) => {
          const percentage = totalPredicted > 0 ? (item.amount / totalPredicted) * 100 : 0;
          return {
            ...item,
            percentage: Math.round(percentage),
          };
        });

        // Find max predicted amount to scale bar heights
        const maxPredictedAmount = Math.max(...predictions.map((item) => item.amount), 1);
        
        // Find highest category item to mark as active
        const highestCategory = predictions.reduce(
          (maxItem, current) => (current.amount > maxItem.amount ? current : maxItem),
          predictions[0] || { category: '', amount: 0 }
        ).category;

        return (
          <div className="bg-[#EBF7EE]/40 border border-emerald-100/30 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <h3 className="text-xs font-bold text-neutral-800">Analytics</h3>
              </div>
              <button className="text-[10px] text-neutral-400 font-bold hover:text-neutral-600 transition-colors">
                See All Analytics
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2 pt-1">
              {predictionData.map((item) => {
                const isActive = item.category === highestCategory;
                const heightPercent = Math.max((item.amount / maxPredictedAmount) * 100, 15); // min 15% height

                return (
                  <div key={item.category} className="flex flex-col items-center gap-2">
                    {/* Tall rounded pill track */}
                    <div className="w-full bg-white rounded-2xl border border-neutral-100/50 h-32 flex flex-col justify-end overflow-hidden p-1 relative shadow-inner">
                      
                      {/* Fill Bar */}
                      {isActive ? (
                        /* Solid Green Gradient Fill for active category */
                        <div
                          className="w-full rounded-xl bg-gradient-to-t from-emerald-950 via-emerald-800 to-lime-500 flex items-center justify-center transition-all duration-500 shadow-sm"
                          style={{ height: `${heightPercent}%` }}
                        >
                          <span className="text-[9px] font-black text-white leading-none">
                            {item.percentage}%
                          </span>
                        </div>
                      ) : (
                        /* Diagonal Striped Fill for other categories */
                        <div
                          className="w-full rounded-xl border border-emerald-500/10 transition-all duration-500"
                          style={{
                            height: `${heightPercent}%`,
                            backgroundColor: 'rgba(16, 185, 129, 0.03)',
                            backgroundImage: 'repeating-linear-gradient(-45deg, rgba(16, 185, 129, 0.15) 0px, rgba(16, 185, 129, 0.15) 2px, transparent 2px, transparent 8px)',
                          }}
                        />
                      )}
                    </div>
                    {/* Label */}
                    <span className="text-[8px] font-bold text-neutral-500 tracking-tight text-center leading-tight truncate w-full">
                      {item.category}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
