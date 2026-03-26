import React from 'react';
import { LayoutDashboard, Receipt, FileText, PieChart, Bell, User, LogOut, Menu, X, ShoppingBag, Calendar, Sparkles, Landmark, Database, CloudOff, Info, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { isSupabaseConfigured } from '../lib/supabase';
import { AppNotification } from '../types';

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
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab, 
  user, 
  onLogin,
  notifications,
  setNotifications
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

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
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={cn(
                  "relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors",
                  isNotificationsOpen && "bg-slate-100 text-brand-primary"
                )}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsNotificationsOpen(false)} 
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900">Notificaciones</h3>
                        <button 
                          onClick={markAllAsRead}
                          className="text-xs text-brand-primary hover:underline font-medium"
                        >
                          Marcar todo como leído
                        </button>
                      </div>
                      <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notif) => (
                            <button
                              key={notif.id}
                              onClick={() => {
                                if (notif.link) setActiveTab(notif.link);
                                setIsNotificationsOpen(false);
                                setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
                              }}
                              className={cn(
                                "w-full p-4 text-left hover:bg-slate-50 transition-colors flex gap-3 border-b border-slate-50 last:border-0",
                                !notif.isRead && "bg-blue-50/30"
                              )}
                            >
                              <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                notif.type === 'tax' ? "bg-amber-100 text-amber-600" :
                                notif.type === 'payment' ? "bg-rose-100 text-rose-600" :
                                "bg-blue-100 text-blue-600"
                              )}>
                                {notif.type === 'tax' ? <AlertTriangle size={18} /> :
                                 notif.type === 'payment' ? <CheckCircle2 size={18} /> :
                                 <Info size={18} />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                  <p className={cn("text-sm font-bold truncate", !notif.isRead ? "text-slate-900" : "text-slate-600")}>
                                    {notif.title}
                                  </p>
                                  <span className="text-[10px] text-slate-400">{notif.date}</span>
                                </div>
                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                  {notif.description}
                                </p>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="p-8 text-center">
                            <Bell size={32} className="mx-auto text-slate-200 mb-2" />
                            <p className="text-sm text-slate-400">No tienes notificaciones</p>
                          </div>
                        )}
                      </div>
                      <div className="p-3 bg-slate-50 text-center">
                        <button 
                          onClick={() => {
                            setActiveTab('calendar');
                            setIsNotificationsOpen(false);
                          }}
                          className="text-xs text-slate-500 hover:text-brand-primary font-medium flex items-center justify-center gap-1 mx-auto"
                        >
                          Ver calendario fiscal <ChevronRight size={12} />
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
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
