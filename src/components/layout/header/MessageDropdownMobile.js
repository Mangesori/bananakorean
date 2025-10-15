'use client';
import { X, ArrowLeft } from 'lucide-react';
import ChatAppFinal from '@/components/shared/dashboards/ChatAppFinal';

const MessageDropdownMobile = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-dark flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-borderColor dark:border-borderColor-dark bg-white dark:bg-dark">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300" />
        </button>
        <h1 className="text-lg font-semibold text-blackColor dark:text-blackColor-dark">
          Messages
        </h1>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          aria-label="Close"
        >
          <X size={20} className="text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {/* 메시지 영역 - ChatAppFinal 컴포넌트 재사용 */}
      <div className="flex-1 overflow-hidden">
        <ChatAppFinal />
      </div>
    </div>
  );
};

export default MessageDropdownMobile;
