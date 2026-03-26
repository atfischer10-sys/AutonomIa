import React, { useState } from 'react';
import { Landmark, Plus, RefreshCw, ArrowUpRight, ArrowDownLeft, Search, Filter, Sparkles, Shield, ExternalLink, CheckCircle2, AlertCircle, Loader2, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { BankAccount, BankTransaction } from '../types';

interface BankingProps {
  accounts: BankAccount[];
  transactions: BankTransaction[];
  onConnectBank: () => void;
  onSync: (accountId: string) => void;
  onCategorize: (transactionId: string) => void;
  onDeleteAccount: (accountId: string) => void;
}

export const Banking: React.FC<BankingProps> = ({ 
  accounts, 
  transactions, 
  onConnectBank, 
  onSync,
  onCategorize,
  onDeleteAccount
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  const handleSyncAll = async () => {
    setIsSyncingAll(true);
    // Simulate sync
    await new Promise(resolve => setTimeout(resolve, 2000));
    accounts.forEach(acc => onSync(acc.id));
    setIsSyncingAll(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-serif">Bancos y Conciliación</h1>
          <p className="text-slate-500 flex items-center gap-2">
            <Shield size={16} className="text-emerald-500" />
            Conexión segura mediante PSD2 y cifrado bancario.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSyncAll}
            disabled={isSyncingAll}
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw size={18} className={cn(isSyncingAll && "animate-spin")} />
            Sincronizar todo
          </button>
          <button 
            onClick={onConnectBank}
            className="bg-brand-primary text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-brand-primary/20 hover:scale-105 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            Conectar Banco
          </button>
        </div>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <motion.div 
            key={account.id}
            whileHover={{ y: -4 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onDeleteAccount(account.id)}
                className="text-slate-400 hover:text-red-500 transition-colors"
                title="Eliminar conexión"
              >
                <Trash2 size={16} />
              </button>
              <button className="text-slate-400 hover:text-slate-600">
                <ExternalLink size={16} />
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                <Landmark size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{account.name}</h3>
                <p className="text-xs text-slate-500">{account.bankName} • {account.accountNumber}</p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Saldo Actual</p>
              <p className="text-2xl font-bold text-slate-900">
                {account.balance.toLocaleString('es-ES', { style: 'currency', currency: account.currency })}
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  account.status === 'active' ? "bg-emerald-500" : "bg-amber-500"
                )} />
                <span className="text-xs font-medium text-slate-500">
                  {account.status === 'active' ? 'Conectado' : 'Sincronizando...'}
                </span>
              </div>
              <span className="text-[10px] text-slate-400">
                Sincronizado: {account.lastSync}
              </span>
            </div>
          </motion.div>
        ))}
        
        {accounts.length === 0 && (
          <button 
            onClick={onConnectBank}
            className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 hover:border-brand-primary/30 hover:bg-brand-primary/5 transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all">
              <Plus size={24} />
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-900">Conectar tu primer banco</p>
              <p className="text-sm text-slate-500">Sincroniza tus movimientos automáticamente</p>
            </div>
          </button>
        )}
      </div>

      {/* Transactions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Movimientos Recientes</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Buscar movimientos..."
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Concepto</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Categoría IA</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Importe</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          tx.amount < 0 ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-500"
                        )}>
                          {tx.amount < 0 ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                        </div>
                        <span className="text-sm font-medium text-slate-900">{tx.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500">{tx.date}</span>
                    </td>
                    <td className="px-6 py-4">
                      {tx.isCategorized ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <CheckCircle2 size={12} />
                          {tx.category}
                        </div>
                      ) : (
                        <button 
                          onClick={() => onCategorize(tx.id)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-brand-primary/5 text-brand-primary border border-brand-primary/10 hover:bg-brand-primary/10 transition-all"
                        >
                          <Sparkles size={12} />
                          Categorizar con IA
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={cn(
                        "text-sm font-bold",
                        tx.amount < 0 ? "text-slate-900" : "text-emerald-600"
                      )}>
                        {tx.amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!tx.isCategorized ? (
                        <button className="text-xs font-bold text-slate-400 hover:text-brand-primary transition-colors">
                          Omitir
                        </button>
                      ) : (
                        <button className="text-xs font-bold text-brand-primary hover:underline">
                          Ver Gasto
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Sparkles size={120} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
            <Sparkles size={48} className="text-brand-primary" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold mb-2">Conciliación Inteligente</h3>
            <p className="text-slate-300 max-w-xl">
              He detectado 12 movimientos que coinciden con tus facturas emitidas. 
              ¿Quieres que los concilie automáticamente para cerrar el trimestre?
            </p>
          </div>
          <button className="bg-brand-primary text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-brand-primary/20">
            Conciliar ahora
          </button>
        </div>
      </div>
    </div>
  );
};
