import React, { useState, useEffect } from 'react';
import Conversation from '@/components/shared/dashboards/Conversation';
import ConversationPartner from '@/components/shared/dashboards/ConversationPartner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/utils/supabaseClient';

const MessageDropdown = ({ onClose }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      if (!user) return;

      try {
        // 프로필 정보 가져오기
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        // user 정보와 profile 정보 합치기
        setCurrentUser({ ...user, ...profile });

        // student인 경우 자동으로 admin과 연결
        if (profile.role === 'student') {
          const { data: admin } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'admin')
            .limit(1)
            .single();

          if (admin) {
            setSelectedUser(admin);
          }
        }
      } catch (error) {
        console.error('프로필 로딩 에러:', error);
      }
    };

    getProfile();
  }, [user]);

  if (!currentUser) return null;

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="bg-white dark:bg-whiteColor-dark rounded-lg shadow-lg w-[400px] max-h-[700px] overflow-hidden">
      {isAdmin ? (
        selectedUser ? (
          <Conversation
            currentUser={currentUser}
            otherUser={selectedUser}
            onBack={() => setSelectedUser(null)}
          />
        ) : (
          <ConversationPartner currentUser={currentUser} onUserSelect={setSelectedUser} />
        )
      ) : (
        <Conversation currentUser={currentUser} otherUser={selectedUser} />
      )}
    </div>
  );
};

export default MessageDropdown;
