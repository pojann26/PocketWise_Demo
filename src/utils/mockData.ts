import { Transaction, UserProfile, AppSettings } from '../types';

export const initialProfile: UserProfile = {
  name: 'Rahmat',
  balance: 350000,
  nextAllowanceDate: '2026-06-30', // June 30, 2026 (14 days from June 12)
  monthlyAllowance: 2000000,
};

export const initialTransactions: Transaction[] = [
  {
    id: 'tx-1',
    date: '2026-06-01',
    title: 'Kiriman Bulanan',
    category: 'Saku',
    amount: 2000000,
    type: 'credit',
  },
  {
    id: 'tx-2',
    date: '2026-06-02',
    title: 'Bayar Kosan',
    category: 'Kosan',
    amount: 800000,
    type: 'debit',
  },
  {
    id: 'tx-3',
    date: '2026-06-03',
    title: 'Starbucks',
    category: 'Kopi',
    amount: 55000,
    type: 'debit',
  },
  {
    id: 'tx-4',
    date: '2026-06-05',
    title: 'Starbucks',
    category: 'Kopi',
    amount: 55000,
    type: 'debit',
  },
  {
    id: 'tx-5',
    date: '2026-06-06',
    title: 'Makan Warteg',
    category: 'Makan',
    amount: 25000,
    type: 'debit',
  },
  {
    id: 'tx-6',
    date: '2026-06-08',
    title: 'Starbucks',
    category: 'Kopi',
    amount: 55000,
    type: 'debit',
  },
  {
    id: 'tx-7',
    date: '2026-06-10',
    title: 'Nonton Bioskop & Jajan',
    category: 'Hiburan',
    amount: 120000,
    type: 'debit',
  },
  {
    id: 'tx-8',
    date: '2026-06-11',
    title: 'Starbucks',
    category: 'Kopi',
    amount: 55000,
    type: 'debit',
  },
  {
    id: 'tx-9',
    date: '2026-06-12',
    title: 'Kopi Susu Kekinian',
    category: 'Kopi',
    amount: 35000,
    type: 'debit',
  },
];

export const initialSettings: AppSettings = {
  geminiApiKey: '',
  useMockAI: true, // Defaults to Mock mode so it works out of the box
};
