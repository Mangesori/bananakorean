'use client';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase = null;

if (typeof window !== 'undefined') {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      storageKey: 'auth-storage',
      storage: window.localStorage,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
} else {
  // 서버 사이드에서 사용할 수 있는 기본 클라이언트
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });
}

export { supabase };
