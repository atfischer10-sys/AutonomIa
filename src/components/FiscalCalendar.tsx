import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, AlertCircle, CheckCircle, Info, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addDays,
  isToday,
  startOfYear,
  endOfYear
} from 'date-fns';
import { es } from 'date-fns/locale';

interface FiscalEvent {
  date: Date;
  title: string;
  type: 'deadline' | 'info';
  priority: 'high' | 'medium' | 'low';
  description?: string;
}

const fiscalEvents: FiscalEvent[] = [
  // Enero
  { date: new Date(2026, 0, 20), title: 'Modelo 111 (Retenciones)', type: 'deadline', priority: 'high' },
  { date: new Date(2026, 0, 30), title: 'Modelo 303 (IVA Q4)', type: 'deadline', priority: 'high' },
  { date: new Date(2026, 0, 30), title: 'Modelo 130 (IRPF Q4)', type: 'deadline', priority: 'high' },
  { date: new Date(2026, 0, 30), title: 'Modelo 390 (Resumen IVA)', type: 'deadline', priority: 'high' },
  
  // Febrero
  { date: new Date(2026, 1, 28), title: 'Modelo 347 (Op. Terceros)', type: 'deadline', priority: 'medium' },
  
  // Abril
  { date: new Date(2026, 3, 1), title: 'Inicio Campaña Renta', type: 'info', priority: 'medium' },
  { date: new Date(2026, 3, 20), title: 'Modelo 303 (IVA Q1)', type: 'deadline', priority: 'high' },
  { date: new Date(2026, 3, 20), title: 'Modelo 130 (IRPF Q1)', type: 'deadline', priority: 'high' },
  { date: new Date(2026, 3, 20), title: 'Modelo 111 (Retenciones Q1)', type: 'deadline', priority: 'high' },
  
  // Junio
  { date: new Date(2026, 5, 30), title: 'Fin Campaña Renta', type: 'deadline', priority: 'high' },
  
  // Julio
  { date: new Date(2026, 6, 20), title: 'Modelo 303 (IVA Q2)', type: 'deadline', priority: 'high' },
  { date: new Date(2026, 6, 20), title: 'Modelo 130 (IRPF Q2)', type: 'deadline', priority: 'high' },
  { date: new Date(2026, 6, 20), title: 'Modelo 111 (Retenciones Q2)', type: 'deadline', priority: 'high' },
  
  // Octubre
  { date: new Date(2026, 9, 20), title: 'Modelo 303 (IVA Q3)', type: 'deadline', priority: 'high' },
  { date: new Date(2026, 9, 20), title: 'Modelo 130 (IRPF Q3)', type: 'deadline', priority: 'high' },
  { date: new Date(2026, 9, 20), title: 'Modelo 111 (Retenciones Q3)', type: 'deadline', priority: 'high' },
];

export const FiscalCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1)); // Start in April 2026

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const currentMonthEvents = fiscalEvents.filter(event => 
    isSameMonth(event.date, currentDate)
  ).sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-serif">Calendario Fiscal 2026</h1>
          <p className="text-slate-500">Planifica tus impuestos y evita recargos. AutonomIA te mantiene al día.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
            <CalendarIcon size={18} />
            Sincronizar con Google Calendar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900 font-serif capitalize">
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={prevMonth}
                className="p-2 hover:bg-slate-50 rounded-lg border border-slate-100 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={nextMonth}
                className="p-2 hover:bg-slate-50 rounded-lg border border-slate-100 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
              <div key={d} className="text-center text-xs font-bold text-slate-400 uppercase py-2">{d}</div>
            ))}
            
            {calendarDays.map((day, idx) => {
              const dayEvents = fiscalEvents.filter(e => isSameDay(e.date, day));
              const isCurrentMonth = isSameMonth(day, monthStart);
              const isTodayDay = isToday(day);
              
              return (
                <div 
                  key={idx} 
                  className={cn(
                    "aspect-square rounded-2xl border border-slate-50 flex flex-col items-center justify-center relative transition-all hover:bg-slate-50 cursor-pointer",
                    !isCurrentMonth && "opacity-20",
                    isTodayDay ? "bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20" : "bg-white text-slate-700",
                    dayEvents.length > 0 && !isTodayDay && "border-brand-primary/30 bg-blue-50/30"
                  )}
                >
                  <span className="text-sm font-bold">{format(day, 'd')}</span>
                  {dayEvents.length > 0 && (
                    <div className="absolute bottom-2 flex gap-0.5">
                      {dayEvents.map((e, i) => (
                        <div key={i} className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          e.priority === 'high' ? "bg-rose-500" : "bg-brand-primary"
                        )} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events List */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 font-serif mb-6">Plazos de {format(currentDate, 'MMMM', { locale: es })}</h3>
            <div className="space-y-6">
              {currentMonthEvents.length > 0 ? (
                currentMonthEvents.map((event, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center justify-center bg-slate-50 rounded-2xl w-14 h-14 shrink-0 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{format(event.date, 'MMM', { locale: es })}</span>
                      <span className="text-lg font-bold text-slate-900">{format(event.date, 'd')}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{event.title}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className={cn("w-2 h-2 rounded-full", event.priority === 'high' ? "bg-rose-500" : "bg-brand-primary")} />
                        <span className="text-xs text-slate-500">Prioridad {event.priority === 'high' ? 'Alta' : 'Media'}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-400 text-sm italic">No hay plazos fiscales este mes.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-brand-primary p-8 rounded-3xl text-white relative overflow-hidden">
            <Sparkles className="absolute top-4 right-4 text-white/20" size={48} />
            <h4 className="text-lg font-bold mb-2">Asistente Virtual dice:</h4>
            <p className="text-sm text-blue-100 leading-relaxed">
              {currentMonthEvents.length > 0 
                ? `"Recuerda que este mes tienes ${currentMonthEvents.length} plazos importantes. He preparado los borradores necesarios para que no te preocupes por nada."`
                : `"Este mes es tranquilo en cuanto a impuestos. ¡Aprovecha para organizar tus facturas y optimizar tus gastos!"`}
            </p>
            {currentMonthEvents.length > 0 && (
              <button className="mt-6 w-full bg-white text-brand-primary py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
                Revisar Borradores
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
