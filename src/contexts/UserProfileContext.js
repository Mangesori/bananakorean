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
  console.log('[UserProfileProvider] Provider mounted');
  const { user } = useAuth();
  console.log('[UserProfileProvider] Current user:', user?.id, user?.email);

  const [userName, setUserName] = useState(() => {
    // 로컬스토리지에서 초기값 가져오기
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('userName') || '';
      console.log('[UserProfileProvider] Initial userName from localStorage:', cached);
      return cached;
    }
    return '';
  });
  const [avatarUrl, setAvatarUrl] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('avatarUrl') || '';
    }
    return '';
  });
  const [isLoading, setIsLoading] = useState(!userName);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const fetchedRef = React.useRef(false);

  useEffect(() => {
    console.log('[UserProfileProvider] useEffect triggered', { userId: user?.id, email: user?.email });

    // Strict Mode에서 중복 호출 방지
    if (fetchedRef.current && user?.id) {
      console.log('[UserProfileProvider] Already fetched, skipping');
      return;
    }

    const fetchProfile = async () => {
      console.log('[UserProfileProvider] Fetching profile for user:', user?.id);

      if (!user?.id) {
        console.log('[UserProfileProvider] No user ID, skipping fetch');
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

        console.log('[UserProfileProvider] Profile data:', profile);
        console.log('[UserProfileProvider] Error:', error);

        if (profile) {
          const name = profile.name || user.email?.split('@')[0] || '';
          const avatar = profile.avatar_url || '';

          console.log('[UserProfileProvider] Setting userName to:', name);
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
