'use client';

import React, { useState } from 'react';
import { Search, MoreHorizontal, ArrowLeft, TrendingDown } from 'lucide-react';
import { Transaction, UserProfile } from '@/types';

interface SpendingTabProps {
  profile: UserProfile;
  transactions: Transaction[];
  onBackToDashboard: () => void;
}

type FilterPeriod = '1D' | '1W' | '1M' | 'All';

export default function SpendingTab({ profile, transactions, onBackToDashboard }: SpendingTabProps) {
  const [period, setPeriod] = useState<FilterPeriod>('1M');
  const [searchQuery, setSearchQuery] = useState('');

  // Format Helper
  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  // Get only debit transactions (expenses)
  const debitTransactions = transactions.filter((t) => t.type === 'debit');

  // Filter based on selected time period (relative to mock "today" June 12, 2026)
  const baseDate = new Date('2026-06-12');
  const filteredByPeriod = debitTransactions.filter((tx) => {
    const txDate = new Date(tx.date);
    const diffTime = baseDate.getTime() - txDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (period === '1D') return diffDays <= 1;
    if (period === '1W') return diffDays <= 7;
    if (period === '1M') return diffDays <= 30;
    return true; // 'All'
  });

  // Filter based on search query
  const finalTransactions = filteredByPeriod.filter(
    (tx) =>
      tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate category breakdowns
  const categoryTotals: Record<string, number> = {};
  let totalSpending = 0;

  finalTransactions.forEach((tx) => {
    categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
    totalSpending += tx.amount;
  });

  const categoryBreakdown = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalSpending > 0 ? (amount / totalSpending) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  // Category Color Map
  const categoryColors: Record<string, { bg: string; text: string; barBg: string }> = {
    Kopi: { bg: 'bg-amber-100', text: 'text-amber-700', barBg: 'bg-amber-500' },
    Makan: { bg: 'bg-teal-100', text: 'text-teal-700', barBg: 'bg-teal-500' },
    Kosan: { bg: 'bg-purple-100', text: 'text-purple-700', barBg: 'bg-purple-500' },
    Hiburan: { bg: 'bg-indigo-100', text: 'text-indigo-700', barBg: 'bg-indigo-500' },
    Transport: { bg: 'bg-orange-100', text: 'text-orange-700', barBg: 'bg-orange-500' },
    Lainnya: { bg: 'bg-neutral-100', text: 'text-neutral-700', barBg: 'bg-neutral-500' },
  };

  const getColors = (cat: string) => {
    return categoryColors[cat] || categoryColors.Lainnya;
  };

  // Avatar pastel background picker for items
  const colorsList = [
    'bg-rose-100 text-rose-700',
    'bg-violet-100 text-violet-700',
    'bg-sky-100 text-sky-700',
    'bg-amber-100 text-amber-700',
    'bg-emerald-100 text-emerald-700',
  ];

  const getAvatarColors = (index: number) => {
    return colorsList[index % colorsList.length];
  };

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
        <h2 className="text-base font-extrabold text-neutral-900">Spending</h2>
        <button
          className="w-10 h-10 rounded-full bg-white border border-neutral-100 shadow-sm flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-colors"
          aria-label="More"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Mini Balance Card */}
      <div className="w-full bg-[#D4FC79] rounded-2xl p-5 shadow-md flex justify-between items-center">
        <div>
          <span className="text-[10px] font-bold text-neutral-800/60 uppercase tracking-wider block">Account Balance</span>
          <span className="text-xl font-black text-neutral-900 tracking-tight">{formatRupiah(profile.balance)}</span>
        </div>
        <div className="w-9 h-9 rounded-full bg-white/40 flex items-center justify-center text-neutral-800">
          <TrendingDown className="w-5 h-5" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-white border border-neutral-100 shadow-sm">
        {(['1D', '1W', '1M', 'All'] as FilterPeriod[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setPeriod(tab)}
            className={`py-2 rounded-lg text-[10px] font-extrabold transition-all uppercase ${
              period === tab
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Visual Analytics Card */}
      <div className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-neutral-800">Analisis Kategori</h3>
        
        {categoryBreakdown.length === 0 ? (
          <div className="text-center py-6 text-neutral-400 text-xs">
            Tidak ada data pengeluaran untuk periode ini.
          </div>
        ) : (
          <div className="space-y-4">
            {categoryBreakdown.map(({ category: cat, amount, percentage }) => {
              const theme = getColors(cat);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${theme.bg} ${theme.text}`}>
                      {cat}
                    </span>
                    <div className="font-extrabold text-neutral-700">
                      {formatRupiah(amount)}{' '}
                      <span className="text-neutral-400 text-[10px] font-medium">({Math.round(percentage)}%)</span>
                    </div>
                  </div>
                  {/* Custom Progress Bar */}
                  <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${theme.barBg} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Activity List Container (Dark styled matching design) */}
      <div className="bg-[#141414] rounded-3xl p-5 text-white shadow-xl space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-neutral-200">History</h3>
          {/* Search bar inside */}
          <div className="relative">
            <input
              type="text"
              placeholder="Cari..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-28 pl-7 pr-2.5 py-1.5 rounded-full bg-neutral-800 border border-neutral-700 focus:outline-none focus:w-36 text-[10px] font-semibold text-neutral-200 placeholder-neutral-500 transition-all"
            />
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2" />
          </div>
        </div>

        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
          {finalTransactions.length === 0 ? (
            <div className="text-center py-6 text-neutral-500 text-xs">
              Tidak ada pengeluaran ditemukan.
            </div>
          ) : (
            finalTransactions.map((tx, idx) => (
              <div key={tx.id} className="flex justify-between items-center group">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs uppercase shrink-0 ${getAvatarColors(idx)}`}>
                    {tx.title.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-200 group-hover:text-white transition-colors">{tx.title}</h4>
                    <span className="text-[9px] text-neutral-400 block mt-0.5">
                      {new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} • {tx.category}
                    </span>
                  </div>
                </div>
                <div className="text-xs font-black text-neutral-200">
                  -{formatRupiah(tx.amount)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
