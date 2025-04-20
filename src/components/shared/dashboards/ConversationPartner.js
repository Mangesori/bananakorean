'use client';
import defaultAvatar from '@/assets/images/teacher/teacher__1.png';
import Image from 'next/image';
import { useAuth } from '@/lib/supabase/hooks';
import { useState, useEffect } from 'react';
import { getUserProfile, createConversation } from '@/lib/supabase/profile';

const ConversationPartner = ({ onSelect }) => {
  const { user } = useAuth();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        // If user is admin, fetch all students
        // If user is student, fetch all admins
        const role = user.role === 'admin' ? 'student' : 'admin';
        const { data: profiles, error } = await getUserProfile(role);

        if (error) throw error;
        setPartners(profiles || []);
      } catch (error) {
        console.error('Error fetching conversation partners:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPartners();
    }
  }, [user]);

  const handlePartnerSelect = async partner => {
    try {
      const { data, error } = await createConversation({
        user1_id: user.id,
        user2_id: partner.id,
        title: `Chat with ${partner.name}`,
      });

      if (error) throw error;
      onSelect(data[0]);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryColor"></div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-blackColor dark:text-blackColor-dark">
          Select a Conversation Partner
        </h2>
      </div>
      <div className="overflow-y-auto h-[calc(100%-4rem)]">
        {partners.length > 0 ? (
          partners.map(partner => (
            <button
              key={partner.id}
              onClick={() => handlePartnerSelect(partner)}
              className="w-full p-4 flex items-center hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
            >
              <div className="w-10 h-10 rounded-full bg-primaryColor text-white flex items-center justify-center">
                {partner.name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3 text-left">
                <p className="font-medium text-blackColor dark:text-blackColor-dark">
                  {partner.name}
                </p>
                <p className="text-sm text-contentColor dark:text-contentColor-dark">
                  {partner.email}
                </p>
              </div>
            </button>
          ))
        ) : (
          <p className="p-4 text-center text-contentColor dark:text-contentColor-dark">
            No conversation partners available
          </p>
        )}
      </div>
    </div>
  );
};

export default ConversationPartner;
