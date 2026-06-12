'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, ArrowUpRight, ArrowDownRight, Plus, X, Calendar, DollarSign, Wallet } from 'lucide-react';
import { Transaction, UserProfile } from '@/types';
import InsightCard from './InsightCard';

interface DashboardTabProps {
  profile: UserProfile;
  transactions: Transaction[];
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
  insight: string;
  insightLoading: boolean;
  isMockInsight: boolean;
  onRefreshInsight: () => void;
  insightError?: string;
}

export default function DashboardTab({
  profile,
  transactions,
  onAddTransaction,
  insight,
  insightLoading,
  isMockInsight,
  onRefreshInsight,
  insightError,
}: DashboardTabProps) {
  const [hideBalance, setHideBalance] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Makanan');
  const [type, setType] = useState<'debit' | 'credit'>('debit');
  const [date, setDate] = useState('2026-06-12');

  // Calculations
  const creditTotal = transactions
    .filter((t) => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const debitTotal = transactions
    .filter((t) => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  // Formatter helpers
  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  const calculateDaysRemaining = (targetDateStr: string): number => {
    const target = new Date(targetDateStr);
    const now = new Date('2026-06-12'); // matching baseline
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysLeft = calculateDaysRemaining(profile.nextAllowanceDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    onAddTransaction({
      title,
      category,
      amount: parseFloat(amount),
      type,
      date,
    });

    // Reset Form
    setTitle('');
    setAmount('');
    setCategory('Makanan');
    setType('debit');
    setDate('2026-06-12');
    setIsAddOpen(false);
  };

  // Sort transactions by date descending, showing latest first
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 scrollbar-none pb-24 relative">
      {/* Profile Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-neutral-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
            {/* Custom stylized profile avatar */}
            <span className="text-lg font-bold text-neutral-700">R</span>
          </div>
          <div>
            <span className="text-[11px] text-neutral-400 block uppercase tracking-wider font-semibold">Welcome back</span>
            <h2 className="text-base font-bold text-neutral-800 leading-tight">Hello, {profile.name}</h2>
          </div>
        </div>

        {/* Currency Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-neutral-100 shadow-sm text-xs font-semibold text-neutral-700">
          <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse"></span>
          <span>IDR (Rp)</span>
        </div>
      </div>

      {/* Account Balance Card (Neon lime green matching the design) */}
      <div className="w-full bg-[#D4FC79] rounded-3xl p-6 shadow-lg shadow-lime-300/20 relative overflow-hidden transition-all duration-300">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex justify-between items-start">
          <div>
            <span className="text-[11px] font-bold text-neutral-800/60 uppercase tracking-wider">Account Balance</span>
            <div className="text-3xl font-black text-neutral-900 tracking-tight mt-1 flex items-center gap-2">
              {hideBalance ? '••••••••' : formatRupiah(profile.balance)}
              <button 
                onClick={() => setHideBalance(!hideBalance)} 
                className="text-neutral-900/60 hover:text-neutral-900 p-1"
                aria-label={hideBalance ? "Tampilkan saldo" : "Sembunyikan saldo"}
              >
                {hideBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Kiriman Next Remittance Info */}
        <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold text-neutral-800/70 bg-white/30 backdrop-blur-sm rounded-lg px-2.5 py-1 w-max">
          <Calendar className="w-3 h-3" />
          <span>Kiriman: {new Date(profile.nextAllowanceDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} ({daysLeft} hari lagi)</span>
        </div>

        {/* Credits / Debits Mini Pills */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 flex items-center gap-2.5 shadow-sm border border-white/40">
            <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center shrink-0">
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[9px] text-neutral-400 block uppercase font-bold tracking-wider">Credit</span>
              <span className="text-xs font-extrabold text-neutral-800">{formatRupiah(creditTotal)}</span>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 flex items-center gap-2.5 shadow-sm border border-white/40">
            <div className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
              <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[9px] text-neutral-400 block uppercase font-bold tracking-wider">Debit</span>
              <span className="text-xs font-extrabold text-neutral-800">{formatRupiah(debitTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insight Section */}
      <InsightCard
        insight={insight}
        loading={insightLoading}
        isMock={isMockInsight}
        onRefresh={onRefreshInsight}
        error={insightError}
      />

      {/* Activity Section (Dark container matching design) */}
      <div className="bg-[#141414] rounded-3xl p-5 text-white shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-neutral-200">Activity</h3>
          <span className="text-[10px] text-neutral-400 font-semibold">{transactions.length} Transaksi</span>
        </div>

        <div className="space-y-4 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin">
          {sortedTransactions.length === 0 ? (
            <div className="text-center py-6 text-neutral-500 text-xs">
              Belum ada riwayat transaksi.
            </div>
          ) : (
            sortedTransactions.map((tx) => (
              <div key={tx.id} className="flex justify-between items-center group">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    tx.type === 'credit' 
                      ? 'bg-green-500/10 text-green-400' 
                      : 'bg-red-500/10 text-red-400'
                  }`}>
                    {tx.type === 'credit' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-200 group-hover:text-white transition-colors">{tx.title}</h4>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">
                      {new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} • {tx.category}
                    </span>
                  </div>
                </div>
                <div className={`text-xs font-black ${
                  tx.type === 'credit' ? 'text-green-400' : 'text-neutral-200'
                }`}>
                  {tx.type === 'credit' ? '+' : '-'}{formatRupiah(tx.amount)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Floating Action Button for Adding Transaction */}
      <button
        onClick={() => setIsAddOpen(true)}
        className="fixed bottom-[92px] right-6 sm:absolute sm:bottom-20 w-12 h-12 rounded-full bg-[#D4FC79] text-neutral-900 flex items-center justify-center shadow-lg shadow-lime-400/20 hover:scale-110 active:scale-95 transition-all z-30"
        aria-label="Tambah Transaksi"
      >
        <Plus className="w-6 h-6 stroke-[3]" />
      </button>

      {/* Bottom Sheet Modal for Adding Transaction */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:absolute sm:rounded-[45px] overflow-hidden">
          <div className="w-full bg-white rounded-t-[32px] p-6 pb-8 shadow-2xl transform transition-transform animate-slide-up max-h-[90%] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-extrabold text-neutral-900">Catat Transaksi Baru</h3>
              <button 
                onClick={() => setIsAddOpen(false)} 
                className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-neutral-200 transition-colors"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type Debit/Credit Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-neutral-100">
                <button
                  type="button"
                  onClick={() => setType('debit')}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    type === 'debit'
                      ? 'bg-neutral-900 text-white shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  Pengeluaran (Debit)
                </button>
                <button
                  type="button"
                  onClick={() => setType('credit')}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    type === 'credit'
                      ? 'bg-green-600 text-white shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  Pemasukan (Kredit)
                </button>
              </div>

              {/* Title Input */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Nama Transaksi
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Starbucks, Uang Saku, Makan Warteg"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs font-medium px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-neutral-900 transition-colors"
                />
              </div>

              {/* Amount Input */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Jumlah (Rp)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-xs font-extrabold text-neutral-400">Rp</span>
                  <input
                    type="number"
                    required
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full text-xs font-bold pl-10 pr-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>
              </div>

              {/* Category & Date Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                    Kategori
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs font-medium px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-neutral-900 transition-colors"
                  >
                    {type === 'debit' ? (
                      <>
                        <option value="Makan">Makan</option>
                        <option value="Kopi">Kopi / Minuman</option>
                        <option value="Kosan">Kosan / Bulanan</option>
                        <option value="Hiburan">Hiburan / Nonton</option>
                        <option value="Transport">Transportasi</option>
                        <option value="Lainnya">Lainnya</option>
                      </>
                    ) : (
                      <>
                        <option value="Saku">Kiriman Saku</option>
                        <option value="Kerja">Gaji / Freelance</option>
                        <option value="Lainnya">Lainnya</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs font-medium px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-4 bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Wallet className="w-4 h-4" />
                <span>Simpan Transaksi</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
