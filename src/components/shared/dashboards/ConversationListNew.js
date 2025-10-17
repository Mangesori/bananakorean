'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/supabase/hooks';
import { getConversations, getOrCreateConversation } from '@/lib/supabase/messages';
import { getUsersByRole } from '@/lib/supabase/profile';
import Image from 'next/image';
import { Search, MessageSquare, X } from 'lucide-react';
import UserAvatar from '@/components/shared/UserAvatar';

const ConversationListNew = ({ onSelect, selectedConversationId, compact = false, maxItems = null }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // 기존 대화 목록 가져오기 (unread_count 포함)
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

        // 새 대화를 시작할 수 있는 사용자 목록 가져오기
        const targetRole = user.role === 'admin' ? 'student' : 'admin';
        const { data: users, error: usersError } = await getUsersByRole(targetRole);

        if (usersError) {
          console.error('Error fetching users by role:', usersError);
        }

        setAvailableUsers(users || []);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // 실시간 구독 - conversations 테이블만 구독 (unread_count가 자동 업데이트됨)
    const subscribeToConversations = async (userId, callback) => {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      return supabase
        .channel(`conversations-list:${userId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'conversations',
          },
          (payload) => {
            // 클라이언트 측 필터링: 자신이 참여한 대화만 처리
            if (payload.new.user1_id === userId || payload.new.user2_id === userId) {
              callback(payload);
            }
          }
        )
        .subscribe();
    };

    let subscription;
    subscribeToConversations(user.id, () => {
      fetchData();
    }).then(sub => {
      subscription = sub;
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [user]);

  const handleSelectConversation = conversation => {
    onSelect(conversation);
  };

  const handleStartNewChat = async targetUser => {
    try {
      const { data, error } = await getOrCreateConversation(user.id, targetUser.id);
      if (error) throw error;
      onSelect(data);
      setShowNewChat(false);
    } catch (error) {
      console.error('Error starting new chat:', error);
    }
  };

  const formatTime = timestamp => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Today - show time
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

  const filteredConversations = conversations.filter(conv =>
    conv.otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryColor"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 검색 바 */}
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primaryColor text-sm"
          />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* 대화 목록 */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length > 0 ? (
          (maxItems ? filteredConversations.slice(0, maxItems) : filteredConversations).map(conversation => (
            <button
              key={conversation.id}
              onClick={() => handleSelectConversation(conversation)}
              className={`w-full p-3 flex items-center hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                selectedConversationId === conversation.id ? 'bg-gray-50' : ''
              }`}
            >
              <div className="relative flex-shrink-0">
                <UserAvatar
                  name={conversation.otherUser?.name || conversation.otherUser?.email || 'Unknown'}
                  size={compact ? 40 : 48}
                />
                {conversation.unread_count > 0 && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                    {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
                  </div>
                )}
              </div>
              <div className="ml-3 flex-1 min-w-0 text-left">
                <div className="flex items-baseline justify-between mb-0.5">
                  <h4 className={`text-sm truncate ${conversation.unread_count > 0 ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                    {conversation.otherUser?.name || 'Unknown User'}
                  </h4>
                  <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                    {formatTime(conversation.updated_at)}
                  </span>
                </div>
                <p className={`text-xs truncate ${conversation.unread_count > 0 ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                  {conversation.last_message || 'Start a conversation'}
                </p>
              </div>
            </button>
          ))
        ) : searchQuery ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <p className="text-gray-500 text-sm">No conversations found</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <MessageSquare size={64} className="text-gray-300 mb-4" />
            <p className="text-gray-500 mb-2">No conversations yet</p>
            <button
              onClick={() => setShowNewChat(true)}
              className="text-primaryColor hover:underline text-sm"
            >
              Start a conversation
            </button>
          </div>
        )}
      </div>

      {/* 새 대화 모달 */}
      {showNewChat && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">New Conversation</h3>
              <button
                onClick={() => setShowNewChat(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-2">
              {availableUsers.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-sm text-gray-500 mb-2">No users available</p>
                  <p className="text-xs text-gray-400">
                    Current role: {user?.role === 'admin' ? 'Admin' : 'Student'}
                    <br />
                    Need {user?.role === 'admin' ? 'Student' : 'Admin'} users
                  </p>
                </div>
              ) : (
                availableUsers
                  .filter(u => !conversations.some(c => c.otherUser?.id === u.id))
                  .map(targetUser => (
                    <button
                      key={targetUser.id}
                      onClick={() => handleStartNewChat(targetUser)}
                      className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <UserAvatar
                        name={targetUser.name || targetUser.email}
                        size={48}
                      />
                      <div className="ml-3 text-left">
                        <p className="text-sm font-medium text-gray-900">{targetUser.name}</p>
                        <p className="text-xs text-gray-500">{targetUser.email}</p>
                      </div>
                    </button>
                  ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationListNew;
