import { createClient } from './client';

// 프로필 정보 가져오기
export async function getUserProfile(userId: string) {
  const supabase = createClient();
  return await supabase.from('profiles').select('*').eq('id', userId).single();
}

// 프로필 업데이트
export async function updateProfile(userId: string, updates: Partial<any>) {
  const supabase = createClient();
  return await supabase.from('profiles').update(updates).eq('id', userId);
}

// 프로필 이미지 업로드
export async function uploadProfileImage(userId: string, file: File) {
  const supabase = createClient();
  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}/profile.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    return { error: uploadError };
  }

  // getPublicUrl은 에러를 반환하지 않고 URL만 반환함
  const {
    data: { publicUrl },
  } = supabase.storage.from('avatars').getPublicUrl(filePath);

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', userId);

  return { publicUrl, error: updateError };
}

// 역할별 사용자 목록 가져오기
export async function getUsersByRole(role: 'admin' | 'teacher' | 'student') {
  const supabase = createClient();
  return await supabase.from('profiles').select('*').eq('role', role).order('name');
}
