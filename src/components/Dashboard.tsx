import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Wallet, Calculator, AlertCircle, ArrowUpRight, ArrowDownRight, Sparkles, FileText, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, calculateFiscalSummary2026 } from '../lib/utils';
import { InvoiceForm } from './InvoiceForm';
import { Invoice, Expense } from '../types';
import { supabase } from '../lib/supabase';

const StatCard = ({ title, value, subValue, icon: Icon, trend, color }: any) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-4"
  >
    <div className="flex items-center justify-between">
      <div className={cn("p-3 rounded-2xl", color)}>
        <Icon size={24} className="text-white" />
      </div>
      {trend !== undefined && (
        <div className={cn("flex items-center gap-1 text-sm font-medium", trend > 0 ? "text-emerald-600" : "text-rose-600")}>
          {trend > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      {subValue && <p className="text-xs text-slate-400 mt-1">{subValue}</p>}
    </div>
  </motion.div>
);

interface DashboardProps {
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  expenses: Expense[];
}

export const Dashboard: React.FC<DashboardProps> = ({ invoices, setInvoices, expenses }) => {
  const [showForm, setShowForm] = useState(false);
  const summary = calculateFiscalSummary2026(invoices, expenses);

  // Generate dynamic chart data based on invoices and expenses
  const chartData = Array.from({ length: 6 }).map((_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const monthName = date.toLocaleString('es-ES', { month: 'short' });
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    const monthInvoices = invoices.filter(inv => {
      const d = new Date(inv.date);
      return d.getMonth() === monthIndex && d.getFullYear() === year;
    });

    const monthExpenses = expenses.filter(exp => {
      const d = new Date(exp.date);
      return d.getMonth() === monthIndex && d.getFullYear() === year;
    });

    const ingresos = monthInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const gastos = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    return {
      name: monthName.charAt(0).toUpperCase() + monthName.slice(1),
      ingresos,
      gastos,
      impuestos: ingresos * 0.21 - gastos * 0.21
    };
  });

  const handleSaveInvoice = async (newInvoice: Partial<Invoice>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const invoice: Invoice = {
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
      };

      const { error } = await supabase
        .from('invoices')
        .insert([{ ...invoice, user_id: user.id }]);

      if (error) throw error;

      setInvoices([invoice, ...invoices]);
      setShowForm(false);
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Error al guardar la factura. Asegúrate de haber configurado las tablas en Supabase.');
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

      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-serif">Hola, Anthony 👋</h1>
          <p className="text-slate-500">Tu piloto automático fiscal está al día. No hay alertas críticas.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Calculator size={18} />
            Simular Impuestos
          </button>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-brand-primary text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-brand-primary/20 hover:scale-105 transition-all flex items-center gap-2"
          >
            <Sparkles size={18} />
            Nueva Factura
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Ingresos Brutos" 
          value={`${summary.grossIncome.toLocaleString('es-ES')} €`} 
          subValue="Este trimestre"
          icon={TrendingUp} 
          trend={12}
          color="bg-emerald-500"
        />
        <StatCard 
          title="Gastos Deducibles" 
          value={`${summary.totalExpenses.toLocaleString('es-ES')} €`} 
          subValue={`Ahorro IVA: ${summary.totalExpenses * 0.21} €`}
          icon={TrendingDown} 
          trend={-5}
          color="bg-rose-500"
        />
        <StatCard 
          title="IVA Estimado (Veri*factu)" 
          value={`${summary.ivaDue.toLocaleString('es-ES')} €`} 
          subValue="Próximo pago: 20 Abr 2026"
          icon={Wallet} 
          color="bg-amber-500"
        />
        <StatCard 
          title="Dinero Real (Neto)" 
          value={`${summary.estimatedProfit.toLocaleString('es-ES')} €`} 
          subValue="Tras impuestos y cuotas 2026"
          icon={Sparkles} 
          color="bg-brand-primary"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900 font-serif">Evolución Financiera</h3>
            <select className="bg-slate-50 border-none text-sm font-medium rounded-lg px-3 py-1.5 focus:ring-0">
              <option>Últimos 6 meses</option>
              <option>Este año</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="ingresos" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIngresos)" />
                <Area type="monotone" dataKey="gastos" stroke="#f43f5e" strokeWidth={3} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-xl font-bold text-slate-900 font-serif mb-6">Próximos Hitos</h3>
          <div className="space-y-6 flex-1">
            <div className="flex gap-4">
              <div className="bg-blue-50 text-brand-primary p-3 rounded-2xl h-fit">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Modelo 303 (IVA)</p>
                <p className="text-xs text-slate-500">Vence en 15 días</p>
                <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-brand-primary h-full w-3/4"></div>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-amber-50 text-amber-600 p-3 rounded-2xl h-fit">
                <AlertCircle size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Retenciones IRPF</p>
                <p className="text-xs text-slate-500">Revisión pendiente</p>
                <button className="mt-2 text-xs font-semibold text-brand-primary hover:underline">
                  Ver detalles
                </button>
              </div>
            </div>
          </div>
          <div className="mt-8 p-4 bg-brand-primary/5 rounded-2xl border border-brand-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-brand-primary" />
              <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">Tip de Ahorro 2026</span>
            </div>
            <p className="text-sm text-slate-700">
              Tu cuota de autónomos se basa ahora en tus ingresos reales. Según tu previsión, estás en el tramo de {Math.round(summary.netIncome / 3)}€/mes. 
              Ajustar tu base podría ahorrarte hasta 45€ mensuales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
