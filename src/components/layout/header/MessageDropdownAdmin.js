'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Maximize2, ArrowLeft } from 'lucide-react';
import ConversationListNew from '@/components/shared/dashboards/ConversationListNew';
import ConversationViewNew from '@/components/shared/dashboards/ConversationViewNew';
import { useTranslations } from 'next-intl';

const MessageDropdownAdmin = ({ onClose, isMobile = false }) => {
  const t = useTranslations();
  const router = useRouter();
  const [selectedConversation, setSelectedConversation] = useState(null);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  const handleExpandToFullPage = () => {
    onClose();
    router.push('/dashboards/admin-message');
  };

  // 대화창 뷰
  if (selectedConversation) {
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
              {selectedConversation.otherUser?.name || t('header.unknownStudent')}
            </h3>
          </div>
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

        {/* 메시지 영역 - ConversationViewNew 재사용 */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <ConversationViewNew
            conversation={selectedConversation}
            onBack={null}
            hideHeader={true}
            compact={true}
          />
        </div>
      </div>
    );
  }

  // 대화 목록 뷰
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
          {t('header.messages')}
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

      {/* 대화 목록 - ConversationListNew 재사용 */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ConversationListNew
          onSelect={handleSelectConversation}
          selectedConversationId={selectedConversation?.id}
          compact={true}
          maxItems={6}
        />
      </div>
    </div>
  );
};

export default MessageDropdownAdmin;
