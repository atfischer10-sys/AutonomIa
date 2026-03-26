import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Estimates the monthly Social Security contribution (RETA) for a Spanish freelancer in 2026
 * based on the net monthly income (rendimientos netos).
 * Values are based on the 2023-2025 reform transition towards 2026/2027.
 */
export function calculateReta2026(monthlyNetIncome: number): number {
  if (monthlyNetIncome < 670) return 225;
  if (monthlyNetIncome < 900) return 250;
  if (monthlyNetIncome < 1166.7) return 267;
  if (monthlyNetIncome < 1300) return 291;
  if (monthlyNetIncome < 1500) return 294;
  if (monthlyNetIncome < 1700) return 294;
  if (monthlyNetIncome < 1850) return 310;
  if (monthlyNetIncome < 2030) return 315;
  if (monthlyNetIncome < 2330) return 320;
  if (monthlyNetIncome < 2760) return 330;
  if (monthlyNetIncome < 3190) return 350;
  if (monthlyNetIncome < 3620) return 370;
  if (monthlyNetIncome < 4050) return 390;
  if (monthlyNetIncome < 6000) return 420;
  return 530;
}

/**
 * Calculates the quarterly tax summary based on 2026 regulations.
 */
export function calculateFiscalSummary2026(invoices: any[], expenses: any[]) {
  const grossIncome = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const ivaDue = invoices.reduce((sum, inv) => sum + (inv.vat || 0), 0);
  const irpfWithheld = invoices.reduce((sum, inv) => sum + (inv.irpf || 0), 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const ivaDeductible = expenses.reduce((sum, exp) => sum + (exp.vat || 0), 0);
  
  const netIncome = grossIncome - totalExpenses;
  const estimatedReta = calculateReta2026(netIncome / 3) * 3; // Quarterly RETA
  
  return {
    grossIncome,
    ivaDue: Math.max(0, ivaDue - ivaDeductible),
    irpfWithheld,
    totalExpenses,
    netIncome,
    estimatedReta,
    estimatedProfit: netIncome - estimatedReta,
  };
}
