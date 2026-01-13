'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DialogueDragAndDrop from '@/components/quiz/DialogueDragAndDrop/DialogueDragAndDrop';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';
import { DialogueQuestion } from '@/types/quiz';

export default function CustomQuizPlayPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<DialogueQuestion[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // sessionStorage에서 문제 불러오기
    if (typeof window !== 'undefined') {
      const storedQuestions = sessionStorage.getItem('customQuizQuestions');

      if (storedQuestions) {
        try {
          const parsed = JSON.parse(storedQuestions);
          setQuestions(parsed);
        } catch (error) {
          console.error('Failed to parse questions:', error);
          router.push('/quiz/custom');
        }
      } else {
        // 문제가 없으면 커스텀 페이지로 리다이렉트
        router.push('/quiz/custom');
      }

      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">퀴즈를 불러오는 중...</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <PageWrapper>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-gray-600 mb-4">퀴즈 문제를 찾을 수 없습니다.</p>
            <button
              onClick={() => router.push('/quiz/custom')}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              커스텀 퀴즈 만들기
            </button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <DialogueDragAndDrop
      questions={questions}
      title="커스텀 퀴즈"
    />
  );
}


