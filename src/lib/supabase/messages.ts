import { createClient } from './client';

// 대화 목록 가져오기
export async function getConversations(userId: string) {
  const supabase = createClient();
  return await supabase
    .from('conversations')
    .select('*')
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .order('updated_at', { ascending: false });
}

// 대화 생성하기
export async function createConversation(conversation: {
  user1_id: string;
  user2_id: string;
  title?: string;
}) {
  const supabase = createClient();
  return await supabase.from('conversations').insert([conversation]);
}

// 메시지 목록 가져오기
export async function getMessages(conversationId: string) {
  const supabase = createClient();
  return await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
}

// 메시지 보내기
export async function sendMessage(message: {
  conversation_id: string;
  sender_id: string;
  content: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase.from('messages').insert([message]);

  // 대화 마지막 메시지 업데이트
  if (!error) {
    await supabase
      .from('conversations')
      .update({
        last_message: message.content,
        // updated_at은 DB default 또는 trigger로 처리
      })
      .eq('id', message.conversation_id);
  }

  return { data, error };
}

// 대화에 실시간 구독하기
export function subscribeToMessages(conversationId: string, callback: (payload: any) => void) {
  const supabase = createClient();
  return supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      callback
    )
    .subscribe();
}

// 대화 목록에 실시간 구독하기
export function subscribeToConversations(userId: string, callback: (payload: any) => void) {
  const supabase = createClient();
  return supabase
    .channel(`conversations:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'conversations',
        filter: `or(user1_id.eq.${userId},user2_id.eq.${userId})`,
      },
      callback
    )
    .subscribe();
}
