import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Building2, CreditCard, ShieldCheck, ArrowRight, Check, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface OnboardingProps {
  onComplete: () => void;
}

const steps = [
  {
    id: 'welcome',
    title: 'Bienvenido a AutonomIA',
    description: 'Tu piloto automático fiscal. Vamos a configurar tu perfil en menos de 2 minutos.',
    icon: Sparkles,
  },
  {
    id: 'fiscal',
    title: 'Perfil Fiscal',
    description: 'Necesitamos conocer tu actividad para automatizar tus impuestos.',
    icon: Building2,
  },
  {
    id: 'bank',
    title: 'Conexión Bancaria',
    description: 'Conecta tu banco para que la IA categorice tus gastos automáticamente.',
    icon: CreditCard,
  },
  {
    id: 'ready',
    title: '¡Todo listo!',
    description: 'Ya puedes empezar a facturar y ahorrar tiempo.',
    icon: ShieldCheck,
  }
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      onComplete();
    } else if (currentStep === 2) {
      setIsConnecting(true);
      setTimeout(() => {
        setIsConnecting(false);
        setCurrentStep(prev => prev + 1);
      }, 2000);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const StepIcon = steps[currentStep].icon;

  return (
    <div className="fixed inset-0 bg-brand-bg z-[100] flex items-center justify-center p-6">
      <div className="max-w-xl w-full">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-12">
          {steps.map((_, idx) => (
            <div 
              key={idx} 
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all duration-500",
                idx <= currentStep ? "bg-brand-primary" : "bg-slate-200"
              )}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white p-10 rounded-[40px] shadow-2xl border border-slate-100 text-center"
          >
            <div className="w-20 h-20 bg-blue-50 text-brand-primary rounded-3xl flex items-center justify-center mx-auto mb-8">
              <StepIcon size={40} />
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-4 font-serif">{steps[currentStep].title}</h2>
            <p className="text-slate-500 mb-10 leading-relaxed">{steps[currentStep].description}</p>

            {currentStep === 1 && (
              <div className="space-y-4 mb-10 text-left">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Actividad</label>
                  <select className="w-full bg-transparent border-none focus:ring-0 font-medium">
                    <option>Servicios de Programación y Diseño</option>
                    <option>Consultoría de Marketing</option>
                    <option>Redacción y Traducción</option>
                  </select>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">NIF / NIE</label>
                  <input type="text" placeholder="12345678X" className="w-full bg-transparent border-none focus:ring-0 font-medium" />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="grid grid-cols-2 gap-4 mb-10">
                {['BBVA', 'Santander', 'CaixaBank', 'Revolut'].map(bank => (
                  <button key={bank} className="p-4 border border-slate-200 rounded-2xl hover:border-brand-primary hover:bg-blue-50 transition-all font-bold text-slate-700">
                    {bank}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={handleNext}
              disabled={isConnecting}
              className="w-full bg-brand-primary text-white py-4 rounded-2xl font-bold shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {isConnecting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Conectando con tu banco...
                </>
              ) : (
                <>
                  {currentStep === steps.length - 1 ? 'Empezar ahora' : 'Continuar'}
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            {currentStep === 0 && (
              <p className="mt-6 text-xs text-slate-400">
                Al continuar, aceptas nuestros términos y política de privacidad.
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* AI Tip */}
          <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex items-center justify-center gap-2 text-slate-400 text-sm"
        >
          <Sparkles size={16} className="text-brand-primary" />
          <span>AutonomIA está configurando tu motor fiscal Veri*factu 2026</span>
        </motion.div>
      </div>
    </div>
  );
};
