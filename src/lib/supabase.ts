import { createClient } from '@supabase/supabase-js';

// Default Supabase project configuration provided by user
export const SUPABASE_URL = 
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
  (import.meta as any).env?.VITE_SUPABASE_URL ||
  'https://uqkhrynrdobxglnjguhb.supabase.co';

export const SUPABASE_ANON_KEY = 
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) ||
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxa2hyeW5yZG9ieGdsbmpndWhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMjIyNjgsImV4cCI6MjEwMDg5ODI2OH0.BiIcNHY2tCtGtFKor5Dtpml4RfOKr6-xW8mlHUS4Y9c';

export const SUPABASE_SERVICE_ROLE_KEY = 
  (typeof process !== 'undefined' && process.env?.SUPABASE_SERVICE_ROLE_KEY) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxa2hyeW5yZG9ieGdsbmpndWhiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTMyMjI2OCwiZXhwIjoyMTAwODk4MjY4fQ.3_FzZWCFVWN5jjEce5eW14u6i_m8iLg6s75MH3p7m_E';

// Public Supabase client for browser and API queries
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Service role Supabase client for administrative/server-side operations
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
