'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { type Provider } from '@supabase/supabase-js';

/**
 * Supabase 서버 클라이언트 관련 함수
 */
// 서버 액션용 클라이언트 생성 함수
const createClient = () => {
  const cookieStore = cookies();
  return createServerActionClient({ cookies: () => cookieStore });
};

/**
 * 인증 관련 서버 액션
 */
// 로그인 액션
export async function signInAction(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // 필수 필드 검증
    if (!email || !password) {
      return { error: '이메일과 비밀번호를 모두 입력해주세요.' };
    }

    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    // 사용자 역할에 따른 리디렉션 경로 설정
    const role = data.user?.user_metadata?.role || 'student';
    const redirectPath =
      role === 'admin' ? '/dashboards/admin-dashboard' : '/dashboards/student-dashboard';

    redirect(redirectPath);
  } catch (err) {
    console.error('로그인 처리 중 오류:', err);
    return {
      error: err instanceof Error ? err.message : '로그인 처리 중 오류가 발생했습니다.',
    };
  }
}

// 회원가입 액션
export async function signUpAction(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    // 필수 필드 검증
    if (!email || !password || !name) {
      return { error: '모든 필드를 입력해주세요.' };
    }

    const supabase = createClient();

    // 사용자 생성
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    // 프로필 생성
    await createUserProfile(supabase, {
      id: data.user!.id,
      email: data.user!.email!,
      name: name,
    });

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
}

// 소셜 로그인 액션
export async function signInWithProviderAction(provider: Provider, redirectUrl?: string) {
  try {
    const supabase = createClient();

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
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/auth/login');
}

/**
 * 사용자 프로필 관련 함수
 */
// 프로필 생성 헬퍼 함수
const createUserProfile = async (
  supabase: any,
  userData: { id: string; email: string; name: string; role?: string }
) => {
  try {
    const { error } = await supabase.from('profiles').insert([
      {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role || 'student',
        created_at: new Date().toISOString(),
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
  name: string;
  role?: string;
}) {
  const supabase = createClient();
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

    const supabase = createClient();
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

    const supabase = createClient();
    const { data, error } = await supabase
      .from('conversations')
      .insert([
        {
          ...conversation,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
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

    const supabase = createClient();
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

    const supabase = createClient();
    const timestamp = new Date().toISOString();

    // 메시지 저장
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          ...message,
          created_at: timestamp,
        },
      ])
      .select();

    if (error) {
      throw error;
    }

    // 대화 마지막 메시지 업데이트
    const { error: updateError } = await supabase
      .from('conversations')
      .update({
        last_message: message.content,
        updated_at: timestamp,
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
