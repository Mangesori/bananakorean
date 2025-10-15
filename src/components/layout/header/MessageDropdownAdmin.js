'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/supabase/hooks';
import { getConversations, getMessages, sendMessage, subscribeToMessages } from '@/lib/supabase/messages';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import UserAvatar from '@/components/shared/UserAvatar';
import { X, Search, MessageSquare, ArrowLeft, Send, Loader2, Maximize2 } from 'lucide-react';

const MessageDropdownAdmin = ({ onClose }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      try {
        setLoading(true);

        // 대화 목록 가져오기 (unread_count 포함)
        const { data: convs, error: convsError } = await getConversations(user.id);
        if (convsError) throw convsError;

        // conversations 테이블에서 unread_count를 직접 가져옴
        const conversationsWithUnread = (convs || []).map(conv => {
          // user1인지 user2인지에 따라 해당하는 unread_count 사용
          const unread_count = conv.user1_id === user.id
            ? conv.unread_count_user1
            : conv.unread_count_user2;

          return {
            ...conv,
            unread_count: unread_count || 0,
          };
        });

        setConversations(conversationsWithUnread);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    // 실시간 구독 - conversations 테이블만 구독
    const subscribeToConversations = async (userId, callback) => {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      return supabase
        .channel(`conversations-dropdown:${userId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'conversations',
          },
          callback
        )
        .subscribe();
    };

    let subscription;
    subscribeToConversations(user.id, () => {
      fetchConversations();
    }).then(sub => {
      subscription = sub;
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest'
    });
  };

  const handleSelectConversation = async conversation => {
    // 현재 스크롤 위치 저장
    const scrollY = window.scrollY;

    try {
      setSelectedConversation(conversation);
      setError(null);

      // 메시지 로드
      const { data: msgs, error: msgsError } = await getMessages(conversation.id);
      if (msgsError) throw msgsError;

      setMessages(msgs || []);

      // 스크롤 위치 복원 후 메시지 스크롤
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
        setTimeout(() => {
          scrollToBottom();
          window.scrollTo(0, scrollY);
        }, 100);
      });

      // 메시지 읽음 처리
      const { markMessagesAsRead } = await import('@/lib/supabase/messages');
      await markMessagesAsRead(conversation.id, user.id);
    } catch (error) {
      console.error('Error loading conversation:', error);
      setError('Failed to load messages');
      // 에러 시에도 스크롤 복원
      window.scrollTo(0, scrollY);
    }
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
    setMessages([]);
    setNewMessage('');
    setError(null);
  };

  const handleExpandToFullPage = () => {
    onClose();
    router.push('/dashboards/admin-message');
  };

  const handleSend = async e => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation?.id || sending) return;

    const messageContent = newMessage.trim();
    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      id: tempId,
      conversation_id: selectedConversation.id,
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
        conversation_id: selectedConversation.id,
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

  const formatTime = timestamp => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  // 실시간 메시지 구독
  useEffect(() => {
    if (!selectedConversation?.id || !user) return;

    const subscription = subscribeToMessages(selectedConversation.id, async payload => {
      if (payload.eventType === 'INSERT') {
        if (payload.new.sender_id === user.id) return;

        setMessages(prev => {
          const exists = prev.some(msg => msg.id === payload.new.id);
          if (exists) return prev;
          return [...prev, payload.new];
        });
        scrollToBottom();

        const { markMessagesAsRead } = await import('@/lib/supabase/messages');
        await markMessagesAsRead(selectedConversation.id, user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [selectedConversation?.id, user]);

  const filteredConversations = conversations.filter(conv =>
    conv.otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.otherUser?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 대화창 뷰
  if (selectedConversation) {
    return (
      <div className="w-96 bg-white dark:bg-dark border border-borderColor dark:border-borderColor-dark rounded-md shadow-lg flex flex-col" style={{ height: '600px' }}>
        {/* 헤더 - 대화창 */}
        <div className="flex justify-between items-center p-4 border-b border-borderColor dark:border-borderColor-dark">
          <div className="flex items-center gap-2">
            <button
              onClick={handleBackToList}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={18} className="text-gray-700" />
            </button>
            <h3 className="text-lg font-semibold text-blackColor dark:text-blackColor-dark">
              {selectedConversation.otherUser?.name || 'Unknown Student'}
            </h3>
          </div>
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

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-purple-50 to-purple-100 overscroll-y-contain">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <MessageSquare size={48} className="text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm text-center">No messages yet</p>
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
                          name={selectedConversation.otherUser?.name || 'Student'}
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

        {/* 에러 메시지 */}
        {error && (
          <div className="px-4 py-2 bg-red-50 border-t border-red-100">
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

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
      </div>
    );
  }

  // 대화 목록 뷰
  return (
    <div className="w-96 bg-white dark:bg-dark border border-borderColor dark:border-borderColor-dark rounded-md shadow-lg flex flex-col" style={{ height: '600px' }}>
      {/* 헤더 */}
      <div className="flex justify-between items-center p-4 border-b border-borderColor dark:border-borderColor-dark">
        <h3 className="text-lg font-semibold text-blackColor dark:text-blackColor-dark">
          Messages
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
      ) : (
        <>
          {/* 검색 바 */}
          <div className="p-3 border-b border-borderColor dark:border-borderColor-dark">
            <div className="relative">
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primaryColor text-sm"
              />
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* 대화 목록 */}
          <div className="flex-1 overflow-y-auto overscroll-y-contain">
            {filteredConversations.length > 0 ? (
              filteredConversations.slice(0, 6).map(conversation => (
                <button
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation)}
                  className="w-full p-3 flex items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-700"
                >
                  <div className="relative flex-shrink-0">
                    <UserAvatar
                      name={conversation.otherUser?.name || conversation.otherUser?.email || 'Unknown'}
                      size={40}
                    />
                    {conversation.unread_count > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                        {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
                      </div>
                    )}
                  </div>
                  <div className="ml-3 flex-1 min-w-0 text-left">
                    <div className="flex items-baseline justify-between mb-0.5">
                      <h4 className={`text-sm truncate ${conversation.unread_count > 0 ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                        {conversation.otherUser?.name || 'Unknown Student'}
                      </h4>
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {formatTime(conversation.updated_at)}
                      </span>
                    </div>
                    <p className={`text-xs truncate ${conversation.unread_count > 0 ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                      {conversation.last_message || 'No messages yet'}
                    </p>
                  </div>
                </button>
              ))
            ) : searchQuery ? (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <p className="text-gray-500 text-sm">No students found</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <MessageSquare size={64} className="text-gray-300 mb-4" />
                <p className="text-gray-500 text-sm mb-2">No conversations yet</p>
                <p className="text-gray-400 text-xs">Students will appear here when they message you</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MessageDropdownAdmin;
