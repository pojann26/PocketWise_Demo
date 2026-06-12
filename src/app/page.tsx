'use client';

import React, { useState, useEffect } from 'react';
import MobileFrame from '@/components/MobileFrame';
import Navbar from '@/components/Navbar';
import DashboardTab from '@/components/DashboardTab';
import SpendingTab from '@/components/SpendingTab';
import IncomeTab from '@/components/IncomeTab';
import SettingsTab from '@/components/SettingsTab';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { initialProfile, initialTransactions, initialSettings } from '@/utils/mockData';
import { Transaction, UserProfile, AppSettings } from '@/types';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'home' | 'spending' | 'income' | 'settings'>('home');

  // Load state from local storage safely
  const [profile, setProfile, isProfileMounted] = useLocalStorage<UserProfile>('pocketwise_profile', initialProfile);
  const [transactions, setTransactions, isTransactionsMounted] = useLocalStorage<Transaction[]>('pocketwise_transactions', initialTransactions);
  const [settings, setSettings, isSettingsMounted] = useLocalStorage<AppSettings>('pocketwise_settings', initialSettings);
  const [insight, setInsight, isInsightMounted] = useLocalStorage<string>('pocketwise_insight', '');
  const [isMockInsight, setIsMockInsight, isMockInsightMounted] = useLocalStorage<boolean>('pocketwise_insight_ismock', true);

  // Loading states for AI fetching
  const [insightLoading, setInsightLoading] = useState(false);
  const [insightError, setInsightError] = useState<string | undefined>(undefined);

  const isMounted = isProfileMounted && isTransactionsMounted && isSettingsMounted && isInsightMounted && isMockInsightMounted;

  const fetchInsight = async (
    currentProfile: UserProfile,
    currentTransactions: Transaction[],
    currentSettings: AppSettings
  ) => {
    setInsightLoading(true);
    setInsightError(undefined);
    try {
      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile: currentProfile,
          transactions: currentTransactions,
          customApiKey: currentSettings.useMockAI ? '' : currentSettings.geminiApiKey,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi penasihat keuangan AI.');
      }

      const data = await response.json();
      setInsight(data.insight);
      setIsMockInsight(data.isMock);
    } catch (err: any) {
      console.error(err);
      setInsightError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setInsightLoading(false);
    }
  };

  // Run on mount once local storage values are loaded to ensure we have an initial analysis
  useEffect(() => {
    if (isMounted && !insight) {
      fetchInsight(profile, transactions, settings);
    }
  }, [isMounted]);

  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const tx: Transaction = {
      ...newTx,
      id: 'tx-' + Date.now(),
    };
    const updatedTransactions = [...transactions, tx];
    setTransactions(updatedTransactions);

    // Update profile balance
    const updatedProfile = {
      ...profile,
      balance: profile.balance + (tx.type === 'credit' ? tx.amount : -tx.amount),
    };
    setProfile(updatedProfile);

    // Auto trigger analysis update reactively!
    fetchInsight(updatedProfile, updatedTransactions, settings);
  };

  const handleUpdateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    // Refresh insights with new profile settings (e.g. name change or allowance target change)
    fetchInsight(newProfile, transactions, settings);
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    // Refresh insights with new settings configuration
    fetchInsight(profile, transactions, newSettings);
  };

  const handleResetData = () => {
    localStorage.removeItem('pocketwise_profile');
    localStorage.removeItem('pocketwise_transactions');
    localStorage.removeItem('pocketwise_settings');
    localStorage.removeItem('pocketwise_insight');
    localStorage.removeItem('pocketwise_insight_ismock');
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return (
          <DashboardTab
            profile={profile}
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
            insight={insight}
            insightLoading={insightLoading}
            isMockInsight={isMockInsight}
            onRefreshInsight={() => fetchInsight(profile, transactions, settings)}
            insightError={insightError}
          />
        );
      case 'spending':
        return (
          <SpendingTab
            profile={profile}
            transactions={transactions}
            onBackToDashboard={() => setActiveTab('home')}
          />
        );
      case 'income':
        return (
          <IncomeTab
            profile={profile}
            transactions={transactions}
            onBackToDashboard={() => setActiveTab('home')}
          />
        );
      case 'settings':
        return (
          <SettingsTab
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onResetData={handleResetData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <MobileFrame>
      {/* Content wrapper */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-neutral-50">
        {!isMounted ? (
          <div className="flex-1 flex items-center justify-center flex-col gap-3">
            <div className="w-10 h-10 border-4 border-[#D4FC79] border-t-neutral-800 rounded-full animate-spin"></div>
            <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Memuat PocketWise...</span>
          </div>
        ) : (
          <>
            {renderActiveTab()}
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
          </>
        )}
      </div>
    </MobileFrame>
  );
}

