import { z } from 'zod';
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

/**
 * 액션 상태 타입
 */
export type ActionState = {
  error?: string;
  success?: boolean;
  message?: string;
  [key: string]: any;
};

/**
 * 서버 액션용 Supabase 클라이언트 생성
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set(name, value, options);
          } catch (error) {
            // 서버 컴포넌트에서 쿠키 설정은 무시될 수 있음
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set(name, '', options);
          } catch (error) {
            // 서버 컴포넌트에서 쿠키 제거는 무시될 수 있음
          }
        },
      },
    }
  );
}

/**
 * Zod 스키마 검증과 함께 Server Action 실행
 * @param schema - Zod 스키마
 * @param action - 실행할 액션 함수
 */
export function validatedAction<S extends z.ZodType<any, any>, T>(
  schema: S,
  action: (data: z.infer<S>, formData: FormData) => Promise<T>
) {
  return async (prevState: ActionState, formData: FormData): Promise<T | ActionState> => {
    // FormData를 객체로 변환
    const formDataObj = Object.fromEntries(formData);

    // Zod 스키마로 검증
    const result = schema.safeParse(formDataObj);

    if (!result.success) {
      // 첫 번째 에러 메시지 반환
      return { error: result.error.issues[0].message };
    }

    // 검증 성공 시 액션 실행
    return action(result.data, formData);
  };
}

/**
 * 인증된 사용자만 접근 가능한 Server Action
 * @param schema - Zod 스키마
 * @param action - 실행할 액션 함수 (user 파라미터 포함)
 */
export function validatedActionWithUser<S extends z.ZodType<any, any>, T>(
  schema: S,
  action: (data: z.infer<S>, formData: FormData, user: any) => Promise<T>
) {
  return async (prevState: ActionState, formData: FormData): Promise<T | ActionState> => {
    // 사용자 인증 확인
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: '인증이 필요합니다.' };
    }

    // FormData를 객체로 변환
    const formDataObj = Object.fromEntries(formData);

    // Zod 스키마로 검증
    const result = schema.safeParse(formDataObj);

    if (!result.success) {
      // 첫 번째 에러 메시지 반환
      return { error: result.error.issues[0].message };
    }

    // 검증 성공 시 액션 실행
    return action(result.data, formData, user);
  };
}

/**
 * 현재 로그인한 사용자 정보 가져오기
 */
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * 현재 로그인한 사용자의 프로필 정보 가져오기
 */
export async function getUserProfile() {
  const user = await getUser();

  if (!user) {
    return null;
  }

  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('프로필 조회 오류:', error);
    return null;
  }

  return profile;
}
