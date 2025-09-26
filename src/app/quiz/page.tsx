import Link from 'next/link';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';

export default function QuizPage() {
  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Korean Grammar Quiz</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* 빈칸 채우기 퀴즈 섹션 */}
          <Link
            href="/quiz/fill-blank"
            className="block p-6 bg-blue-50 border-2 border-blue-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2 text-blue-800">빈칸 채우기 퀴즈</h2>
            <p className="text-blue-600">문장의 빈칸을 채워서 한국어 문법을 연습해보세요</p>
            <p className="text-blue-500 text-sm mt-2">20개 문법 주제 • 타이핑으로 답 입력</p>
            <span className="inline-block mt-2 px-3 py-1 bg-blue-200 text-blue-800 text-sm rounded-full">
              NEW!
            </span>
          </Link>

          {/* 문장 드래그 앤 드롭 퀴즈 섹션 */}
          <Link
            href="/quiz/SentenceDragAndDrop"
            className="block p-6 bg-green-50 border-2 border-green-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2 text-green-800">문장 드래그 앤 드롭 퀴즈</h2>
            <p className="text-green-600">단어를 드래그해서 올바른 문장을 만들어보세요</p>
            <p className="text-green-500 text-sm mt-2">30개 문법 주제 • 드래그 앤 드롭으로 학습</p>
          </Link>

          {/* 객관식 퀴즈 섹션 */}
          <Link
            href="/quiz/multiple"
            className="block p-6 bg-purple-50 border-2 border-purple-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2 text-purple-800">객관식 퀴즈</h2>
            <p className="text-purple-600">여러 선택지 중에서 정답을 선택해보세요</p>
            <p className="text-purple-500 text-sm mt-2">다양한 주제 • 객관식 문제</p>
          </Link>

          {/* 대화 드래그 앤 드롭 퀴즈 섹션 */}
          <Link
            href="/quiz/DialogueDragAndDrop"
            className="block p-6 bg-teal-50 border-2 border-teal-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2 text-teal-800">대화 드래그 앤 드롭 퀴즈</h2>
            <p className="text-teal-600">대화를 드래그해서 올바른 순서로 배치해보세요</p>
            <p className="text-teal-500 text-sm mt-2">대화 순서 • 드래그 앤 드롭</p>
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}
