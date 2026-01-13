'use client';

import { CustomQuizStep } from '@/types/custom-quiz';

interface StepIndicatorProps {
  currentStep: CustomQuizStep;
  totalSteps?: number;
}

const stepLabels = {
  1: '어휘 입력',
  2: '문법 선택',
  3: '퀴즈 설정',
  4: '미리보기',
};

export default function StepIndicator({
  currentStep,
  totalSteps = 4,
}: StepIndicatorProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="w-full mb-8">
      {/* 단계 표시 바 */}
      <div className="flex items-center justify-between relative">
        {/* 연결선 (배경) */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" />

        {/* 진행 선 */}
        <div
          className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-300"
          style={{
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
          }}
        />

        {/* 단계 원 */}
        {steps.map(step => {
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          const isPending = step > currentStep;

          return (
            <div key={step} className="flex flex-col items-center relative z-10">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  font-semibold text-sm transition-all duration-300
                  ${
                    isCompleted
                      ? 'bg-primary text-white'
                      : isCurrent
                        ? 'bg-primary text-white ring-4 ring-primary/30'
                        : 'bg-white border-2 border-gray-300 text-gray-400'
                  }
                `}
              >
                {isCompleted ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  step
                )}
              </div>
              <span
                className={`
                  mt-2 text-xs font-medium whitespace-nowrap
                  ${isCurrent ? 'text-primary' : isPending ? 'text-gray-400' : 'text-gray-600'}
                `}
              >
                {stepLabels[step as CustomQuizStep]}
              </span>
            </div>
          );
        })}
      </div>

      {/* 현재 단계 텍스트 */}
      <div className="text-center mt-6">
        <span className="text-sm text-gray-500">
          Step {currentStep} of {totalSteps}
        </span>
        <h2 className="text-xl font-bold text-gray-800 mt-1">
          {stepLabels[currentStep]}
        </h2>
      </div>
    </div>
  );
}


