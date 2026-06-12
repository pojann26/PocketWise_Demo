'use client';

import React, { useState } from 'react';
import { Settings, Save, RotateCcw, ShieldCheck, Eye, EyeOff, Info, HelpCircle } from 'lucide-react';
import { UserProfile, AppSettings } from '@/types';

interface SettingsTabProps {
  profile: UserProfile;
  onUpdateProfile: (p: UserProfile) => void;
  settings: AppSettings;
  onUpdateSettings: (s: AppSettings) => void;
  onResetData: () => void;
}

export default function SettingsTab({
  profile,
  onUpdateProfile,
  settings,
  onUpdateSettings,
  onResetData,
}: SettingsTabProps) {
  // Profile Form state
  const [name, setName] = useState(profile.name);
  const [nextAllowanceDate, setNextAllowanceDate] = useState(profile.nextAllowanceDate);
  const [monthlyAllowance, setMonthlyAllowance] = useState(profile.monthlyAllowance.toString());

  // Settings Form state
  const [apiKey, setApiKey] = useState(settings.geminiApiKey);
  const [useMock, setUseMock] = useState(settings.useMockAI);
  const [showKey, setShowKey] = useState(false);

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      balance: profile.balance, // balance updates dynamically based on transactions
      nextAllowanceDate,
      monthlyAllowance: parseFloat(monthlyAllowance) || 0,
    });
    triggerSuccess();
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      geminiApiKey: apiKey,
      useMockAI: useMock,
    });
    triggerSuccess();
  };

  const triggerSuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleReset = () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua perubahan dan menyetel ulang data kembali ke setelan pabrik/awal Rahmat?')) {
      onResetData();
      // Reset local inputs
      window.location.reload();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 scrollbar-none pb-24">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
          <Settings className="w-5 h-5" />
        </div>
        <h2 className="text-base font-extrabold text-neutral-900">Settings</h2>
      </div>

      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2 animate-bounce">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Perubahan berhasil disimpan!</span>
        </div>
      )}

      {/* Profile Form Card */}
      <div className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-neutral-800">Profil Keuangan Mahasiswa</h3>
        
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
              Nama Mahasiswa
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs font-medium px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-neutral-900 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                Jadwal Kiriman Uang
              </label>
              <input
                type="date"
                required
                value={nextAllowanceDate}
                onChange={(e) => setNextAllowanceDate(e.target.value)}
                className="w-full text-xs font-medium px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-neutral-900 transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                Jumlah Kiriman (Rp)
              </label>
              <input
                type="number"
                required
                value={monthlyAllowance}
                onChange={(e) => setMonthlyAllowance(e.target.value)}
                className="w-full text-xs font-bold px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-neutral-900 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Profil</span>
          </button>
        </form>
      </div>

      {/* AI Config Card */}
      <div className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-neutral-800">Konfigurasi AI Advisor</h3>
        
        <form onSubmit={handleSaveSettings} className="space-y-4">
          {/* Toggle Switch Simulation Mode */}
          <div className="flex justify-between items-center p-3 rounded-xl bg-neutral-50 border border-neutral-200/60">
            <div>
              <span className="text-xs font-bold text-neutral-800 block">Mode Simulasi AI</span>
              <span className="text-[10px] text-neutral-400 block mt-0.5">Jalankan advisor tanpa API Key</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={useMock}
                onChange={(e) => {
                  setUseMock(e.target.checked);
                  // Auto toggle off apiKey if check mock
                }}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-lime-500"></div>
            </label>
          </div>

          {/* API Key Input */}
          {!useMock && (
            <div className="space-y-1 animate-slide-up">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                Gemini API Key
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  placeholder="AIZAsy..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full text-xs font-medium pl-4 pr-10 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:border-neutral-900 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-3.5 text-neutral-400 hover:text-neutral-600"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex gap-1.5 items-start bg-blue-50/50 p-2.5 rounded-lg text-[9px] text-blue-800 border border-blue-100">
                <Info className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span>API Key ini disimpan secara aman di browser Anda dan hanya digunakan untuk memanggil Google Gemini.</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-neutral-950 hover:bg-neutral-800 text-white font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Pengaturan AI</span>
          </button>
        </form>
      </div>

      {/* Developer Control Card */}
      <div className="bg-red-50/40 rounded-3xl p-5 border border-red-100 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-red-800">Area Bahaya</h3>
        <p className="text-[10px] text-red-700/80 leading-relaxed">
          Menghapus seluruh modifikasi data di browser Anda dan memuat kembali data simulasi awal mahasiswa (Rahmat).
        </p>
        <button
          onClick={handleReset}
          className="w-full bg-red-100 hover:bg-red-200 text-red-700 font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Semua Data Transaksi</span>
        </button>
      </div>
    </div>
  );
}
