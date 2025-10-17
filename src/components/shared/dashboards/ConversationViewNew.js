'use client';
import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/lib/supabase/hooks';
import { getMessages, sendMessage, subscribeToMessages } from '@/lib/supabase/messages';
import Image from 'next/image';
import UserAvatar from '@/components/shared/UserAvatar';
import {
  MessageSquare,
  ArrowLeft,
  MessagesSquare,
  Paperclip,
  Smile,
  Send,
  Loader2,
  ChevronDown,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const ConversationViewNew = ({ conversation, onBack, hideHeader = false, compact = false, isMobile = false }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('chat');
  const [userScrolled, setUserScrolled] = useState(false);
  const [notification, setNotification] = useState(0);
  const optimisticIdsRef = useRef(new Set());
  const componentIdRef = useRef(uuidv4());
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      // 스크롤 높이에 추가 여유값을 더해 확실하게 최하단으로
      container.scrollTop = container.scrollHeight + 100;
    }
  };

  const handleOnScroll = () => {
    const scrollContainer = messagesContainerRef.current;
    if (scrollContainer) {
      const isScroll =
        scrollContainer.scrollTop <
        scrollContainer.scrollHeight - scrollContainer.clientHeight - 10;
      setUserScrolled(isScroll);

      // 사용자가 하단에 도달하면 알림 초기화
      if (
        scrollContainer.scrollTop ===
        scrollContainer.scrollHeight - scrollContainer.clientHeight
      ) {
        setNotification(0);
      }
    }
  };

  // 메시지가 변경될 때마다 자동으로 스크롤
  useEffect(() => {
    const scrollContainer = messagesContainerRef.current;
    if (scrollContainer && !userScrolled) {
      setTimeout(() => {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }, 100);
    }
  }, [messages, userScrolled]);

  useEffect(() => {
    if (!conversation?.id) return;

    // 대화가 변경될 때 optimisticIds 초기화
    optimisticIdsRef.current.clear();

    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await getMessages(conversation.id);
        if (error) throw error;
        
        const fetchedMessages = data || [];
        setMessages(fetchedMessages);
        
        console.log('[Fetch] Loaded messages:', fetchedMessages.length);

        // 메시지 읽음 처리
        const { markMessagesAsRead } = await import('@/lib/supabase/messages');
        await markMessagesAsRead(conversation.id, user.id);

        // 초기 로드 시 최하단으로 스크롤
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    const subscription = subscribeToMessages(
      conversation.id,
      async payload => {
        // INSERT 이벤트로 구독했으므로 payload.new가 있으면 새 메시지
        if (payload.new) {
          console.log('[Realtime] Event received for message ID:', payload.new.id);

          // optimisticIds를 사용한 중복 체크 (본인이 보낸 메시지는 무시)
          if (optimisticIdsRef.current.has(payload.new.id)) {
            console.log('[Realtime] ⛔ Optimistic message, skipping:', payload.new.id);
            optimisticIdsRef.current.delete(payload.new.id); // 처리 완료 후 제거
            return;
          }
        
        console.log('[Realtime] New message received:', payload.new.content);
        
        // 클라이언트 측 필터링: 현재 대화의 메시지가 아니면 무시
        if (payload.new.conversation_id !== conversation.id) {
          console.log('[Realtime] Message filtered out - different conversation');
          return;
        }

        // 중복 메시지 방지
        setMessages(prev => {
          // 이미 존재하는 메시지인지 확인
          const messageExists = prev.some(msg => msg.id === payload.new.id);
          if (messageExists) {
            console.log('[Realtime] Message already exists, skipping');
            return prev;
          }

          // 실제 추가
          console.log('[Realtime] ✅ Adding message to UI:', payload.new.content);
          console.log('[Realtime] Before:', prev.length, '→ After:', prev.length + 1);
          return [...prev, payload.new];
        });

        // 사용자가 스크롤을 올린 상태라면 알림 카운트 증가
        const scrollContainer = messagesContainerRef.current;
        if (
          scrollContainer &&
          scrollContainer.scrollTop <
          scrollContainer.scrollHeight - scrollContainer.clientHeight - 10
        ) {
          setNotification(current => current + 1);
        }

        // 다른 사람의 메시지를 받으면 자동으로 읽음 처리
        const { markMessagesAsRead } = await import('@/lib/supabase/messages');
        await markMessagesAsRead(conversation.id, user.id);
      } else {
        console.log('[Realtime] Event received but no payload.new found');
      }
    },
      componentIdRef.current
    );

    return () => {
      console.log('[Cleanup] Unsubscribing from messages');
      subscription.unsubscribe();
    };
  }, [conversation?.id, user.id]);

  const handleSend = async e => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation?.id || sending) return;

    const messageContent = newMessage.trim();
    const messageId = uuidv4(); // ✅ 클라이언트에서 ID 생성

    try {
      setSending(true);
      setError(null);
      setNewMessage('');

      // ✅ 서버 요청 전에 optimisticIds에 등록
      optimisticIdsRef.current.add(messageId);
      console.log('[Optimistic] Message ID registered:', messageId);

      // 낙관적 업데이트: 즉시 UI에 표시
      const optimisticMessage = {
        id: messageId,
        conversation_id: conversation.id,
        sender_id: user.id,
        content: messageContent,
        created_at: new Date().toISOString(),
        status: 'sent',
      };
      setMessages(prev => [...prev, optimisticMessage]);
      console.log('[Optimistic] Message added to UI:', messageContent);

      // 메시지 전송 시 스크롤 상태 초기화
      setUserScrolled(false);
      setNotification(0);

      // ✅ 클라이언트 ID와 함께 서버에 전송
      const { error } = await sendMessage({
        id: messageId, // ✅ 클라이언트 ID 전송
        conversation_id: conversation.id,
        sender_id: user.id,
        content: messageContent,
      });

      if (error) throw error;

      // 모바일/태블릿에서 키보드 유지를 위해 입력창에 포커스 재설정
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
      // ✅ 실패 시 optimisticIds에서 제거 및 메시지 제거
      optimisticIdsRef.current.delete(messageId);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
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

  // 어드민만 빈 화면 표시 (학생은 자동으로 대화가 생성됨)
  if (!conversation && user?.role === 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50">
        <MessageSquare size={64} className="text-gray-300 mb-4" />
        <p className="text-gray-500">Select a conversation to start messaging</p>
      </div>
    );
  }

  if (!conversation) {
    return null; // 학생의 경우 대화 로딩 중
  }

  const handleClose = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* 헤더 - 이름 영역 */}
      {!hideHeader && (
        <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between">
          <div className="flex items-center">
            {onBack && !isMobile && (
              <button
                onClick={onBack}
                className="mr-3 p-1 hover:bg-gray-100 rounded-full transition-colors lg:hidden"
              >
                <ArrowLeft size={20} className="text-gray-700" />
              </button>
            )}
            <h2 className="text-lg font-semibold text-gray-900">
              {conversation.otherUser?.name || 'Unknown User'}
            </h2>
          </div>
          {/* 모바일에서 X 버튼 표시 */}
          {isMobile && (
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-700" />
            </button>
          )}
        </div>
      )}

      {/* 탭 영역 - 어드민 전용 */}
      {!hideHeader && user?.role === 'admin' && (
        <div className="px-6 border-b border-gray-200 bg-white flex items-center">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'chat'
                  ? 'text-orange-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Chat
              {activeTab === 'chat' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('learning')}
              className={`py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'learning'
                  ? 'text-orange-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Learning profile
              {activeTab === 'learning' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 메시지 영역 */}
      <div
        ref={messagesContainerRef}
        className={`flex-1 overflow-y-auto ${compact ? 'p-4' : 'p-6'} bg-gray-50 overscroll-y-contain`}
        style={{ backgroundImage: 'linear-gradient(to bottom, #faf5ff, #f3e8ff)' }}
        onScroll={handleOnScroll}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <MessagesSquare size={48} className="text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">Send a message to your instructor</p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div key={message.id} className="mb-4">
                {/* 메시지 */}
                <div
                  className={`flex items-end min-w-0 ${
                    message.sender_id === user.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {/* 받은 메시지 - 왼쪽 */}
                  {message.sender_id !== user.id && (
                    <>
                      <div className="mr-2 flex-shrink-0">
                        <UserAvatar
                          name={conversation.otherUser?.name || conversation.otherUser?.email || 'Unknown'}
                          size={compact ? 28 : 32}
                        />
                      </div>
                      <div className="flex flex-col max-w-[70%] min-w-0">
                        <div className={`bg-white ${compact ? 'rounded-xl rounded-bl-sm px-3 py-2' : 'rounded-2xl rounded-bl-sm px-4 py-3'} shadow-sm`}>
                          <p className={`${compact ? 'text-xs' : 'text-sm'} text-gray-800 break-words`}>{message.content}</p>
                        </div>
                        <span className="text-xs text-gray-500 mt-1 ml-2">
                          {formatMessageTime(message.created_at)}
                        </span>
                      </div>
                    </>
                  )}

                  {/* 보낸 메시지 - 오른쪽 */}
                  {message.sender_id === user.id && (
                    <div className="flex flex-col items-end max-w-[75%] min-w-0">
                      <div className={`bg-primaryColor ${compact ? 'rounded-xl rounded-br-sm px-3 py-2' : 'rounded-2xl rounded-br-sm px-4 py-3'} shadow-sm`}>
                        <p className={`${compact ? 'text-xs' : 'text-sm'} text-white break-words`}>{message.content}</p>
                      </div>
                      <span className="text-xs text-gray-500 mt-1 mr-2">
                        {formatMessageTime(message.created_at)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Scroll to Bottom 버튼 */}
      {userScrolled && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10">
          <button
            onClick={() => {
              setUserScrolled(false);
              setNotification(0);
              scrollToBottom();
            }}
            className={notification > 0 
              ? "flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              : "transition-all"
            }
          >
            {notification > 0 ? (
              <>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  New {notification} message{notification > 1 ? 's' : ''}
                </span>
                <div className="bg-primaryColor text-white rounded-full w-6 h-6 flex items-center justify-center">
                  <ChevronDown size={16} />
                </div>
              </>
            ) : (
              <div className="bg-primaryColor text-white rounded-full p-1.5">
                <ChevronDown size={16} />
              </div>
            )}
          </button>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="px-6 py-2 bg-red-50 border-t border-red-100">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* 입력 영역 */}
      <form
        onSubmit={handleSend}
        className={`border-t border-gray-200 ${compact ? 'p-3' : 'p-4'} bg-white`}
        style={{
          paddingBottom: compact ? undefined : 'max(1rem, env(safe-area-inset-bottom))'
        }}
      >
        <div className={`flex items-center ${compact ? 'gap-2' : 'gap-3'}`}>
          <button
            type="button"
            className={`${compact ? 'p-1.5' : 'p-2'} hover:bg-gray-100 rounded-full transition-colors flex-shrink-0`}
            title="Attach file"
          >
            <Paperclip size={compact ? 16 : 20} className="text-gray-600" />
          </button>
          <button
            type="button"
            className={`${compact ? 'p-1.5' : 'p-2'} hover:bg-gray-100 rounded-full transition-colors flex-shrink-0`}
            title="Emoji"
          >
            <Smile size={compact ? 16 : 20} className="text-gray-600" />
          </button>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              name="message"
              autoComplete="off"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className={`w-full ${compact ? 'px-3 py-2' : 'px-4 py-2'} border border-gray-200 rounded-full focus:outline-none focus:border-orange-500`}
              style={{ fontSize: '16px' }}
            />
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className={`${compact ? 'p-2' : 'p-3'} rounded-full transition-all flex-shrink-0 ${
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
    </div>
  );
};

export default ConversationViewNew;
