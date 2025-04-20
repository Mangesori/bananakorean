'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/supabase/hooks';
import { getMessages, sendMessage, subscribeToMessages } from '@/lib/supabase/messages';
import Image from 'next/image';
import ConversatonSingle from './ConversatonSingle';

const Conversation = ({ conversationId, otherUser, onBack }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const isAdmin = user?.role === 'admin';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      try {
        const { data, error } = await getMessages(conversationId);
        if (error) throw error;
        setMessages(data || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    const subscription = subscribeToMessages(conversationId, payload => {
      if (payload.eventType === 'INSERT') {
        setMessages(prev => [...prev, payload.new]);
        scrollToBottom();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async e => {
    e.preventDefault();
    if (!newMessage.trim() || !conversationId) return;

    try {
      const { error } = await sendMessage({
        conversation_id: conversationId,
        sender_id: user.id,
        content: newMessage.trim(),
      });

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryColor"></div>
      </div>
    );
  }

  if (!otherUser) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg h-[600px] flex items-center justify-center">
        <p>Please select a conversation partner.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
        {onBack && (
          <button
            onClick={onBack}
            className="mr-3 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <i className="icofont-arrow-left text-xl"></i>
          </button>
        )}
        <Image
          src={otherUser?.avatar_url || '/default-avatar.png'}
          alt={otherUser?.name || 'User'}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="ml-3">
          <h2 className="text-lg font-semibold text-blackColor dark:text-blackColor-dark">
            {otherUser.name}
          </h2>
          <p className="text-sm text-contentColor dark:text-contentColor-dark">{otherUser.email}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex mb-4 ${
              message.sender_id === user.id ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender_id === user.id
                  ? 'bg-primaryColor text-white'
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {new Date(message.created_at).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-primaryColor dark:bg-gray-800 dark:border-gray-700"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-primaryColor text-white px-4 py-2 rounded-lg hover:bg-primaryColor-dark disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Conversation;
