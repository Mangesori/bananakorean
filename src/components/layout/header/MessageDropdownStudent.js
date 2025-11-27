'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/supabase/hooks';
import { getOrCreateConversation } from '@/lib/supabase/messages';
import { getUsersByRole } from '@/lib/supabase/profile';
import { useRouter } from 'next/navigation';
import { X, Maximize2 } from 'lucide-react';
import ConversationViewNew from '@/components/shared/dashboards/ConversationViewNew';
import { useTranslations } from 'next-intl';

const MessageDropdownStudent = ({ onClose, isMobile = false }) => {
  const t = useTranslations();
  const { user } = useAuth();
  const router = useRouter();
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          setError(t('header.noInstructorAvailable'));
          setLoading(false);
          return;
        }

        // 어드민과의 대화 가져오기 또는 생성
        const { data: conv, error: convError } = await getOrCreateConversation(user.id, admins[0].id);
        if (convError) throw convError;

        setConversation(conv);
      } catch (error) {
        console.error('Error loading conversation:', error);
        setError(t('header.failedToLoadMessages'));
      } finally {
        setLoading(false);
      }
    };

    loadOrCreateConversation();
  }, [user]);

  return (
    <div
      className={`bg-white dark:bg-dark border border-borderColor dark:border-borderColor-dark ${
        isMobile
          ? 'fixed inset-0 z-50 flex flex-col touch-manipulation'
          : 'w-96 rounded-md shadow-lg flex flex-col'
      }`}
      style={
        isMobile
          ? {
              height: '100dvh',
              minHeight: '-webkit-fill-available',
              WebkitOverflowScrolling: 'touch',
              WebkitTapHighlightColor: 'transparent',
            }
          : { height: '600px' }
      }
    >
      {/* 헤더 */}
      <div className="flex justify-between items-center p-4 border-b border-borderColor dark:border-borderColor-dark">
        <h3 className="text-lg font-semibold text-blackColor dark:text-blackColor-dark">
          {conversation?.otherUser?.name || t('header.instructor')}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExpandToFullPage}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            title={t('header.expandToFullPage')}
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
        <div className="flex-1 min-h-0 overflow-hidden">
          <ConversationViewNew
            conversation={conversation}
            onBack={null}
            hideHeader={true}
            compact={true}
          />
        </div>
      )}
    </div>
  );
};

export default MessageDropdownStudent;
