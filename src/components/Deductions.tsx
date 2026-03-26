import React from 'react';
import { Sparkles, Info, CheckCircle, ArrowRight, Lightbulb, Zap, ShieldCheck, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const DeductionCard = ({ title, description, amount, category, icon: Icon, color }: any) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-6"
  >
    <div className="flex items-center justify-between">
      <div className={cn("p-4 rounded-2xl", color)}>
        <Icon size={28} className="text-white" />
      </div>
      <div className="text-right">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Ahorro Estimado</p>
        <p className="text-xl font-bold text-emerald-600">+{amount} €</p>
      </div>
    </div>
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded-lg uppercase">{category}</span>
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
    <button className="mt-auto flex items-center justify-center gap-2 w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-sm transition-all group">
      Aplicar Deducción
      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
    </button>
  </motion.div>
);

export const Deductions: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-serif">Motor de Ahorro</h1>
          <p className="text-slate-500">Optimizamos tu perfil fiscal para que pagues solo lo justo.</p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-100 flex items-center gap-2 font-bold">
          <TrendingUp size={20} />
          Total Ahorro: 1.245,80 €
        </div>
      </div>

      {/* AI Insight Banner */}
      <div className="bg-gradient-to-r from-brand-primary to-blue-600 p-8 rounded-[40px] text-white flex flex-col md:flex-row items-center gap-8 relative overflow-hidden shadow-2xl shadow-brand-primary/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="bg-white/20 p-6 rounded-3xl backdrop-blur-md">
          <Sparkles size={48} className="text-brand-accent" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold mb-2">Análisis de IA Completado</h2>
          <p className="text-blue-100 max-w-2xl">
            He analizado tus últimos 3 meses de actividad y he encontrado 4 nuevas oportunidades de deducción que no estás aprovechando. Podrías reducir tu próximo pago de IRPF en un 12%.
          </p>
        </div>
        <button className="bg-white text-brand-primary px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all shadow-xl">
          Ver Recomendaciones
        </button>
      </div>

      {/* Deductions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <DeductionCard 
          title="Suministros del Hogar"
          description="Al trabajar desde casa, puedes deducir el 30% de la parte proporcional de tus facturas de luz, agua e internet."
          amount="145,20"
          category="Vivienda"
          icon={Zap}
          color="bg-amber-500"
        />
        <DeductionCard 
          title="Software y Herramientas"
          description="Tus suscripciones a Adobe, ChatGPT y Notion son 100% deducibles como herramientas de trabajo."
          amount="85,00"
          category="Digital"
          icon={Lightbulb}
          color="bg-blue-500"
        />
        <DeductionCard 
          title="Seguro de Salud"
          description="Como autónomo, puedes deducir hasta 500€ anuales de tu seguro de salud privado."
          amount="500,00"
          category="Salud"
          icon={ShieldCheck}
          color="bg-emerald-500"
        />
      </div>

      {/* Educational Section */}
      <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-50 p-3 rounded-2xl text-brand-primary">
            <Info size={24} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 font-serif">¿Cómo funcionan las deducciones?</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-4">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">1</div>
            <h4 className="font-bold text-slate-900">Afectación Directa</h4>
            <p className="text-sm text-slate-500 leading-relaxed">El gasto debe estar directamente relacionado con tu actividad profesional para ser deducible.</p>
          </div>
          <div className="space-y-4">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">2</div>
            <h4 className="font-bold text-slate-900">Justificación</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Es imprescindible tener una factura formal o ticket válido que justifique el gasto realizado.</p>
          </div>
          <div className="space-y-4">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">3</div>
            <h4 className="font-bold text-slate-900">Registro Contable</h4>
            <p className="text-sm text-slate-500 leading-relaxed">El gasto debe quedar registrado en tus libros de contabilidad. AutonomIA lo hace por ti.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
