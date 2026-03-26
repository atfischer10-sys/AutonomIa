import React from 'react';
import { FileText, Calendar, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Invoice, Expense } from '../types';
import { calculateFiscalSummary2026 } from '../lib/utils';

interface TaxesViewProps {
  invoices: Invoice[];
  expenses: Expense[];
}

export const TaxesView: React.FC<TaxesViewProps> = ({ invoices, expenses }) => {
  const summary = calculateFiscalSummary2026(invoices, expenses);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-serif">Control Fiscal</h1>
          <p className="text-slate-500">Tus obligaciones fiscales bajo control y siempre a tiempo.</p>
        </div>
        <button className="bg-brand-primary text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-brand-primary/20 hover:scale-105 transition-all flex items-center gap-2">
          Presentar Modelo 303
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">IVA a Pagar (Q1)</p>
          <p className="text-2xl font-bold text-slate-900">{summary.ivaDue.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
          <p className="text-xs text-emerald-600 font-medium mt-2">Calculado según Ley 2026</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">IRPF Retenido</p>
          <p className="text-2xl font-bold text-slate-900">{summary.irpfWithheld.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
          <p className="text-xs text-slate-500 font-medium mt-2">Pagos a cuenta realizados</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Cuota Autónomos (Est.)</p>
          <p className="text-2xl font-bold text-slate-900">{summary.estimatedReta.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
          <p className="text-xs text-blue-600 font-medium mt-2">Sistema Ingresos Reales 2026</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Beneficio Neto</p>
          <p className="text-2xl font-bold text-emerald-600">{summary.estimatedProfit.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
          <p className="text-xs text-slate-500 font-medium mt-2">Tras impuestos y cuotas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 font-serif mb-6">Próximas Declaraciones</h3>
            <div className="space-y-4">
              {[
                { name: 'Modelo 303 (IVA)', date: '20 Abr 2026', status: 'pending', amount: `${summary.ivaDue.toLocaleString('es-ES')} €` },
                { name: 'Modelo 130 (IRPF)', date: '20 Abr 2026', status: 'pending', amount: 'Calculando...' },
                { name: 'Modelo 303 (IVA) - Q1', date: '20 Ene 2026', status: 'completed', amount: '2.150,00 €' },
              ].map((tax, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className={tax.status === 'completed' ? "text-emerald-500" : "text-amber-500"}>
                      {tax.status === 'completed' ? <CheckCircle size={24} /> : <Calendar size={24} />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{tax.name}</p>
                      <p className="text-xs text-slate-500">Vence el {tax.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">{tax.amount}</p>
                    <button className="text-xs font-semibold text-brand-primary hover:underline">
                      {tax.status === 'completed' ? 'Ver justificante' : 'Preparar borrador'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex gap-4">
            <div className="bg-brand-primary text-white p-3 rounded-2xl h-fit">
              <Info size={24} />
            </div>
            <div>
              <h4 className="font-bold text-brand-primary mb-1">Cumplimiento Veri*factu 2026</h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                Tus facturas están siendo enviadas en tiempo real a la AEAT. Tu identificador de sistema es <span className="font-mono font-bold">VF-2026-AUTONOMIA</span>. 
                Cumples con el Reglamento de requisitos de sistemas y programas informáticos o electrónicos.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 font-serif mb-4">Calendario Fiscal</h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border-l-4 border-brand-primary">
                <p className="text-xs font-bold text-slate-400 uppercase">Abril 2026</p>
                <p className="text-sm font-bold text-slate-900">Presentación Trimestral Q1</p>
                <p className="text-xs text-slate-500 mt-1">IVA, IRPF y Retenciones</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border-l-4 border-slate-200 opacity-50">
                <p className="text-xs font-bold text-slate-400 uppercase">Mayo 2026</p>
                <p className="text-sm font-bold text-slate-900">Declaración de la Renta</p>
                <p className="text-xs text-slate-500 mt-1">Campaña 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
