import React from 'react';
import { X, Download, Printer, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface TaxDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  taxName: string;
  summary: any;
}

export const TaxDraftModal: React.FC<TaxDraftModalProps> = ({ isOpen, onClose, taxName, summary }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-4">
              <div className="bg-brand-primary text-white p-2.5 rounded-xl">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-serif">Borrador Oficial: {taxName}</h2>
                <p className="text-xs text-slate-500 font-medium">Ejercicio 2026 • Primer Trimestre (1T)</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                <Printer size={20} />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                <Download size={20} />
              </button>
              <button 
                onClick={onClose}
                className="ml-2 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
            <div className="max-w-3xl mx-auto bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
              {/* AEAT Header Simulation */}
              <div className="bg-slate-100 p-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center text-white font-bold text-xs text-center leading-tight">
                    AEAT
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">Agencia Tributaria</p>
                    <p className="text-xs font-black text-slate-800">Modelo 303</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-500">Nº Justificante</p>
                  <p className="text-xs font-mono font-bold text-slate-800">303202600000123</p>
                </div>
              </div>

              {/* Form Sections */}
              <div className="p-6 space-y-8">
                {/* Identification */}
                <section>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-1">1. Identificación</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-[9px] text-slate-400 font-bold uppercase">NIF</p>
                      <p className="text-sm font-bold text-slate-800">12345678Z</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-[9px] text-slate-400 font-bold uppercase">Apellidos y Nombre</p>
                      <p className="text-sm font-bold text-slate-800">ANTHONY FISCHER</p>
                    </div>
                  </div>
                </section>

                {/* Devengado */}
                <section>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-1">2. IVA Devengado (Ingresos)</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border-b border-slate-50">
                      <span className="text-xs text-slate-600">[01] Régimen General (21%) - Base Imponible</span>
                      <span className="text-sm font-mono font-bold text-slate-800">{(summary.grossIncome || 0).toLocaleString('es-ES')} €</span>
                    </div>
                    <div className="flex items-center justify-between p-2 border-b border-slate-50">
                      <span className="text-xs text-slate-600">[03] Cuota Repercutida</span>
                      <span className="text-sm font-mono font-bold text-brand-primary">{((summary.grossIncome || 0) * 0.21).toLocaleString('es-ES')} €</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg mt-2">
                      <span className="text-xs font-bold text-slate-700">Total Cuota Devengada</span>
                      <span className="text-sm font-mono font-bold text-slate-900">{((summary.grossIncome || 0) * 0.21).toLocaleString('es-ES')} €</span>
                    </div>
                  </div>
                </section>

                {/* Deducible */}
                <section>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-1">3. IVA Deducible (Gastos)</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border-b border-slate-50">
                      <span className="text-xs text-slate-600">[28] Por cuotas soportadas en operaciones interiores</span>
                      <span className="text-sm font-mono font-bold text-slate-800">{summary.totalExpenses.toLocaleString('es-ES')} €</span>
                    </div>
                    <div className="flex items-center justify-between p-2 border-b border-slate-50">
                      <span className="text-xs text-slate-600">[29] Cuota Deducible</span>
                      <span className="text-sm font-mono font-bold text-rose-600">{(summary.totalExpenses * 0.21).toLocaleString('es-ES')} €</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg mt-2">
                      <span className="text-xs font-bold text-slate-700">Total a Deducir</span>
                      <span className="text-sm font-mono font-bold text-slate-900">{(summary.totalExpenses * 0.21).toLocaleString('es-ES')} €</span>
                    </div>
                  </div>
                </section>

                {/* Resultado */}
                <section className="bg-slate-900 text-white p-6 rounded-2xl shadow-inner">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Resultado de la Liquidación</h4>
                    <div className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-[10px] font-bold border border-emerald-500/30">
                      AUTOCALCULADO
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Casilla [71]</p>
                      <p className="text-xs text-slate-300">Resultado a ingresar o devolver</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black font-mono tracking-tighter">
                        {summary.ivaDue.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* Warning */}
            <div className="mt-6 flex gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100 max-w-3xl mx-auto">
              <AlertCircle className="text-amber-600 shrink-0" size={20} />
              <p className="text-xs text-amber-800 leading-relaxed">
                Este documento es un **borrador proforma** generado por AutonomIA basado en tus facturas y gastos registrados. 
                Para que tenga validez legal, debe ser presentado telemáticamente en la Sede Electrónica de la AEAT.
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-slate-100 bg-white flex items-center justify-between">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 text-slate-500 font-bold hover:text-slate-700 transition-colors"
            >
              Cerrar
            </button>
            <div className="flex items-center gap-3">
              <button className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                Validar Datos
              </button>
              <button className="px-8 py-2.5 bg-brand-primary text-white rounded-xl font-bold shadow-lg shadow-brand-primary/20 hover:scale-105 transition-all">
                Presentar Telemáticamente
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
