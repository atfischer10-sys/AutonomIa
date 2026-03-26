import React from 'react';
import { FileText, Calendar, AlertCircle, CheckCircle, Info, Landmark, ShieldCheck, Key, ExternalLink, RefreshCw } from 'lucide-react';
import { Invoice, Expense } from '../types';
import { calculateFiscalSummary2026 } from '../lib/utils';
import { motion } from 'motion/react';
import { TaxDraftModal } from './TaxDraftModal';

interface TaxesViewProps {
  invoices: Invoice[];
  expenses: Expense[];
}

export const TaxesView: React.FC<TaxesViewProps> = ({ invoices, expenses }) => {
  const summary = calculateFiscalSummary2026(invoices, expenses);
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [isConnected, setIsConnected] = React.useState(false);
  const [isDraftModalOpen, setIsDraftModalOpen] = React.useState(false);
  const [selectedTax, setSelectedTax] = React.useState('');

  const handleConnectAEAT = () => {
    setIsConnecting(true);
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
    }, 2000);
  };

  const openDraft = (taxName: string) => {
    setSelectedTax(taxName);
    setIsDraftModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <TaxDraftModal 
        isOpen={isDraftModalOpen} 
        onClose={() => setIsDraftModalOpen(false)} 
        taxName={selectedTax}
        summary={summary}
      />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-serif">Control Fiscal</h1>
          <p className="text-slate-500">Tus obligaciones fiscales bajo control y siempre a tiempo.</p>
        </div>
        <div className="flex items-center gap-3">
          {!isConnected && (
            <button 
              onClick={handleConnectAEAT}
              disabled={isConnecting}
              className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              {isConnecting ? <RefreshCw className="animate-spin" size={18} /> : <Key size={18} />}
              {isConnecting ? 'Conectando...' : 'Conectar AEAT'}
            </button>
          )}
          <button 
            onClick={() => openDraft('Modelo 303 (IVA)')}
            className="bg-brand-primary text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-brand-primary/20 hover:scale-105 transition-all flex items-center gap-2"
          >
            Presentar Modelo 303
          </button>
        </div>
      </div>

      {/* AEAT Connection Status Banner */}
      {isConnected && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center justify-between gap-4 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Conexión Activa con Sede Electrónica</h4>
              <p className="text-xs text-slate-600">Sincronizado con AEAT mediante Certificado Digital. Última sincronización: Hoy, 11:45</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">En Línea</span>
          </div>
        </motion.div>
      )}

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
                    <button 
                      onClick={() => tax.status !== 'completed' && openDraft(tax.name)}
                      className="text-xs font-semibold text-brand-primary hover:underline"
                    >
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
            <h3 className="text-xl font-bold text-slate-900 font-serif mb-6">Integración con AEAT</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="bg-white p-2 rounded-xl text-slate-400 shadow-sm">
                  <Key size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Certificado Digital</h4>
                  <p className="text-xs text-slate-500 mt-1">Necesario para la firma de modelos y consulta de datos fiscales.</p>
                  <button className="mt-3 text-xs font-bold text-brand-primary flex items-center gap-1 hover:underline">
                    Subir certificado <ExternalLink size={12} />
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="bg-white p-2 rounded-xl text-slate-400 shadow-sm">
                  <Landmark size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Sistema Veri*factu</h4>
                  <p className="text-xs text-slate-500 mt-1">Envío automático de facturas en tiempo real según normativa 2026.</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-[10px] font-bold rounded uppercase">Activo</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle size={16} className="text-amber-600" />
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Aviso Importante</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  La conexión con la Sede Electrónica requiere que tu certificado esté vigente y que hayas autorizado a AutonomIA como colaborador social o mediante apoderamiento.
                </p>
              </div>
            </div>
          </div>

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
