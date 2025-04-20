'use client';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/lib/supabase/hooks';
import { getMessages, sendMessage, subscribeToMessages } from '@/lib/supabase/messages';
import { supabase } from '@/utils/supabaseClient';
import Conversation from './Conversation';
import ConversationPartner from './ConversationPartner';

const ChatApp = () => {
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);

        if (!user) return;

        let { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (!profile) {
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email,
              name: user.user_metadata?.full_name || '사용자',
              avatar_url: user.user_metadata?.avatar_url,
              role: 'student',
            })
            .select()
            .single();

          if (insertError) throw insertError;
          profile = newProfile;
        }

        setCurrentUser({ ...user, ...profile });

        if (profile.role === 'student') {
          try {
            const { data: admin, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('role', 'admin')
              .limit(1)
              .single();

            if (error) throw error;

            if (admin) {
              setSelectedUser(admin);
            }
          } catch (error) {
            // Handle error silently
          }
        }
      } catch (error) {
        // Handle error silently
      } finally {
        setLoading(false);
      }
    };

    getProfile();

    // 프로필 변경 구독
    const profileSubscription = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user?.id}`,
        },
        payload => {
          if (payload.new) {
            setCurrentUser(prev => ({ ...prev, ...payload.new }));
          }
        }
      )
      .subscribe();

    return () => {
      profileSubscription.unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      setLoading(true);
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
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {currentUser?.role === 'admin' && (
          <div className="lg:col-span-4">
            <ConversationPartner
              currentUser={currentUser}
              onUserSelect={user => {
                setSelectedUser(user);
              }}
            />
          </div>
        )}

        <div className={currentUser?.role === 'admin' ? 'lg:col-span-8' : 'lg:col-span-12'}>
          {currentUser && selectedUser ? (
            <Conversation
              currentUser={currentUser}
              otherUser={selectedUser}
              onBack={() => setSelectedUser(null)}
            />
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg h-[600px] flex items-center justify-center">
              <p>Please select a conversation partner.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
