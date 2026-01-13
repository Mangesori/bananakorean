'use client';

import { usePathname } from 'next/navigation';
import ItemsDashboard from './ItemsDashboard';
import { useAuth } from '@/lib/supabase/hooks';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useUserProfile } from '@/contexts/UserProfileContext';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const SidebarDashboard = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const partOfPathNaem = pathname.split('/')[2].split('-')[0];
  const isAdmin = partOfPathNaem === 'admin' ? true : false;
  const isInstructor = partOfPathNaem === 'instructor' ? true : false;
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { userName, isLoading: loadingName } = useUserProfile();

  useEffect(() => {
    if (!user?.id) return;

    const fetchUnreadCount = async () => {
      try {
        // conversations 테이블에서 unread_count 직접 합산
        const { data: conversations, error: convError } = await supabase
          .from('conversations')
          .select('id, user1_id, user2_id, unread_count_user1, unread_count_user2')
          .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

        if (convError) {
          console.error('Error fetching conversations:', convError);
          return;
        }

        if (!conversations || conversations.length === 0) {
          setUnreadCount(0);
          return;
        }

        // 각 대화에서 내 unread_count를 합산
        const totalUnread = conversations.reduce((sum, conv) => {
          const myUnreadCount = conv.user1_id === user.id
            ? conv.unread_count_user1
            : conv.unread_count_user2;
          return sum + (myUnreadCount || 0);
        }, 0);

        setUnreadCount(totalUnread);
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    fetchUnreadCount();

    // conversations 테이블만 구독 (unread_count가 트리거로 자동 업데이트됨)
    const channel = supabase
      .channel('sidebar-conversations')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations',
        },
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const handleSignOut = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);
      await signOut();
    } catch (error) {
      console.error('Error during sign out:', error);
      alert('로그아웃 중 문제가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Role detection based on URL path
  const isTeacher = partOfPathNaem === 'teacher' || partOfPathNaem === 'instructor';

  const adminItems = [
    {
      title: loadingName ? `${t('sidebar.welcome').toUpperCase()}...` : `${t('sidebar.welcome').toUpperCase()}, ${userName?.toUpperCase() || 'USER'}`,
      items: [
        {
          name: t('sidebar.dashboard'),
          path: '/dashboards/admin-dashboard',
          icon: <i className="icofont-dashboard-web text-xl"></i>,
        },
        {
          name: t('sidebar.users'),
          path: '/dashboards/admin-users',
          icon: <i className="icofont-users-social text-xl"></i>,
        },
        // {
        //   name: t('sidebar.courses'),
        //   path: '/dashboards/admin-course',
        //   icon: <i className="icofont-read-book text-xl"></i>,
        // },
        {
          name: 'Quiz Management', // TODO: Add translation key sidebar.quizManagement
          path: '/dashboards/admin-quiz-attempts',
          icon: <i className="icofont-question-circle text-xl"></i>,
        },
        {
          name: t('sidebar.message'),
          path: '/dashboards/admin-message',
          tag: unreadCount > 0 ? unreadCount : null,
          hiddenOnMobile: true,
          icon: <i className="icofont-ui-message text-xl"></i>,
        },
        {
          name: t('sidebar.settings'),
          path: '/dashboards/admin-settings',
          icon: <i className="icofont-ui-settings text-xl"></i>,
        },
        {
          name: t('sidebar.signOut'),
          onClick: handleSignOut,
          icon: <i className="icofont-logout text-xl"></i>,
        },
      ],
    },
  ];

  const teacherItems = [
    {
      title: loadingName ? `${t('sidebar.welcome').toUpperCase()}...` : `${t('sidebar.welcome').toUpperCase()}, ${userName?.toUpperCase() || 'TEACHER'}`,
      items: [
        {
          name: t('sidebar.dashboard'),
          path: '/dashboards/teacher-dashboard',
          icon: <i className="icofont-dashboard-web text-xl"></i>,
        },
        {
          name: 'My Students', // TODO: Add translation key sidebar.myStudents
          path: '/dashboards/teacher-my-students',
          icon: <i className="icofont-student-alt text-xl"></i>,
        },
        {
          name: 'Assignments', // TODO: Add translation key sidebar.assignments
          path: '/dashboards/teacher-assignments',
          icon: <i className="icofont-book-mark text-xl"></i>,
        },
        {
          name: 'Grading', // TODO: Add translation key sidebar.grading
          path: '/dashboards/teacher-grading', // Could reuse admin-quiz-attempts components later
          icon: <i className="icofont-edit text-xl"></i>,
        },
        {
          name: t('sidebar.message'),
          path: '/dashboards/teacher-message',
          tag: unreadCount > 0 ? unreadCount : null,
          hiddenOnMobile: true,
          icon: <i className="icofont-ui-message text-xl"></i>,
        },
        {
          name: t('sidebar.myProfile'),
          path: '/dashboards/teacher-profile',
          icon: <i className="icofont-ui-user text-xl"></i>,
        },
        {
          name: t('sidebar.signOut'),
          onClick: handleSignOut,
          icon: <i className="icofont-logout text-xl"></i>,
        },
      ],
    },
  ];

  const studentItems = [
    {
      title: loadingName ? `${t('sidebar.welcome').toUpperCase()}...` : `${t('sidebar.welcome').toUpperCase()}, ${userName?.toUpperCase() || 'USER'}`,
      items: [
        {
          name: t('sidebar.dashboard'),
          path: '/dashboards/student-dashboard',
          icon: <i className="icofont-dashboard-web text-xl"></i>,
        },
        // {
        //   name: t('sidebar.enrolledCourses'),
        //   path: '/dashboards/student-enrolled-courses',
        //   icon: <i className="icofont-education text-xl"></i>,
        // },
        {
          name: 'Quiz Results', // TODO: Add translation key sidebar.quizResults
          path: '/dashboards/student-my-quiz-attempts',
          icon: <i className="icofont-chart-bar-graph text-xl"></i>,
        },
        {
          name: t('sidebar.reviews'),
          path: '/dashboards/student-reviews',
          icon: <i className="icofont-star text-xl"></i>,
        },
        {
          name: t('sidebar.message'),
          path: '/dashboards/student-message',
          tag: unreadCount > 0 ? unreadCount : null,
          hiddenOnMobile: true,
          icon: <i className="icofont-ui-message text-xl"></i>,
        },
        {
          name: t('sidebar.settings'),
          path: '/dashboards/student-settings',
          icon: <i className="icofont-ui-settings text-xl"></i>,
        },
        {
          name: t('sidebar.signOut'),
          path: '#',
          onClick: handleSignOut,
          icon: <i className="icofont-logout text-xl"></i>,
        },
      ],
    },
  ];

  let items = studentItems;
  if (isAdmin) items = adminItems;
  if (isTeacher) items = teacherItems;
  return (
    <div className="hidden lg:block lg:col-start-1 lg:col-span-3">
      {/* navigation menu */}
      <div className="p-30px pt-5 lg:p-5 2xl:p-30px 2xl:pt-5 rounded-lg2 shadow-accordion dark:shadow-accordion-dark bg-whiteColor dark:bg-whiteColor-dark">
        {items?.map((item, idx) => (
          <ItemsDashboard key={idx} item={item} />
        ))}
      </div>
    </div>
  );
};

export default SidebarDashboard;
