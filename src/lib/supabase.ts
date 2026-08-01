import { createClient } from '@supabase/supabase-js';

function getEnvVar(key: string, defaultValue: string): string {
  try {
    const metaEnv = (import.meta as any).env;
    if (metaEnv && metaEnv[key]) {
      return metaEnv[key];
    }
  } catch {
    // Ignore error
  }
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key] as string;
    }
  } catch {
    // Ignore error
  }
  return defaultValue;
}

// Default Supabase project configuration provided by user
export const SUPABASE_URL = getEnvVar(
  'VITE_SUPABASE_URL',
  'https://uqkhrynrdobxglnjguhb.supabase.co'
);

export const SUPABASE_ANON_KEY = getEnvVar(
  'VITE_SUPABASE_ANON_KEY',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxa2hyeW5yZG9ieGdsbmpndWhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMjIyNjgsImV4cCI6MjEwMDg5ODI2OH0.BiIcNHY2tCtGtFKor5Dtpml4RfOKr6-xW8mlHUS4Y9c'
);

export const SUPABASE_SERVICE_ROLE_KEY = getEnvVar(
  'SUPABASE_SERVICE_ROLE_KEY',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxa2hyeW5yZG9ieGdsbmpndWhiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTMyMjI2OCwiZXhwIjoyMTAwODk4MjY4fQ.3_FzZWCFVWN5jjEce5eW14u6i_m8iLg6s75MH3p7m_E'
);

// Public Supabase client for browser and API queries
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'edunls_supabase_auth_token',
  },
});

// Service role Supabase client for administrative/server-side operations
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});
