'use client';

import React from 'react';
import { Home, PieChart, CreditCard, User } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'spending' | 'income' | 'settings';
  setActiveTab: (tab: 'home' | 'spending' | 'income' | 'settings') => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Dashboard' },
    { id: 'spending', icon: PieChart, label: 'Spending' },
    { id: 'income', icon: CreditCard, label: 'Income' },
    { id: 'settings', icon: User, label: 'Settings' },
  ] as const;

  return (
    <div className="border-t border-neutral-100 bg-white/90 backdrop-blur-md px-6 py-3 pb-6 sm:pb-4 flex justify-between items-center relative z-40">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex flex-col items-center justify-center relative py-1 focus:outline-none transition-all"
            aria-label={tab.label}
          >
            {isActive ? (
              <div className="flex items-center justify-center w-12 h-12 bg-[#D4FC79]/30 rounded-full text-neutral-900 transition-all duration-300 scale-110">
                <Icon className="w-6 h-6 stroke-[2.25]" />
              </div>
            ) : (
              <div className="flex items-center justify-center w-12 h-12 rounded-full text-neutral-400 hover:text-neutral-600 transition-all duration-200">
                <Icon className="w-6 h-6 stroke-[1.75]" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
