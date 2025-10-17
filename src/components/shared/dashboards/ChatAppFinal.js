'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/supabase/hooks';
import ConversationListNew from './ConversationListNew';
import ConversationViewNew from './ConversationViewNew';
import { getConversations } from '@/lib/supabase/messages';

const ChatAppFinal = ({ isMobile = false }) => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showConversationOnMobile, setShowConversationOnMobile] = useState(false);

  // 학생 계정인 경우 자동으로 첫 번째 대화 선택 (없으면 관리자와 대화 생성)
  useEffect(() => {
    if (!user || user.role !== 'student') return;

    const loadFirstConversation = async () => {
      const { data: conversations } = await getConversations(user.id);
      if (conversations && conversations.length > 0) {
        setSelectedConversation(conversations[0]);
      } else {
        // 대화가 없으면 관리자와 새 대화 생성
        const { getUsersByRole } = await import('@/lib/supabase/profile');
        const { getOrCreateConversation } = await import('@/lib/supabase/messages');

        const { data: admins } = await getUsersByRole('admin');
        if (admins && admins.length > 0) {
          const { data: newConversation } = await getOrCreateConversation(user.id, admins[0].id);
          if (newConversation) {
            setSelectedConversation(newConversation);
          }
        }
      }
    };

    loadFirstConversation();
  }, [user]);

  const handleSelectConversation = conversation => {
    setSelectedConversation(conversation);
    setShowConversationOnMobile(true);
  };

  const handleBackToList = () => {
    setShowConversationOnMobile(false);
    setSelectedConversation(null);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[600px] bg-white rounded-lg shadow">
        <p className="text-gray-500">Please sign in to access messages</p>
      </div>
    );
  }

  const isStudent = user.role === 'student';

  // 모바일 레이아웃
  if (isMobile) {
    return (
      <div className="h-full w-full flex flex-col overflow-hidden">
        {/* 학생: 대화창만 표시 */}
        {isStudent ? (
          <div className="flex-1 min-h-0 overflow-hidden">
            <ConversationViewNew
              conversation={selectedConversation}
              onBack={null}
              isMobile={true}
            />
          </div>
        ) : (
          /* 어드민: 대화 목록 또는 대화창 표시 */
          <>
            {showConversationOnMobile ? (
              <div className="flex-1 min-h-0 overflow-hidden">
                <ConversationViewNew
                  conversation={selectedConversation}
                  onBack={handleBackToList}
                  isMobile={true}
                />
              </div>
            ) : (
              <div className="flex-1 min-h-0 overflow-hidden">
                <ConversationListNew
                  onSelect={handleSelectConversation}
                  selectedConversationId={selectedConversation?.id}
                />
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // 데스크톱 레이아웃
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* 헤더 */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex" style={{ height: 'calc(100vh - 250px)', minHeight: '600px' }}>
        {/* 학생: 대화창만 표시 (전체 너비) */}
        {isStudent ? (
          <div className="flex-1 min-w-0">
            <ConversationViewNew conversation={selectedConversation} onBack={null} />
          </div>
        ) : (
          /* 어드민: 2 Column Layout (대화 목록 + 대화창) */
          <>
            {/* 좌측: 대화 목록 - Mobile에서는 조건부 표시 */}
            <div
              className={`${
                showConversationOnMobile ? 'hidden lg:block' : 'block'
              } w-full lg:w-80 xl:w-96 border-r border-gray-200`}
            >
              <ConversationListNew
                onSelect={handleSelectConversation}
                selectedConversationId={selectedConversation?.id}
              />
            </div>

            {/* 우측: 메시지 영역 - Mobile에서는 조건부 표시 */}
            <div
              className={`${
                showConversationOnMobile ? 'block' : 'hidden lg:block'
              } flex-1 min-w-0`}
            >
              <ConversationViewNew conversation={selectedConversation} onBack={handleBackToList} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatAppFinal;
