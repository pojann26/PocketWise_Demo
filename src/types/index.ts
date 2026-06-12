export interface Transaction {
  id: string;
  date: string; // ISO string or simple YYYY-MM-DD
  title: string;
  category: string;
  amount: number;
  type: 'debit' | 'credit';
}

export interface UserProfile {
  name: string;
  balance: number;
  nextAllowanceDate: string; // YYYY-MM-DD
  monthlyAllowance: number;
}

export interface AppSettings {
  geminiApiKey: string;
  useMockAI: boolean;
}
