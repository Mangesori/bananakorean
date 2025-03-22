'use client';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { supabase } from '@/utils/supabaseClient';
import ConversatonSingle from './ConversatonSingle';

const Conversation = ({ currentUser, otherUser, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const isAdmin = currentUser?.role === 'admin';

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!currentUser?.id || !otherUser?.id) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(
            `and(sender_id.eq.${currentUser.id},receiver_id.eq.${otherUser.id}),` +
              `and(sender_id.eq.${otherUser.id},receiver_id.eq.${currentUser.id})`
          )
          .order('created_at', { ascending: true });

        if (error) throw error;

        setMessages(data || []);

        const { error: updateError } = await supabase
          .from('messages')
          .update({ read: true })
          .eq('receiver_id', currentUser.id)
          .eq('sender_id', otherUser.id)
          .eq('read', false);

        if (updateError) {
          // Handle error silently
        }
      } catch (error) {
        // Handle error silently
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `or(and(sender_id.eq.${currentUser.id},receiver_id.eq.${otherUser.id}),and(sender_id.eq.${otherUser.id},receiver_id.eq.${currentUser.id}))`,
        },
        payload => {
          setMessages(prev => [...prev, payload.new]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser?.id, otherUser?.id]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const messageData = {
        content: newMessage.trim(),
        sender_id: currentUser.id,
        receiver_id: otherUser.id,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase.from('messages').insert(messageData).select().single();

      if (error) throw error;

      setMessages(prev => [...prev, data]);
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!otherUser) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg h-[600px] flex items-center justify-center">
        <p>대화 상대를 선택해주세요.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center">
        {isAdmin && onBack && (
          <button onClick={onBack} className="mr-3 text-primaryColor hover:text-gray-800">
            <i className="icofont-simple-left" />
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
          <h3 className="font-semibold">{otherUser?.name || 'Unknown User'}</h3>
          <p className="text-sm text-gray-500">{otherUser?.email || ''}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">Loading...</div>
        ) : (
          <>
            {messages.map(message => (
              <ConversatonSingle
                key={message.id}
                details={{
                  id: message.id,
                  image:
                    message.sender_id === currentUser.id
                      ? currentUser.avatar_url
                      : otherUser.avatar_url,
                  isCurrentUser: message.sender_id === currentUser.id,
                  messages: [
                    {
                      message: message.content,
                      time: new Date(message.created_at).toLocaleTimeString(),
                    },
                  ],
                }}
              />
            ))}
            <div ref={messagesEndRef} style={{ marginTop: '8px' }} />
          </>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Write a message..."
            className="flex-1 rounded-xl px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-45px h-45px leading-45px bg-primaryColor text-whiteColor rounded-xl"
          >
            <i className="icofont-arrow-right text-xl" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Conversation;
