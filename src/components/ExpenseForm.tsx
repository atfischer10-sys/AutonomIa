import React, { useState } from 'react';
import { X, Save, Upload, Receipt, Calendar, Euro, Tag, AlertCircle, Loader2, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface ExpenseFormProps {
  onClose: () => void;
  onSave: (expense: any) => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    description: '',
    category: 'Suministros',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    vatRate: 21,
    isDeductible: true,
    provider: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    setTimeout(() => {
      onSave({
        id: `EXP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        description: formData.description,
        category: formData.category,
        date: formData.date,
        amount: parseFloat(formData.amount) || 0,
        isDeductible: formData.isDeductible,
        provider: formData.provider,
      });
      setIsProcessing(false);
    }, 1000);
  };

  const categories = [
    'Suministros',
    'Software/Suscripciones',
    'Marketing',
    'Alquiler',
    'Transporte',
    'Otros',
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="bg-rose-500 p-2 rounded-xl text-white">
              <Receipt size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-serif">Nuevo Gasto</h2>
              <p className="text-xs text-slate-500 font-medium">Añade un ticket o factura de gasto manualmente</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Descripción / Concepto</label>
              <input 
                required
                type="text" 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Ej: Suscripción Adobe Creative Cloud"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Proveedor</label>
                <input 
                  required
                  type="text" 
                  value={formData.provider}
                  onChange={e => setFormData({...formData, provider: e.target.value})}
                  placeholder="Ej: Adobe Systems"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Categoría</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Fecha</label>
                <input 
                  type="date" 
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Importe Total (con IVA)</label>
                <div className="relative">
                  <input 
                    required
                    type="number" 
                    step="0.01"
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">€</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <input 
                type="checkbox" 
                id="isDeductible"
                checked={formData.isDeductible}
                onChange={e => setFormData({...formData, isDeductible: e.target.checked})}
                className="w-5 h-5 rounded-lg text-brand-primary focus:ring-brand-primary/20 border-slate-300"
              />
              <label htmlFor="isDeductible" className="text-sm font-semibold text-slate-700 flex-1">
                Este gasto es deducible para mi actividad
              </label>
              <Tag size={18} className={cn(formData.isDeductible ? "text-emerald-500" : "text-slate-300")} />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-all"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isProcessing || !formData.description || !formData.amount}
            className="flex-[2] py-3 bg-rose-500 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Save size={20} />
                Guardar Gasto
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
