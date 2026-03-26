import { Invoice, Expense, FiscalProfile } from './types';

export const MOCK_PROFILE: FiscalProfile = {
  name: "Anthony Fischer",
  nif: "12345678X",
  activity: "Digital Product Management",
  isVatExempt: false,
  irpfRate: 15,
};

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'INV-2026-001',
    clientName: 'Seedtag',
    clientNif: 'B87654321',
    date: '2026-03-15',
    amount: 1200,
    vat: 252,
    irpf: 180,
    total: 1272,
    status: 'paid',
    verifactuId: 'VF-9876543210',
  },
  {
    id: 'INV-2026-002',
    clientName: 'Nuclio Digital School',
    clientNif: 'A12345678',
    date: '2026-03-20',
    amount: 2500,
    vat: 525,
    irpf: 375,
    total: 2650,
    status: 'sent',
    verifactuId: 'VF-1234567890',
  },
];

export const MOCK_EXPENSES: Expense[] = [
  {
    id: 'EXP-001',
    description: 'Adobe Creative Cloud',
    date: '2026-03-01',
    amount: 60,
    vat: 12.6,
    category: 'Software',
    isDeductible: true,
  },
  {
    id: 'EXP-002',
    description: 'Coworking Space',
    date: '2026-03-05',
    amount: 250,
    vat: 52.5,
    category: 'Office',
    isDeductible: true,
  },
];
