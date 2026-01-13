import { redirect } from 'next/navigation';
import { createClient } from '@/lib/auth/middleware';

export const metadata = {
  title: 'Teacher Dashboard - Banana Korean',
  description: 'Manage your students and assignments',
};

export default async function TeacherDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // 프로필에서 역할 확인
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, email')
    .eq('id', user.id)
    .single();

  const userRole = profile?.role || user?.user_metadata?.role || 'student';

  // Teacher가 아닌 경우 리디렉션
  if (userRole !== 'teacher') {
    redirect(userRole === 'admin' ? '/dashboards/admin-dashboard' : '/dashboards/student-dashboard');
  }

  const userName = user.user_metadata?.name || profile?.email || 'Teacher';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome, {userName}! 👨‍🏫
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your students and create custom assignments
          </p>
        </div>

        {/* 대시보드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 학생 관리 카드 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Students</h3>
              <span className="text-3xl">👥</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Manage your students and track their progress
            </p>
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Coming soon in Week 5
            </div>
          </div>

          {/* AI 커스텀 모드 카드 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Custom Mode</h3>
              <span className="text-3xl">🤖</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Create custom quizzes with AI
            </p>
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Coming soon in Week 2
            </div>
          </div>

          {/* 숙제 관리 카드 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Assignments</h3>
              <span className="text-3xl">📝</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Create and manage homework assignments
            </p>
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Coming soon in Week 5
            </div>
          </div>

          {/* 진도 모니터링 카드 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Progress Monitoring</h3>
              <span className="text-3xl">📊</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Track student quizzes and provide feedback
            </p>
            <div className="text-center py-4">
              <a
                href="/dashboards/teacher-grading"
                className="inline-block px-6 py-2 bg-primaryColor text-white rounded-lg hover:bg-primaryColor/90 transition-colors"
              >
                Go to Grading
              </a>
            </div>
          </div>

          {/* 구독 정보 카드 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Subscription</h3>
              <span className="text-3xl">💳</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Manage your subscription plan
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Plan:</span>
                <span className="font-medium text-gray-900 dark:text-white">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Students:</span>
                <span className="font-medium text-gray-900 dark:text-white">0 / ∞</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">AI Usage:</span>
                <span className="font-medium text-gray-900 dark:text-white">0 / 1 per week</span>
              </div>
            </div>
          </div>

          {/* 메시지 카드 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Messages</h3>
              <span className="text-3xl">💬</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Chat with your students
            </p>
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Coming soon in Week 8
            </div>
          </div>
        </div>

        {/* 개발 로드맵 안내 */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
            🚀 Development Roadmap
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
            We're currently in Phase 1 of development. Here's what's coming:
          </p>
          <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
            <li>✅ Week 1: Teacher role system (Current)</li>
            <li>⏳ Week 2: AI Custom Mode - Create custom quizzes with AI</li>
            <li>⏳ Week 3: Speaking Quiz Integration - 3 types of speaking practice</li>
            <li>⏳ Week 4: Simple Mode - Auto-generate quizzes from existing content</li>
            <li>⏳ Week 5: Assignment System - Create and manage homework for students</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
