'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/lib/supabase/hooks';
import { supabase } from '@/utils/supabaseClient';

const UserProfileContext = createContext({
  userName: '',
  avatarUrl: '',
  isLoading: true,
  refreshProfile: () => {},
});

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within UserProfileProvider');
  }
  return context;
};

export const UserProfileProvider = ({ children }) => {
  const { user } = useAuth();

  // 서버와 클라이언트에서 동일한 초기값을 보장하기 위해 항상 빈 문자열로 시작
  const [userName, setUserName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const fetchedRef = React.useRef(false);
  const hasInitializedRef = React.useRef(false);

  useEffect(() => {
    // 클라이언트에서만 실행되도록 보장
    if (typeof window === 'undefined') {
      return;
    }

    // 초기화: 로컬스토리지에서 캐시된 값이 있으면 먼저 설정
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      const cachedName = localStorage.getItem('userName') || '';
      const cachedAvatar = localStorage.getItem('avatarUrl') || '';
      
      if (cachedName) {
        setUserName(cachedName);
        setAvatarUrl(cachedAvatar);
        setIsLoading(false);
      }
    }

    // Strict Mode에서 중복 호출 방지
    if (fetchedRef.current && user?.id) {
      return;
    }

    const fetchProfile = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      fetchedRef.current = true;

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('name, avatar_url')
          .eq('id', user.id)
          .single();

        if (profile) {
          const name = profile.name || user.email?.split('@')[0] || '';
          const avatar = profile.avatar_url || '';

          setUserName(name);
          setAvatarUrl(avatar);

          // 로컬스토리지에 캐싱
          if (typeof window !== 'undefined') {
            localStorage.setItem('userName', name);
            localStorage.setItem('avatarUrl', avatar);
          }
        }
      } catch (error) {
        console.error('[UserProfileProvider] Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id, user?.email, refetchTrigger]);

  const refreshProfile = () => {
    fetchedRef.current = false;
    setRefetchTrigger(prev => prev + 1);
  };

  const value = {
    userName,
    avatarUrl,
    isLoading,
    refreshProfile,
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};
