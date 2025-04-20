'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/supabase/hooks';
import { supabase } from '@/utils/supabaseClient';
import Image from 'next/image';

const MessageDropdown = ({ onClose }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentChat, setCurrentChat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select('*, profiles!profiles_user_id_fkey(*)')
          .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
          .order('updated_at', { ascending: false });

        if (error) throw error;

        const formattedConversations = data.map(conv => {
          const otherUserId = conv.user1_id === user.id ? conv.user2_id : conv.user1_id;
          const otherUser = conv.profiles.find(profile => profile.id === otherUserId);

          return {
            ...conv,
            otherUser: otherUser || { name: 'Unknown User' },
          };
        });

        setConversations(formattedConversations);

        // 자동으로 첫 번째 대화 선택
        if (formattedConversations.length > 0) {
          setCurrentChat(formattedConversations[0]);
          fetchMessages(formattedConversations[0].id);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    // 실시간 업데이트 구독
    const subscription = supabase
      .channel('public:conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `user1_id=eq.${user.id}`,
        },
        payload => {
          fetchConversations();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `user2_id=eq.${user.id}`,
        },
        payload => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const fetchMessages = async conversationId => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);

      // 읽음 상태 업데이트
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('conversation_id', conversationId)
        .eq('receiver_id', user.id)
        .eq('read', false);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async e => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChat) return;

    try {
      const otherUserId =
        currentChat.user1_id === user.id ? currentChat.user2_id : currentChat.user1_id;

      const { error } = await supabase.from('messages').insert({
        conversation_id: currentChat.id,
        sender_id: user.id,
        receiver_id: otherUserId,
        content: newMessage.trim(),
        read: false,
      });

      if (error) throw error;

      // 대화 updated_at 업데이트
      await supabase
        .from('conversations')
        .update({ updated_at: new Date() })
        .eq('id', currentChat.id);

      setNewMessage('');
      fetchMessages(currentChat.id);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <div className="w-96 h-96 bg-white dark:bg-dark border border-borderColor dark:border-borderColor-dark rounded-md shadow-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-blackColor dark:text-blackColor-dark">
            Messages
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="flex items-center justify-center h-80">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-96 h-96 bg-white dark:bg-dark border border-borderColor dark:border-borderColor-dark rounded-md shadow-lg flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-borderColor dark:border-borderColor-dark">
        <h3 className="text-lg font-semibold text-blackColor dark:text-blackColor-dark">
          {currentChat ? currentChat.otherUser.name : 'Messages'}
        </h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {conversations.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">No conversations yet</p>
        </div>
      ) : !currentChat ? (
        <div className="flex-1 overflow-y-auto">
          {conversations.map(conversation => (
            <div
              key={conversation.id}
              className="p-3 border-b border-borderColor dark:border-borderColor-dark hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
              onClick={() => {
                setCurrentChat(conversation);
                fetchMessages(conversation.id);
              }}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                  <Image
                    src={conversation.otherUser.avatar_url || '/images/default-avatar.svg'}
                    alt={conversation.otherUser.name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{conversation.otherUser.name}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {conversation.last_message || 'Start a conversation'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Start a conversation</p>
              </div>
            ) : (
              messages.map(message => (
                <div
                  key={message.id}
                  className={`mb-3 ${message.sender_id === user.id ? 'text-right' : 'text-left'}`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg max-w-[80%] ${
                      message.sender_id === user.id
                        ? 'bg-primaryColor text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {message.content}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(message.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              ))
            )}
          </div>

          <form
            onSubmit={sendMessage}
            className="border-t border-borderColor dark:border-borderColor-dark p-3 flex"
          >
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border border-borderColor dark:border-borderColor-dark rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primaryColor"
            />
            <button
              type="submit"
              className="bg-primaryColor text-white px-4 rounded-r-lg hover:bg-primaryColor-dark transition-colors"
              disabled={!newMessage.trim()}
            >
              Send
            </button>
          </form>
        </>
      )}

      <div className="p-3 text-center border-t border-borderColor dark:border-borderColor-dark">
        <Link
          href={
            user?.role === 'admin' ? '/dashboards/admin-message' : '/dashboards/student-message'
          }
          className="text-primaryColor hover:underline"
          onClick={onClose}
        >
          View All Messages
        </Link>
      </div>
    </div>
  );
};

export default MessageDropdown;
