'use client';
import defaultAvatar from '@/assets/images/teacher/teacher__1.png';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';

const ConversationPartner = ({ onUserSelect }) => {
  const { user } = useAuth();
  const [partners, setPartners] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPartners = async () => {
      try {
        setIsLoading(true);

        if (user?.role === 'admin') {
          // 관리자는 모든 학생 목록을 볼 수 있음
          const { data: students, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'student')
            .order('created_at', { ascending: false });

          if (error) throw error;

          // 각 학생의 마지막 메시지 정보 가져오기
          const partnersWithLastMessage = await Promise.all(
            students.map(async student => {
              const { data: messages } = await supabase
                .from('messages')
                .select('*')
                .or(
                  `and(sender_id.eq.${user.id},receiver_id.eq.${student.id}),and(sender_id.eq.${student.id},receiver_id.eq.${user.id})`
                )
                .order('created_at', { ascending: false })
                .limit(1);

              return {
                ...student,
                lastMessage: messages?.[0]?.content || '',
                lastMessageTime: messages?.[0]?.created_at || null,
              };
            })
          );

          setPartners(partnersWithLastMessage);
        } else {
          // 학생은 관리자만 볼 수 있음
          const { data: admins, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'admin');

          if (error) throw error;

          if (admins && admins.length > 0) {
            const admin = admins[0];

            // 관리자와의 마지막 메시지 가져오기
            const { data: messages } = await supabase
              .from('messages')
              .select('*')
              .or(
                `and(sender_id.eq.${user.id},receiver_id.eq.${admin.id}),and(sender_id.eq.${admin.id},receiver_id.eq.${user.id})`
              )
              .order('created_at', { ascending: false })
              .limit(1);

            setPartners([
              {
                ...admin,
                lastMessage: messages?.[0]?.content || '',
                lastMessageTime: messages?.[0]?.created_at || null,
              },
            ]);
          } else {
            // 관리자가 없는 경우 빈 배열 대신 기본 관리자 정보 설정
            setPartners([
              {
                id: 'admin',
                name: 'Administrator',
                role: 'admin',
                lastMessage: 'Contact administrator',
                lastMessageTime: null,
              },
            ]);
          }
        }
      } catch (error) {
        console.error('Error loading partners:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadPartners();
    }
  }, [user]);

  // 검색 필터링
  const filteredPartners = partners.filter(
    partner =>
      partner.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-whiteColor-dark rounded-lg shadow-lg h-[600px] flex flex-col">
      <div className="text-size-22 px-30px py-15px bg-deepgreen rounded-xl dark:bg-deepgreen-dark text-whiteColor dark:text-whiteColor-dark leading-30px font-semibold">
        <h5>{user?.role === 'admin' ? 'Student Messages' : 'Contact Admin'}</h5>
      </div>

      <div className="p-30px">
        <div className="text-darkdeep4 flex items-center pl-5 border border-borderColor dark:border-borderColor-dark rounded-xl">
          <i className="icofont-search-1 text-lg cursor-pointer"></i>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search"
            className="w-full px-5 pl-10px py-10px bg-transparent text-sm focus:outline-none placeholder:text-placeholder placeholder:opacity-80 leading-7 font-medium"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredPartners.map(partner => (
            <li
              key={partner.id}
              onClick={() => onUserSelect(partner)}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer p-4"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12">
                  <Image
                    src={partner.avatar_url || '/default-avatar.png'}
                    alt={`${partner.name}'s avatar`}
                    width={48}
                    height={48}
                    className="w-full rounded-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div>
                    <h5 className="text-lg font-medium text-blackColor dark:text-blackColor-dark flex items-center justify-between">
                      <span className="leading-6">{partner.name}</span>
                      {partner.lastMessageTime && (
                        <span className="text-sm text-darkdeep4 font-inter leading-6 font-normal">
                          {new Date(partner.lastMessageTime).toLocaleTimeString()}
                        </span>
                      )}
                    </h5>
                    <p className="text-sm text-darkdeep4 text-start leading-6">
                      {partner.lastMessage || 'No messages yet'}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ConversationPartner;
