'use client';
import AdminFeedbacks from '@/components/sections/sub-section/dashboards/AdminFeedbacks';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/utils/supabaseClient';

const StudentDashboardMain = () => {
  const { user } = useAuth();

  useEffect(() => {
    const createProfile = async () => {
      if (!user) return;

      try {
        // 프로필이 이미 존재하는지 확인
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!existingProfile) {
          // 프로필이 없으면 새로 생성
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: user.id,
                email: user.email,
                name: user.user_metadata?.full_name || user.email.split('@')[0],
                role: 'student',
              },
            ])
            .select()
            .single();

          if (profileError && profileError.code !== '23505') {
            console.error('Error creating profile:', profileError);
          }
        }
      } catch (error) {
        console.error('Error checking/creating profile:', error);
      }
    };

    createProfile();
  }, [user]);

  return (
    <>
      <AdminFeedbacks />
    </>
  );
};

export default StudentDashboardMain;
