import React, { useState } from 'react';
import { User, Building2, Mail, Phone, MapPin, ShieldCheck, Save, Camera, CreditCard, Bell, Lock, LogOut, Database, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { cn } from '../lib/utils';

interface ProfileProps {
  user: any;
  onLogin?: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onLogin }) => {
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || 'Anthony Fischer',
    email: user?.email || 'anthonyfischer@seedtag.com',
    nif: '48291029X',
    phone: '+34 600 000 000',
    address: 'Calle de la Innovación, 42, 28001 Madrid',
    businessName: 'Fischer Consulting SL',
    activity: 'Servicios de Consultoría Tecnológica',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Perfil actualizado correctamente');
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-serif">Mi Perfil</h1>
          <p className="text-slate-500">Gestiona tu información personal y profesional.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-brand-primary text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-brand-primary/20 hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? 'Guardando...' : (
            <>
              <Save size={18} />
              Guardar Cambios
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Basic Info */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-brand-primary text-4xl font-bold border-4 border-white shadow-lg">
                AF
              </div>
              <button className="absolute bottom-0 right-0 bg-brand-primary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-all">
                <Camera size={18} />
              </button>
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-900">{formData.name}</h3>
            <p className="text-slate-500 text-sm">Autónomo • Plan Premium</p>
            
            {user ? (
              <button 
                onClick={() => supabase.auth.signOut()}
                className="mt-6 w-full flex items-center justify-center gap-2 py-3 px-4 bg-rose-50 text-rose-600 rounded-xl font-semibold hover:bg-rose-100 transition-all"
              >
                <LogOut size={18} />
                Cerrar Sesión
              </button>
            ) : (
              <button 
                onClick={onLogin}
                className="mt-6 w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-lg"
              >
                <Database size={18} className="text-emerald-400" />
                GitHub Login
              </button>
            )}

            <div className="mt-6 w-full pt-6 border-t border-slate-50 space-y-3">
              <div className="flex items-center gap-3 text-slate-600 text-sm">
                <Mail size={16} className="text-slate-400" />
                {formData.email}
              </div>
              <div className="flex items-center gap-3 text-slate-600 text-sm">
                <Phone size={16} className="text-slate-400" />
                {formData.phone}
              </div>
            </div>

            <div className={cn(
              "mt-6 w-full p-4 rounded-2xl border flex flex-col gap-2 text-left",
              isSupabaseConfigured ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-100"
            )}>
              <div className="flex items-center gap-2">
                <Database size={16} className={isSupabaseConfigured ? "text-emerald-500" : "text-amber-500"} />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Estado de la Nube</span>
              </div>
              <div className="flex items-center gap-2">
                {isSupabaseConfigured ? (
                  <>
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span className="text-sm text-emerald-700 font-medium">Supabase Conectado</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={14} className="text-amber-500" />
                    <span className="text-sm text-amber-700 font-medium">Modo Local (Sin Nube)</span>
                  </>
                )}
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                {isSupabaseConfigured 
                  ? (user ? "Tus datos se guardan automáticamente en la base de datos." : "Conectado a la nube, pero necesitas iniciar sesión para guardar permanentemente.")
                  : "Las variables de entorno no están configuradas. Los datos se guardarán solo en esta sesión."}
              </p>
              {isSupabaseConfigured && user && (
                <button 
                  onClick={async () => {
                    const { error } = await supabase.from('invoices').select('id').limit(1);
                    if (error) {
                      alert(`Error de conexión a tablas: ${error.message}. Asegúrate de haber creado las tablas en Supabase.`);
                    } else {
                      alert('¡Conexión a Supabase y tablas confirmada con éxito!');
                    }
                  }}
                  className="mt-2 text-[10px] font-bold text-brand-primary hover:underline flex items-center gap-1"
                >
                  <Database size={10} />
                  Probar conexión a tablas
                </button>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-500" />
              Estado Veri*factu
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Certificado Digital</span>
                <span className="text-emerald-600 font-bold">Activo</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Conexión AEAT</span>
                <span className="text-emerald-600 font-bold">Vinculada</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl text-[10px] text-slate-400 font-mono">
                ID: VF-CERT-2026-8829-X
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Forms */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 font-serif mb-6">Información Profesional</h3>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Nombre Completo</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">NIF / NIE</label>
                <input 
                  type="text" 
                  value={formData.nif}
                  onChange={e => setFormData({...formData, nif: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">Nombre Comercial / Empresa</label>
                <input 
                  type="text" 
                  value={formData.businessName}
                  onChange={e => setFormData({...formData, businessName: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">Dirección Fiscal</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">Actividad Económica (CNAE)</label>
                <input 
                  type="text" 
                  value={formData.activity}
                  onChange={e => setFormData({...formData, activity: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                />
              </div>
            </form>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 font-serif mb-6">Preferencias y Seguridad</h3>
            <div className="space-y-4">
              {[
                { icon: Bell, label: 'Notificaciones Fiscales', desc: 'Alertas sobre vencimientos de modelos y requerimientos.', active: true },
                { icon: CreditCard, label: 'Método de Pago', desc: 'Gestiona tu suscripción y facturas de AutonomIA.', active: false },
                { icon: Lock, label: 'Seguridad y Acceso', desc: 'Cambia tu contraseña y activa la verificación en dos pasos.', active: false },
              ].map((item, idx) => (
                <button key={idx} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-100 text-slate-600 rounded-xl">
                      <item.icon size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-900 text-sm">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                  <div className="text-slate-400">
                    <Save size={16} className="rotate-[-90deg]" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
