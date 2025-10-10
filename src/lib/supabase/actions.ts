'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { type Provider } from '@supabase/supabase-js';
import { validatedAction } from '@/lib/auth/middleware';
import { signInSchema, signUpSchema } from '@/lib/auth/schemas';
import { createClient } from '@/lib/auth/middleware';

/**
 * 인증 관련 서버 액션
 */
// 로그인 액션 (Zod 검증 적용)
export const signInAction = validatedAction(signInSchema, async (data, formData) => {
  const { email, password, rememberMe } = data;
  const supabase = await createClient();

  // Remember Me 처리
  const cookieStore = await cookies();
  if (rememberMe === 'true') {
    // 이메일을 쿠키에 저장 (30일)
    cookieStore.set('remembered_email', email, {
      maxAge: 60 * 60 * 24 * 30, // 30일
      httpOnly: false, // 클라이언트에서 읽을 수 있어야 함
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  } else {
    // Remember Me 체크 해제 시 쿠키 삭제
    cookieStore.delete('remembered_email');
  }

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (!authData.user) {
    return { error: '로그인에 실패했습니다.' };
  }

  // 프로필 조회하여 역할 확인
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', authData.user.id)
    .single();

  if (profileError) {
    console.error('프로필 조회 오류:', profileError);
    // 프로필 조회 실패해도 기본 역할로 처리
  }

  // 사용자 역할에 따른 리디렉션 경로 설정
  const role = profileData?.role || authData.user?.user_metadata?.role || 'student';
  const redirectPath =
    role === 'admin' ? '/dashboards/admin-dashboard' : '/dashboards/student-dashboard';

  // 서버에서 리디렉션 (revalidatePath 추가하여 캐시 갱신)
  const { revalidatePath } = await import('next/cache');
  revalidatePath('/', 'layout');

  redirect(redirectPath);
});

// 회원가입 액션 (Zod 검증 적용)
export const signUpAction = validatedAction(signUpSchema, async (data, formData) => {
  try {
    const { name, email, password } = data;
    const supabase = await createClient();

    // 사용자 생성
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        data: {
          name: name,
          role: 'student', // JWT에 role 포함
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    if (!authData.user) {
      return { error: '회원가입에 실패했습니다.' };
    }

    // 프로필 생성
    const profileResult = await createUserProfile(supabase, {
      id: authData.user.id,
      email: authData.user.email!,
      role: 'student',
    });

    if (profileResult.error) {
      console.error('프로필 생성 오류:', profileResult.error);
      // 프로필 생성 실패해도 회원가입은 완료되었으므로 성공 메시지 표시
    }

    return {
      success: true,
      message: '회원가입이 완료되었습니다. 이메일을 확인해주세요.',
    };
  } catch (err) {
    console.error('회원가입 처리 중 오류:', err);
    return {
      error: err instanceof Error ? err.message : '회원가입 처리 중 오류가 발생했습니다.',
    };
  }
});

// 소셜 로그인 액션
export async function signInWithProviderAction(provider: Provider, redirectUrl?: string) {
  try {
    const supabase = await createClient();

    // 환경 변수에서 사이트 URL 가져오기
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const defaultRedirectUrl = `${siteUrl}/auth/callback`;

    // 명시적으로 전달된 redirectUrl 사용, 없으면 기본값 사용
    const finalRedirectUrl = redirectUrl || defaultRedirectUrl;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: finalRedirectUrl,
        skipBrowserRedirect: false, // PKCE 흐름에 필요한 설정
      },
    });

    if (error) {
      return { error: error.message };
    }

    // OAuth는 리디렉션으로 처리되므로 여기서는 URL만 반환
    return { url: data.url };
  } catch (err) {
    console.error('소셜 로그인 처리 오류:', err);
    return {
      error: err instanceof Error ? err.message : '소셜 로그인 처리 중 오류가 발생했습니다.',
    };
  }
}

// 로그아웃 액션
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/auth/login');
}

/**
 * 사용자 프로필 관련 함수
 */
// 프로필 생성 헬퍼 함수
const createUserProfile = async (
  supabase: any,
  userData: { id: string; email: string; role?: string }
) => {
  try {
    const { error } = await supabase.from('profiles').insert([
      {
        id: userData.id,
        email: userData.email,
        role: userData.role || 'student',
        // created_at은 DB default로 처리
        // name은 user_metadata에 저장되므로 여기서는 제외
      },
    ]);

    // 중복 키 오류는 무시 (이미 프로필이 있는 경우)
    if (error && error.code !== '23505') {
      throw error;
    }

    return { success: true };
  } catch (err) {
    console.error('프로필 생성 중 오류:', err);
    return {
      error: err instanceof Error ? err.message : '프로필 생성 중 오류가 발생했습니다.',
    };
  }
};

// 프로필 생성 액션 (공개 API)
export async function createProfileAction(userData: {
  id: string;
  email: string;
  role?: string;
}) {
  const supabase = await createClient();
  return createUserProfile(supabase, userData);
}

/**
 * 메시지 관련 함수
 */
// 대화 가져오기 액션
export async function getConversationsAction(userId: string) {
  try {
    if (!userId) {
      return { error: '사용자 ID가 필요합니다.' };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order('updated_at', { ascending: false });

    if (error) {
      throw error;
    }

    return { data };
  } catch (err) {
    console.error('대화 목록 조회 중 오류:', err);
    return {
      error: err instanceof Error ? err.message : '대화 목록을 가져오는 중 오류가 발생했습니다.',
    };
  }
}

// 대화 생성 액션
export async function createConversationAction(conversation: {
  user1_id: string;
  user2_id: string;
  title?: string;
}) {
  try {
    // 필수 필드 검증
    if (!conversation.user1_id || !conversation.user2_id) {
      return { error: '대화 참여자 정보가 필요합니다.' };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('conversations')
      .insert([conversation])
      .select();

    if (error) {
      throw error;
    }

    return { data: data[0] };
  } catch (err) {
    console.error('대화 생성 중 오류:', err);
    return {
      error: err instanceof Error ? err.message : '대화를 생성하는 중 오류가 발생했습니다.',
    };
  }
}

// 메시지 가져오기 액션
export async function getMessagesAction(conversationId: string) {
  try {
    if (!conversationId) {
      return { error: '대화 ID가 필요합니다.' };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    return { data };
  } catch (err) {
    console.error('메시지 목록 조회 중 오류:', err);
    return {
      error: err instanceof Error ? err.message : '메시지 목록을 가져오는 중 오류가 발생했습니다.',
    };
  }
}

// 메시지 보내기 액션
export async function sendMessageAction(message: {
  conversation_id: string;
  sender_id: string;
  content: string;
}) {
  try {
    // 필수 필드 검증
    if (!message.conversation_id || !message.sender_id || !message.content) {
      return { error: '메시지 정보가 불완전합니다.' };
    }

    const supabase = await createClient();

    // 메시지 저장
    const { data, error } = await supabase
      .from('messages')
      .insert([message])
      .select();

    if (error) {
      throw error;
    }

    // 대화 마지막 메시지 업데이트
    const { error: updateError } = await supabase
      .from('conversations')
      .update({
        last_message: message.content,
        // updated_at은 DB default 또는 trigger로 처리
      })
      .eq('id', message.conversation_id);

    if (updateError) {
      console.warn('대화 업데이트 중 오류:', updateError);
    }

    return { data: data[0] };
  } catch (err) {
    console.error('메시지 전송 중 오류:', err);
    return {
      error: err instanceof Error ? err.message : '메시지를 전송하는 중 오류가 발생했습니다.',
    };
  }
}
