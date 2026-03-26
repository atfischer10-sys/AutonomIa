import React, { useState } from 'react';
import { X, Save, Send, Sparkles, Building2, User, Calendar, Euro, ShieldCheck, AlertCircle, Loader2, Plus, Trash2, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { Invoice } from '../types';

interface InvoiceFormProps {
  onClose: () => void;
  onSave: (invoice: Partial<Invoice>) => void;
}

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientNif: '',
    date: new Date().toISOString().split('T')[0],
    vatRate: 21,
    irpfRate: 15,
  });

  const [items, setItems] = useState<LineItem[]>([
    { id: '1', description: '', quantity: 1, price: 0 }
  ]);

  const [isVerifying, setIsVerifying] = useState(false);

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(), description: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const vatAmount = (subtotal * formData.vatRate) / 100;
  const irpfAmount = (subtotal * formData.irpfRate) / 100;
  const total = subtotal + vatAmount - irpfAmount;

  const handleSubmit = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    
    if (!formData.clientName || !formData.clientNif || items.some(i => !i.description || i.price <= 0)) {
      return;
    }

    setIsVerifying(true);
    
    // Simulate Veri*factu 2026 verification
    setTimeout(() => {
      onSave({
        clientName: formData.clientName,
        clientNif: formData.clientNif,
        date: formData.date,
        amount: subtotal,
        vat: vatAmount,
        irpf: irpfAmount,
        total: total,
        status: 'sent',
        verifactuId: `VF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      });
      setIsVerifying(false);
    }, 1500);
  };

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
        className="bg-white w-full max-w-3xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="bg-brand-primary p-2 rounded-xl text-white">
              <Save size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-serif">Nueva Factura</h2>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <ShieldCheck size={12} className="text-emerald-500" />
                Conforme a Veri*factu y Ley Crea y Crece 2026
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Client Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Building2 size={16} />
              Datos del Cliente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Nombre o Razón Social</label>
                <input 
                  required
                  type="text" 
                  value={formData.clientName}
                  onChange={e => setFormData({...formData, clientName: e.target.value})}
                  placeholder="Ej: Seedtag SL"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">NIF / CIF</label>
                <input 
                  required
                  type="text" 
                  value={formData.clientNif}
                  onChange={e => setFormData({...formData, clientNif: e.target.value})}
                  placeholder="Ej: B12345678"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Calendar size={16} />
              Detalles de la Factura
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Fecha de Emisión</label>
                <input 
                  type="date" 
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <FileText size={16} />
                Conceptos y Líneas
              </h3>
              <button 
                type="button"
                onClick={addItem}
                className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
              >
                <Plus size={14} />
                Añadir línea
              </button>
            </div>
            
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={item.id} className="flex gap-3 items-start group">
                  <div className="flex-1 space-y-1.5">
                    <input 
                      type="text" 
                      value={item.description}
                      onChange={e => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Descripción del servicio o producto"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-sm"
                    />
                  </div>
                  <div className="w-20 space-y-1.5">
                    <input 
                      type="number" 
                      value={item.quantity}
                      onChange={e => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      placeholder="Cant."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-sm text-center"
                    />
                  </div>
                  <div className="w-32 space-y-1.5">
                    <div className="relative">
                      <input 
                        type="number" 
                        value={item.price || ''}
                        onChange={e => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                        placeholder="Precio"
                        className="w-full pl-6 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-sm"
                      />
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">€</span>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-slate-300 hover:text-rose-500 transition-colors mt-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Taxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">IVA (%)</label>
              <select 
                value={formData.vatRate}
                onChange={e => setFormData({...formData, vatRate: parseInt(e.target.value)})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
              >
                <option value={21}>21% (General)</option>
                <option value={10}>10% (Reducido)</option>
                <option value={4}>4% (Superreducido)</option>
                <option value={0}>0% (Exento)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">IRPF (%)</label>
              <select 
                value={formData.irpfRate}
                onChange={e => setFormData({...formData, irpfRate: parseInt(e.target.value)})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
              >
                <option value={15}>15% (General)</option>
                <option value={7}>7% (Nuevos autónomos)</option>
                <option value={0}>0% (No aplica)</option>
              </select>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-3">
            <div className="flex justify-between text-sm text-slate-500">
              <span>Subtotal:</span>
              <span>{subtotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-sm text-slate-500">
              <span>IVA ({formData.vatRate}%):</span>
              <span>+ {vatAmount.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-sm text-slate-500">
              <span>IRPF ({formData.irpfRate}%):</span>
              <span className="text-rose-500">- {irpfAmount.toFixed(2)} €</span>
            </div>
            <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
              <span className="text-lg font-bold text-slate-900">Total Factura:</span>
              <span className="text-2xl font-bold text-brand-primary">{total.toFixed(2)} €</span>
            </div>
          </div>

          {/* Veri*factu Notice */}
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3">
            <AlertCircle size={20} className="text-brand-primary shrink-0" />
            <p className="text-xs text-slate-600 leading-relaxed">
              Al emitir esta factura, AutonomIA generará automáticamente el registro en la AEAT conforme a la normativa **Veri*factu 2026**. Se incluirá el código QR y la huella digital requerida por ley.
            </p>
          </div>
        </div>

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
            disabled={isVerifying || !formData.clientName || items.some(i => !i.description || i.price <= 0)}
            className="flex-[2] py-3 bg-brand-primary text-white font-bold rounded-2xl shadow-lg shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isVerifying ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Verificando con AEAT...
              </>
            ) : (
              <>
                <Send size={20} />
                Emitir Factura
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
