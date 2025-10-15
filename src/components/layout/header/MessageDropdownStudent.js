'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/supabase/hooks';
import { getMessages, sendMessage, subscribeToMessages, getOrCreateConversation } from '@/lib/supabase/messages';
import { getUsersByRole } from '@/lib/supabase/profile';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import UserAvatar from '@/components/shared/UserAvatar';
import { X, Send, Loader2, MessageSquare, Maximize2 } from 'lucide-react';

const MessageDropdownStudent = ({ onClose }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest'
    });
  };

  const handleExpandToFullPage = () => {
    onClose();
    router.push('/dashboards/student-message');
  };

  // 어드민과의 대화 로드 또는 생성
  useEffect(() => {
    if (!user) return;

    const loadOrCreateConversation = async () => {
      try {
        setLoading(true);
        setError(null);

        // 어드민 찾기
        const { data: admins, error: adminsError } = await getUsersByRole('admin');
        if (adminsError) throw adminsError;

        if (!admins || admins.length === 0) {
          setError('No instructor available');
          setLoading(false);
          return;
        }

        // 어드민과의 대화 가져오기 또는 생성
        const { data: conv, error: convError } = await getOrCreateConversation(user.id, admins[0].id);
        if (convError) throw convError;

        setConversation(conv);

        // 메시지 로드
        const { data: msgs, error: msgsError } = await getMessages(conv.id);
        if (msgsError) throw msgsError;

        setMessages(msgs || []);
        setTimeout(scrollToBottom, 100);

        // 메시지 읽음 처리
        const { markMessagesAsRead } = await import('@/lib/supabase/messages');
        await markMessagesAsRead(conv.id, user.id);
      } catch (error) {
        console.error('Error loading conversation:', error);
        setError('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    loadOrCreateConversation();
  }, [user]);

  // 실시간 메시지 구독
  useEffect(() => {
    if (!conversation?.id || !user) return;

    const subscription = subscribeToMessages(conversation.id, async payload => {
      if (payload.eventType === 'INSERT') {
        // 자신이 보낸 메시지는 이미 추가됨
        if (payload.new.sender_id === user.id) return;

        // 중복 방지
        setMessages(prev => {
          const exists = prev.some(msg => msg.id === payload.new.id);
          if (exists) return prev;
          return [...prev, payload.new];
        });
        scrollToBottom();

        // 읽음 처리
        const { markMessagesAsRead } = await import('@/lib/supabase/messages');
        await markMessagesAsRead(conversation.id, user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [conversation?.id, user]);

  const handleSend = async e => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation?.id || sending) return;

    const messageContent = newMessage.trim();
    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      id: tempId,
      conversation_id: conversation.id,
      sender_id: user.id,
      content: messageContent,
      created_at: new Date().toISOString(),
      status: 'sending',
    };

    try {
      setSending(true);
      setError(null);
      setNewMessage('');

      // Optimistic update
      setMessages(prev => [...prev, tempMessage]);
      scrollToBottom();

      const { data, error } = await sendMessage({
        conversation_id: conversation.id,
        sender_id: user.id,
        content: messageContent,
      });

      if (error) throw error;

      // 임시 메시지를 실제 메시지로 교체
      setMessages(prev =>
        prev.map(msg =>
          msg.id === tempId ? { ...msg, id: data[0]?.id || tempId, status: 'sent' } : msg
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
      setMessages(prev => prev.map(msg => (msg.id === tempId ? { ...msg, status: 'failed' } : msg)));
    } finally {
      setSending(false);
    }
  };

  const formatMessageTime = timestamp => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  return (
    <div className="w-96 bg-white dark:bg-dark border border-borderColor dark:border-borderColor-dark rounded-md shadow-lg flex flex-col" style={{ height: '600px' }}>
      {/* 헤더 */}
      <div className="flex justify-between items-center p-4 border-b border-borderColor dark:border-borderColor-dark">
        <h3 className="text-lg font-semibold text-blackColor dark:text-blackColor-dark">
          {conversation?.otherUser?.name || 'Instructor'}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExpandToFullPage}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            title="Expand to full page"
          >
            <Maximize2 size={18} className="text-gray-600" />
          </button>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X size={20} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryColor"></div>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-red-500 text-sm text-center">{error}</p>
        </div>
      ) : (
        <>
          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-purple-50 to-purple-100 overscroll-y-contain">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <MessageSquare size={48} className="text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm text-center">
                  Start a conversation with your instructor
                </p>
              </div>
            ) : (
              <>
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`mb-3 flex ${
                      message.sender_id === user.id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {/* 받은 메시지 */}
                    {message.sender_id !== user.id && (
                      <div className="flex items-end max-w-[75%]">
                        <div className="mr-2 flex-shrink-0">
                          <UserAvatar
                            name={conversation.otherUser?.name || 'Instructor'}
                            size={28}
                          />
                        </div>
                        <div className="flex flex-col">
                          <div className="bg-white rounded-xl rounded-bl-sm px-3 py-2 shadow-sm">
                            <p className="text-xs text-gray-800 break-words">{message.content}</p>
                          </div>
                          <span className="text-xs text-gray-500 mt-1 ml-2">
                            {formatMessageTime(message.created_at)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* 보낸 메시지 */}
                    {message.sender_id === user.id && (
                      <div className="flex flex-col items-end max-w-[75%]">
                        <div className="bg-primaryColor rounded-xl rounded-br-sm px-3 py-2 shadow-sm">
                          <p className="text-xs text-white break-words">{message.content}</p>
                        </div>
                        <span className="text-xs text-gray-500 mt-1 mr-2">
                          {formatMessageTime(message.created_at)}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* 입력 영역 */}
          <form onSubmit={handleSend} className="border-t border-borderColor dark:border-borderColor-dark p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                name="message"
                autoComplete="off"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-primaryColor text-sm"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className={`p-2 rounded-full transition-all flex-shrink-0 ${
                  newMessage.trim()
                    ? 'bg-primaryColor text-white hover:opacity-90'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {sending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default MessageDropdownStudent;
