export type UserRole = 'freelancer' | 'admin';

export interface FiscalProfile {
  name: string;
  nif: string;
  activity: string;
  isVatExempt: boolean;
  irpfRate: number;
}

export interface Invoice {
  id: string;
  clientName: string;
  clientNif: string;
  date: string;
  amount: number;
  vat: number;
  irpf: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  verifactuId?: string;
  qrCode?: string;
}

export interface Expense {
  id: string;
  description: string;
  date: string;
  amount: number;
  vat: number;
  category: string;
  isDeductible: boolean;
}

export interface TaxSummary {
  ivaDue: number;
  irpfWithheld: number;
  netIncome: number;
  grossIncome: number;
  totalExpenses: number;
  estimatedProfit: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: Action[];
}

export interface BankAccount {
  id: string;
  name: string;
  bankName: string;
  balance: number;
  currency: string;
  lastSync: string;
  accountNumber: string;
  status: 'active' | 'error' | 'syncing';
}

export interface BankTransaction {
  id: string;
  accountId: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  isCategorized: boolean;
  expenseId?: string;
}

export interface Action {
  id: string;
  label: string;
  type: 'create_invoice' | 'categorize_expense' | 'prepare_tax' | 'apply_deduction' | 'connect_bank';
  payload?: any;
}
