'use client';
import { useState, useEffect, useRef } from 'react';
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
} from 'lucide-react';

const ConversationViewNew = ({ conversation, onBack }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('chat');
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!conversation?.id) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await getMessages(conversation.id);
        if (error) throw error;
        setMessages(data || []);
        setTimeout(scrollToBottom, 100);

        // 메시지 읽음 처리
        const { markMessagesAsRead } = await import('@/lib/supabase/messages');
        await markMessagesAsRead(conversation.id, user.id);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    const subscription = subscribeToMessages(conversation.id, async payload => {
      if (payload.eventType === 'INSERT') {
        // 자신이 보낸 메시지는 이미 optimistic update로 추가했으므로 무시
        if (payload.new.sender_id === user.id) {
          return;
        }

        // 중복 메시지 방지: 이미 존재하는 메시지인지 확인
        setMessages(prev => {
          const messageExists = prev.some(msg => msg.id === payload.new.id);
          if (messageExists) return prev;
          return [...prev, payload.new];
        });
        scrollToBottom();

        // 다른 사람의 메시지를 받으면 자동으로 읽음 처리
        const { markMessagesAsRead } = await import('@/lib/supabase/messages');
        await markMessagesAsRead(conversation.id, user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [conversation?.id, user.id]);

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

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 헤더 - 이름 영역 */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center">
        {onBack && (
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

      {/* 탭 영역 - 어드민 전용 */}
      {user?.role === 'admin' && (
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
        className="flex-1 overflow-y-auto p-6 bg-gray-50"
        style={{ backgroundImage: 'linear-gradient(to bottom, #faf5ff, #f3e8ff)' }}
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
                  className={`flex items-end ${
                    message.sender_id === user.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {/* 받은 메시지 - 왼쪽 */}
                  {message.sender_id !== user.id && (
                    <>
                      <div className="mr-2 flex-shrink-0">
                        <UserAvatar
                          name={conversation.otherUser?.name || conversation.otherUser?.email || 'Unknown'}
                          size={32}
                        />
                      </div>
                      <div className="flex flex-col max-w-[70%]">
                        <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                          <p className="text-sm text-gray-800 break-words">{message.content}</p>
                        </div>
                        <span className="text-xs text-gray-500 mt-1 ml-2">
                          {formatMessageTime(message.created_at)}
                        </span>
                      </div>
                    </>
                  )}

                  {/* 보낸 메시지 - 오른쪽 */}
                  {message.sender_id === user.id && (
                    <div className="flex flex-col items-end max-w-[70%]">
                      <div className="bg-primaryColor rounded-2xl rounded-br-sm px-4 py-3 shadow-sm">
                        <p className="text-sm text-white break-words">{message.content}</p>
                      </div>
                      <span className="text-xs text-gray-500 mt-1 mr-2">
                        {formatMessageTime(message.created_at)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="px-6 py-2 bg-red-50 border-t border-red-100">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* 입력 영역 */}
      <form onSubmit={handleSend} className="border-t border-gray-200 p-4 bg-white">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            title="Attach file"
          >
            <Paperclip size={20} className="text-gray-600" />
          </button>
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            title="Emoji"
          >
            <Smile size={20} className="text-gray-600" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              name="message"
              autoComplete="off"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className={`p-3 rounded-full transition-all flex-shrink-0 ${
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
