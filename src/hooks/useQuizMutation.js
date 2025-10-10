import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveQuizAttempt } from '@/lib/supabase/quiz-mutations';

/**
 * 퀴즈 제출 후 대시보드 캐시를 자동으로 갱신하는 훅
 *
 * 사용 예시:
 * const submitMutation = useQuizMutation();
 *
 * submitMutation.mutate({
 *   grammar_id: 'N1-001',
 *   quiz_type: 'multiple_choice',
 *   is_correct: true,
 *   time_spent: 30
 * });
 */
export function useQuizMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveQuizAttempt,
    onSuccess: (data, variables) => {
      // 퀴즈 제출 성공 시 관련 캐시 무효화
      console.log('Quiz submitted successfully, invalidating caches...');

      // 사용자 통계 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['userStats'] });

      // 사용자 진도 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });

      // 해당 문법의 진도 캐시도 무효화
      if (variables.grammar_id) {
        queryClient.invalidateQueries({
          queryKey: ['grammarProgress', variables.grammar_id]
        });
      }

      // 성취 배지 캐시 무효화 (새 배지 획득 가능성)
      queryClient.invalidateQueries({ queryKey: ['userAchievements'] });
    },
    onError: (error) => {
      console.error('Failed to submit quiz:', error);
    },
  });
}

/**
 * 낙관적 업데이트 버전 (즉시 UI 반영)
 * 퀴즈 결과를 서버 응답 전에 미리 화면에 표시
 */
export function useOptimisticQuizMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveQuizAttempt,
    onMutate: async (newAttempt) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ['userStats'] });

      // 이전 데이터 백업
      const previousStats = queryClient.getQueryData(['userStats']);

      // 낙관적으로 캐시 업데이트
      queryClient.setQueryData(['userStats'], (old) => {
        if (!old) return old;

        return {
          ...old,
          total_attempts: old.total_attempts + 1,
          total_correct: newAttempt.is_correct
            ? old.total_correct + 1
            : old.total_correct,
          accuracy_rate: newAttempt.is_correct
            ? ((old.total_correct + 1) / (old.total_attempts + 1)) * 100
            : (old.total_correct / (old.total_attempts + 1)) * 100,
        };
      });

      return { previousStats };
    },
    onError: (err, newAttempt, context) => {
      // 에러 발생 시 이전 데이터로 롤백
      if (context?.previousStats) {
        queryClient.setQueryData(['userStats'], context.previousStats);
      }
    },
    onSettled: () => {
      // 성공/실패 상관없이 최종적으로 서버 데이터로 갱신
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
      queryClient.invalidateQueries({ queryKey: ['userAchievements'] });
    },
  });
}
