import React, { useState } from 'react';
import { Plus, Search, Filter, Download, MoreVertical, CheckCircle, Clock, AlertCircle, FileText, Send, Sparkles, QrCode, ShieldCheck, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { InvoiceForm } from './InvoiceForm';
import { Invoice } from '../types';
import { supabase } from '../lib/supabase';

export const Invoicing: React.FC<{ invoices: Invoice[]; setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>> }> = ({ invoices, setInvoices }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle size={16} className="text-emerald-500" />;
      case 'sent': return <Clock size={16} className="text-blue-500" />;
      case 'overdue': return <AlertCircle size={16} className="text-rose-500" />;
      default: return <Clock size={16} className="text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case 'sent': return "bg-blue-50 text-blue-700 border-blue-100";
      case 'overdue': return "bg-rose-50 text-rose-700 border-rose-100";
      default: return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  const handleSaveInvoice = async (newInvoice: Partial<Invoice>) => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const invoiceData = {
        id: `INV-2026-${(invoices.length + 1).toString().padStart(3, '0')}`,
        clientName: newInvoice.clientName || '',
        clientNif: newInvoice.clientNif || '',
        date: newInvoice.date || new Date().toISOString().split('T')[0],
        amount: newInvoice.amount || 0,
        vat: newInvoice.vat || 0,
        irpf: newInvoice.irpf || 0,
        total: newInvoice.total || 0,
        status: 'sent',
        verifactuId: newInvoice.verifactuId || `VF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=verifactu-2026-demo',
        user_id: user?.id || 'demo-user'
      };

      if (user) {
        const { data, error } = await supabase
          .from('invoices')
          .insert([invoiceData])
          .select();

        if (error) throw error;
        if (data) {
          setInvoices([data[0], ...invoices]);
        }
      } else {
        // Modo demo: guardar solo en el estado local
        setInvoices([invoiceData as Invoice, ...invoices]);
        console.warn('Guardado localmente (Modo Demo). Los datos se perderán al refrescar.');
      }
      
      setShowForm(false);
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Error al guardar la factura. Asegúrate de haber configurado Supabase correctamente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {showForm && (
          <InvoiceForm 
            onClose={() => setShowForm(false)} 
            onSave={handleSaveInvoice}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-serif">Facturación 2026</h1>
          <p className="text-slate-500 flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-500" />
            Cumplimiento total con Ley Crea y Crece y Veri*factu.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Sparkles size={18} className="text-brand-primary" />
            Generar con IA
          </button>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-brand-primary text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-brand-primary/20 hover:scale-105 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            Nueva Factura
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por cliente o número de factura..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm">
            <Filter size={18} />
            Filtros
          </button>
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm">
            <Download size={18} />
            Exportar
          </button>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Factura / Veri*factu</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Total</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {invoices.map((invoice) => (
                <motion.tr 
                  key={invoice.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-brand-primary rounded-lg">
                        <FileText size={18} />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-slate-900 block">{invoice.id}</span>
                        {invoice.verifactuId && (
                          <span className="text-[10px] font-mono text-emerald-600 flex items-center gap-1">
                            <QrCode size={10} />
                            {invoice.verifactuId}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-700">{invoice.clientName}</span>
                      <span className="text-[10px] text-slate-400 font-mono uppercase">{invoice.clientNif}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-500">{invoice.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border", getStatusColor(invoice.status))}>
                      {getStatusIcon(invoice.status)}
                      <span className="capitalize">{invoice.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-bold text-slate-900">{invoice.total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-brand-primary hover:bg-blue-50 rounded-lg transition-all" title="Enviar por Email">
                        <Send size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all" title="Ver QR Veri*factu">
                        <QrCode size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State / AI Suggestion */}
      <div className="p-8 bg-gradient-to-br from-brand-primary/5 to-blue-50 rounded-3xl border border-brand-primary/10 flex flex-col md:flex-row items-center gap-8">
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <Sparkles size={48} className="text-brand-primary animate-pulse" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl font-bold text-slate-900 mb-2">¿Necesitas ayuda con una factura?</h3>
          <p className="text-slate-600 max-w-xl">
            Puedo generar una factura automáticamente a partir de un mensaje o un ticket. 
            Solo dime: "Crea una factura para [Cliente] de [Importe] por [Concepto]".
          </p>
        </div>
        <button className="bg-white text-brand-primary border border-brand-primary/20 px-6 py-3 rounded-xl font-bold hover:bg-white/50 transition-all shadow-sm">
          Probar ahora
        </button>
      </div>
    </div>
  );
};
