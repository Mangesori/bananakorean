'use client';

import { createBrowserClient } from '@supabase/ssr';

let client: ReturnType<typeof createBrowserClient> | undefined;

export const createClient = () => {
  if (client) return client;

  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return client;
};

export const refreshClientSession = async () => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('세션 갱신 실패:', error.message);
      return { session: null, error };
    }

    return { session: data.session, error: null };
  } catch (err) {
    console.error('세션 확인 중 예외 발생:', err);
    return {
      session: null,
      error: err instanceof Error ? err : new Error('알 수 없는 오류'),
    };
  }
};
