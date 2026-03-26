import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Invoicing } from './components/Invoicing';
import { Expenses } from './components/Expenses';
import { Deductions } from './components/Deductions';
import { TaxesView } from './components/TaxesView';
import { FiscalCalendar } from './components/FiscalCalendar';
import { Onboarding } from './components/Onboarding';
import { Copilot } from './components/Copilot';
import { Profile } from './components/Profile';
import { Banking } from './components/Banking';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Loader2, X } from 'lucide-react';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { Invoice, Expense, BankAccount, BankTransaction } from './types';
import { GoogleGenAI } from "@google/genai";

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [accounts, setAccounts] = useState<BankAccount[]>([
    {
      id: 'acc-1',
      name: 'Cuenta Corriente',
      bankName: 'BBVA',
      balance: 12450.80,
      currency: 'EUR',
      lastSync: 'Hoy, 10:30',
      accountNumber: 'ES21 **** 4567',
      status: 'active'
    },
    {
      id: 'acc-2',
      name: 'Tarjeta de Empresa',
      bankName: 'Revolut Business',
      balance: 3210.45,
      currency: 'EUR',
      lastSync: 'Ayer, 18:45',
      accountNumber: 'LT45 **** 8901',
      status: 'active'
    }
  ]);
  const [transactions, setTransactions] = useState<BankTransaction[]>([
    {
      id: 'tx-1',
      accountId: 'acc-1',
      date: '2026-03-24',
      description: 'Amazon Web Services - Cloud Hosting',
      amount: -145.20,
      category: 'Software & Cloud',
      isCategorized: true
    },
    {
      id: 'tx-2',
      accountId: 'acc-1',
      date: '2026-03-23',
      description: 'TRANSFERENCIA RECIBIDA: CLIENTE XYZ - FACTURA INV-2026-001',
      amount: 2500.00,
      category: 'Ingresos',
      isCategorized: true
    },
    {
      id: 'tx-3',
      accountId: 'acc-2',
      date: '2026-03-22',
      description: 'Restaurante El Celler - Comida de Negocios',
      amount: -85.50,
      category: '',
      isCategorized: false
    },
    {
      id: 'tx-4',
      accountId: 'acc-2',
      date: '2026-03-21',
      description: 'Uber * Trip - Desplazamiento Cliente',
      amount: -18.40,
      category: '',
      isCategorized: false
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Auth check and data fetching
  useEffect(() => {
    if (!supabase || !supabase.auth || typeof supabase.auth.onAuthStateChange !== 'function') {
      console.error('Supabase client or auth module not initialized correctly');
      setLoading(false);
      return;
    }

    // Handle auth callback if we are in the callback route
    if (window.location.pathname === '/auth/callback') {
      const handleCallback = async () => {
        try {
          // The Supabase client will automatically handle the code/hash exchange
          const { data, error } = await supabase.auth.getSession();
          if (error) throw error;
          
          if (window.opener) {
            window.opener.postMessage({ 
              type: 'SUPABASE_AUTH_SUCCESS',
              session: data.session 
            }, '*');
            // Give it a moment to send the message before closing
            setTimeout(() => window.close(), 500);
          } else {
            window.location.href = '/';
          }
        } catch (error) {
          console.error('Error in auth callback:', error);
          if (window.opener) {
            window.opener.postMessage({ type: 'SUPABASE_AUTH_ERROR', error: 'Error en la autenticación' }, '*');
            setTimeout(() => window.close(), 500);
          }
        }
      };
      handleCallback();
      return;
    }

    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        
        if (session?.user) {
          fetchData();
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking user session:', error);
        setLoading(false);
      }
    };

    checkUser();

    // Listen for success message from popup
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'SUPABASE_AUTH_SUCCESS') {
        if (event.data.session) {
          // Manually set the session to ensure it's captured in the iframe
          await supabase.auth.setSession(event.data.session);
        }
        checkUser();
      } else if (event.data?.type === 'SUPABASE_AUTH_ERROR') {
        setAuthError(event.data.error || 'Error al iniciar sesión');
      }
    };
    window.addEventListener('message', handleMessage);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchData();
      } else {
        setInvoices([]);
        setExpenses([]);
        setLoading(false);
      }
    });

    return () => {
      window.removeEventListener('message', handleMessage);
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    setAuthError(null);
    try {
      if (!isSupabaseConfigured) {
        setAuthError('Configuración de Supabase incompleta. Por favor, añade VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en los Secretos de AI Studio.');
        return;
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          skipBrowserRedirect: true,
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
      if (data?.url) {
        const authWindow = window.open(data.url, 'supabase_auth', 'width=600,height=700');
        if (!authWindow) {
          setAuthError('El popup fue bloqueado. Por favor, permite los popups para esta página.');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setAuthError(error.message || 'Error al iniciar sesión con GitHub');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [invoicesRes, expensesRes] = await Promise.all([
        supabase.from('invoices').select('*').order('date', { ascending: false }),
        supabase.from('expenses').select('*').order('date', { ascending: false })
      ]);

      if (invoicesRes.data) setInvoices(invoicesRes.data);
      if (expensesRes.data) setExpenses(expensesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if onboarding was already completed
  useEffect(() => {
    const completed = localStorage.getItem('autonomia_onboarding_completed');
    if (completed) setShowOnboarding(false);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('autonomia_onboarding_completed', 'true');
    setShowOnboarding(false);
  };

  const handleConnectBank = () => {
    const newAccount: BankAccount = {
      id: `acc-${Date.now()}`,
      name: 'Nueva Cuenta',
      bankName: 'Banco Santander',
      balance: 5000.00,
      currency: 'EUR',
      lastSync: 'Ahora',
      accountNumber: 'ES45 **** 1234',
      status: 'active'
    };
    setAccounts([...accounts, newAccount]);
  };

  const handleSyncAccount = (accountId: string) => {
    setAccounts(prev => prev.map(acc => 
      acc.id === accountId ? { ...acc, lastSync: 'Ahora', status: 'active' } : acc
    ));
  };

  const handleDeleteAccount = (accountId: string) => {
    setAccounts(prev => prev.filter(acc => acc.id !== accountId));
    // Optionally also filter transactions for that account
    setTransactions(prev => prev.filter(tx => tx.accountId !== accountId));
  };

  const handleCategorizeTransaction = async (transactionId: string) => {
    const tx = transactions.find(t => t.id === transactionId);
    if (!tx) return;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Categoriza este movimiento bancario para un autónomo en España. Responde SOLO con el nombre de la categoría (ej: Restauración, Transporte, Software, Suministros, etc.): "${tx.description}"`,
      });

      const category = response.text?.trim() || 'Otros';
      
      setTransactions(prev => prev.map(t => 
        t.id === transactionId ? { ...t, category, isCategorized: true } : t
      ));

      if (tx.amount < 0) {
        const newExpense: Expense = {
          id: `exp-${Date.now()}`,
          description: tx.description,
          date: tx.date,
          amount: Math.abs(tx.amount),
          vat: Math.abs(tx.amount) * 0.21,
          category: category,
          isDeductible: true
        };
        setExpenses([newExpense, ...expenses]);
      }
    } catch (error) {
      console.error('Error categorizing with AI:', error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard invoices={invoices} setInvoices={setInvoices} expenses={expenses} />;
      case 'invoices': return <Invoicing invoices={invoices} setInvoices={setInvoices} />;
      case 'expenses': return <Expenses expenses={expenses} setExpenses={setExpenses} />;
      case 'banking': return (
        <Banking 
          accounts={accounts} 
          transactions={transactions} 
          onConnectBank={handleConnectBank}
          onSync={handleSyncAccount}
          onCategorize={handleCategorizeTransaction}
          onDeleteAccount={handleDeleteAccount}
        />
      );
      case 'deductions': return <Deductions />;
      case 'taxes': return <TaxesView invoices={invoices} expenses={expenses} />;
      case 'calendar': return <FiscalCalendar />;
      case 'profile': return <Profile user={user} onLogin={handleLogin} />;
      case 'reports': return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-blue-50 p-6 rounded-full mb-6">
            <AlertCircle size={48} className="text-brand-primary" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-serif mb-2">Informes Avanzados</h2>
          <p className="text-slate-500 max-w-md">
            Estamos preparando informes personalizados con IA para que entiendas mejor la rentabilidad de tu negocio.
          </p>
        </div>
      );
      default: return <Dashboard invoices={invoices} setInvoices={setInvoices} expenses={expenses} />;
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-brand-primary" size={40} />
          <p className="text-slate-500 font-medium">Sincronizando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
      </AnimatePresence>

      <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogin={handleLogin}>
        {authError && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-700 text-sm"
          >
            <AlertCircle size={18} className="shrink-0" />
            <div className="flex-1">{authError}</div>
            <button onClick={() => setAuthError(null)} className="p-1 hover:bg-rose-100 rounded-full transition-colors">
              <X size={16} />
            </button>
          </motion.div>
        )}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </Layout>

      <Copilot />
    </>
  );
}
