import React from 'react';
import { LayoutDashboard, Receipt, FileText, PieChart, Bell, User, LogOut, Menu, X, ShoppingBag, Calendar, Sparkles, Landmark, Database, CloudOff } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { isSupabaseConfigured } from '../lib/supabase';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user?: any;
  onLogin?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, user, onLogin }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'invoices', label: 'Facturación', icon: Receipt },
    { id: 'expenses', label: 'Gastos', icon: ShoppingBag },
    { id: 'banking', label: 'Bancos', icon: Landmark },
    { id: 'deductions', label: 'Ahorro IA', icon: Sparkles },
    { id: 'taxes', label: 'Impuestos', icon: FileText },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'reports', label: 'Informes', icon: PieChart },
    { id: 'profile', label: 'Mi Perfil', icon: User },
  ];

  const handleLogout = async () => {
    const { supabase } = await import('../lib/supabase');
    await supabase.auth.signOut();
  };

  const userInitials = user?.user_metadata?.full_name 
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || 'G';

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Invitado';

  return (
    <div className="min-h-screen flex bg-brand-bg">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-2">
          <div className="bg-brand-primary p-2 rounded-xl">
            <FileText className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-brand-primary">AutonomIA</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                activeTab === item.id 
                  ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          {user ? (
            <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-brand-primary font-bold">
                {userInitials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{userName}</p>
                <p className="text-xs text-slate-500 truncate">Plan Premium</p>
              </div>
              <button 
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-500 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <Database size={18} className="text-emerald-400" />
              GitHub Login
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-bottom border-slate-200 sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 text-slate-600"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-semibold text-slate-800 capitalize">
              {navItems.find(i => i.id === activeTab)?.label || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {isSupabaseConfigured ? (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100" title="Conectado a Supabase">
                <Database size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider hidden lg:inline">Cloud Sync</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 text-amber-600 rounded-lg border border-amber-100" title="Modo Local (Sin Supabase)">
                <CloudOff size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider hidden lg:inline">Local Mode</span>
              </div>
            )}
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <button 
              onClick={() => setActiveTab('profile')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors",
                activeTab === 'profile' ? "bg-brand-primary/10 text-brand-primary" : "hover:bg-slate-100"
              )}
            >
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                <User size={18} className={activeTab === 'profile' ? "text-brand-primary" : "text-slate-600"} />
              </div>
              <span className="text-sm font-medium hidden sm:inline">Mi Perfil</span>
            </button>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-50 md:hidden flex flex-col"
            >
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-brand-primary p-2 rounded-xl">
                    <FileText className="text-white" size={24} />
                  </div>
                  <span className="text-xl font-bold tracking-tight text-brand-primary">AutonomIA</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <nav className="flex-1 px-4 py-4 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                      activeTab === item.id 
                        ? "bg-brand-primary text-white" 
                        : "text-slate-500 hover:bg-slate-50"
                    )}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="p-6 border-t border-slate-100">
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-brand-primary font-bold">
                      {userInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{userName}</p>
                      <p className="text-xs text-slate-500 truncate">Plan Premium</p>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="text-slate-400"
                    >
                      <LogOut size={20} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onLogin?.();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    <Database size={18} className="text-emerald-400" />
                    GitHub Login
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
