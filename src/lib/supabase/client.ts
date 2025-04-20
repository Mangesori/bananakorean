'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const createClient = () => {
  return createClientComponentClient();
};

export const refreshClientSession = async () => {
  try {
    const supabase = createClientComponentClient();
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
