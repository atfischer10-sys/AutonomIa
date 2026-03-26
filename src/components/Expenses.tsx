import React, { useState } from 'react';
import { Plus, Search, Filter, Download, MoreVertical, CheckCircle, Clock, AlertCircle, Receipt, Upload, Sparkles, Tag, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { ExpenseForm } from './ExpenseForm';
import { Expense } from '../types';
import { supabase } from '../lib/supabase';

interface ExpensesProps {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
}

export const Expenses: React.FC<ExpensesProps> = ({ expenses, setExpenses }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveExpense = async (newExpense: any) => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const expenseData = {
        ...newExpense,
        id: Date.now().toString(),
        user_id: user?.id || 'demo-user'
      };

      if (user) {
        const { data, error } = await supabase
          .from('expenses')
          .insert([expenseData])
          .select();

        if (error) throw error;
        if (data) {
          setExpenses([data[0], ...expenses]);
        }
      } else {
        // Modo demo: guardar solo en el estado local
        setExpenses([expenseData as Expense, ...expenses]);
        console.warn('Guardado localmente (Modo Demo). Los datos se perderán al refrescar.');
      }
      
      setShowForm(false);
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Error al guardar el gasto. Asegúrate de haber configurado Supabase correctamente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {showForm && (
          <ExpenseForm 
            onClose={() => setShowForm(false)} 
            onSave={handleSaveExpense}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-serif">Gastos</h1>
          <p className="text-slate-500">Registra tus tickets y facturas de gastos para maximizar tu ahorro fiscal.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Upload size={18} className="text-brand-primary" />
            Subir Ticket
          </button>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-brand-primary text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-brand-primary/20 hover:scale-105 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            Nuevo Gasto
          </button>
        </div>
      </div>

      {/* AI Categorization Alert */}
      <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-4">
        <div className="bg-emerald-500 text-white p-2 rounded-lg">
          <Sparkles size={18} />
        </div>
        <p className="text-sm text-emerald-800 font-medium">
          He categorizado automáticamente 5 nuevos gastos de tu banco. <button className="underline font-bold">Revisar ahora</button>
        </p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por proveedor o categoría..."
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

      {/* Expenses Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Gasto</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Deducible</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Total</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {expenses.map((expense) => (
                <motion.tr 
                  key={expense.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-rose-50 text-rose-500 rounded-lg">
                        <Receipt size={18} />
                      </div>
                      <span className="text-sm font-bold text-slate-900">{expense.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      <Tag size={12} />
                      {expense.category}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-500">{expense.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    {expense.isDeductible ? (
                      <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                        <CheckCircle size={16} />
                        Sí (100%)
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                        <AlertCircle size={16} />
                        No
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-bold text-slate-900">{expense.amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-brand-primary hover:bg-blue-50 rounded-lg transition-all">
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
    </div>
  );
};
