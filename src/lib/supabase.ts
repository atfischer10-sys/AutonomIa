import { createClient } from '@supabase/supabase-js';

// Fallback for environment variables in different environments
const getEnv = (name: string) => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[name]) {
    return import.meta.env[name];
  }
  // @ts-ignore - process might be defined globally in some environments
  if (typeof process !== 'undefined' && process.env && process.env[name]) {
    return process.env[name];
  }
  return undefined;
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || getEnv('SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('SUPABASE_ANON_KEY');

// Helper to ensure we always pass a valid URL format to createClient
const getValidUrl = (url: string | undefined) => {
  if (!url) return 'https://placeholder.supabase.co';
  try {
    const cleanUrl = url.trim();
    const parsed = new URL(cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`);
    return parsed.toString();
  } catch {
    return 'https://placeholder.supabase.co';
  }
};

const finalUrl = getValidUrl(supabaseUrl);
const finalKey = (supabaseAnonKey || 'placeholder').trim();

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey && finalUrl !== 'https://placeholder.supabase.co';

if (!isSupabaseConfigured) {
  console.warn('Supabase credentials missing or invalid. Detected variables:', {
    hasViteUrl: !!getEnv('VITE_SUPABASE_URL'),
    hasUrl: !!getEnv('SUPABASE_URL'),
    hasViteKey: !!getEnv('VITE_SUPABASE_ANON_KEY'),
    hasKey: !!getEnv('SUPABASE_ANON_KEY')
  });
}

// Initialize Supabase client with explicit fetch to avoid environment conflicts
export const supabase = createClient(finalUrl, finalKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    // Explicitly provide fetch to prevent Supabase from trying to polyfill it
    fetch: (input: RequestInfo | URL, init?: RequestInit) => window.fetch(input, init),
  },
});
