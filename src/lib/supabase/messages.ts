import { createClient } from './client';
import { Conversation, Message } from '@/types/chat';

// 대화 목록 가져오기 (프로필 정보 및 unread_count 포함)
export async function getConversations(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      user1:profiles!conversations_user1_id_fkey(*),
      user2:profiles!conversations_user2_id_fkey(*)
    `)
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .order('updated_at', { ascending: false });

  if (error) return { data: null, error };

  // 상대방 정보를 otherUser로 매핑
  const formattedData = data?.map(conv => ({
    ...conv,
    otherUser: conv.user1_id === userId ? conv.user2 : conv.user1,
  }));

  return { data: formattedData, error: null };
}

// 기존 대화 찾기 또는 새로 생성
export async function getOrCreateConversation(userId1: string, userId2: string) {
  const supabase = createClient();

  // 기존 대화 확인 (양방향)
  const { data: existingConv, error: findError } = await supabase
    .from('conversations')
    .select(`
      *,
      user1:profiles!conversations_user1_id_fkey(*),
      user2:profiles!conversations_user2_id_fkey(*)
    `)
    .or(
      `and(user1_id.eq.${userId1},user2_id.eq.${userId2}),and(user1_id.eq.${userId2},user2_id.eq.${userId1})`
    )
    .limit(1)
    .single();

  // 기존 대화가 있으면 반환
  if (existingConv) {
    const otherUser = existingConv.user1_id === userId1 ? existingConv.user2 : existingConv.user1;
    return {
      data: { ...existingConv, otherUser },
      error: null,
    };
  }

  // 새 대화 생성
  const { data: newConv, error: createError } = await supabase
    .from('conversations')
    .insert([
      {
        user1_id: userId1,
        user2_id: userId2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select(`
      *,
      user1:profiles!conversations_user1_id_fkey(*),
      user2:profiles!conversations_user2_id_fkey(*)
    `)
    .single();

  if (createError) return { data: null, error: createError };

  const otherUser = newConv.user1_id === userId1 ? newConv.user2 : newConv.user1;
  return {
    data: { ...newConv, otherUser },
    error: null,
  };
}

// 메시지 목록 가져오기 (최신 50개 제한)
export async function getMessages(conversationId: string, limit = 50) {
  const supabase = createClient();

  // 최신 메시지부터 가져오기
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) return { data: null, error };

  // UI 표시를 위해 오래된 순서로 재정렬
  return {
    data: data?.reverse() || [],
    error: null
  };
}

// 메시지 보내기
export async function sendMessage(message: {
  id?: string; // ✅ 클라이언트에서 생성한 ID (선택사항)
  conversation_id: string;
  sender_id: string;
  content: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase.from('messages').insert([
    {
      ...message,
      read: false,
    },
  ]).select();

  // 대화 마지막 메시지 업데이트
  if (!error && data && data.length > 0) {
    const { error: updateError } = await supabase
      .from('conversations')
      .update({
        last_message: message.content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', message.conversation_id);

    if (updateError) {
      console.error('[sendMessage] Failed to update conversation:', updateError);
    }
  }

  return { data, error };
}

// 메시지 읽음 처리
export async function markMessagesAsRead(conversationId: string, userId: string) {
  const supabase = createClient();
  return await supabase
    .from('messages')
    .update({ read: true })
    .eq('conversation_id', conversationId)
    .neq('sender_id', userId)
    .eq('read', false);
}

// 읽지 않은 메시지 수 가져오기 (conversations 테이블의 unread_count 사용)
export async function getUnreadCount(userId: string) {
  const supabase = createClient();

  const { data: conversations, error } = await supabase
    .from('conversations')
    .select('id, user1_id, user2_id, unread_count_user1, unread_count_user2')
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

  if (error || !conversations) return { count: 0, error };

  // 각 대화에서 내 unread_count를 합산
  const totalUnread = conversations.reduce((sum, conv) => {
    const myUnreadCount = conv.user1_id === userId
      ? conv.unread_count_user1
      : conv.unread_count_user2;
    return sum + (myUnreadCount || 0);
  }, 0);

  return { count: totalUnread, error: null };
}

// 대화에 실시간 구독하기
export function subscribeToMessages(
  conversationId: string,
  callback: (payload: any) => void,
  componentId?: string
) {
  const supabase = createClient();

  // 고유한 channel 이름 생성 (componentId가 있으면 포함)
  const channelName = componentId
    ? `messages:${conversationId}:${componentId}`
    : `messages:${conversationId}`;

  const channel = supabase
    .channel(channelName)
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
    .subscribe((status) => {
      console.log(`[Realtime] Subscription status for ${channelName}:`, status);
      if (status === 'SUBSCRIBED') {
        console.log(`[Realtime] Successfully subscribed to ${channelName}`);
      } else if (status === 'CHANNEL_ERROR') {
        console.error(`[Realtime] Channel error for ${channelName}`);
      } else if (status === 'TIMED_OUT') {
        console.error(`[Realtime] Subscription timed out for ${channelName}`);
      }
    });

  return channel;
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
