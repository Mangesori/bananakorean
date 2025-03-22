'use client';
import React, { useState, useEffect } from 'react';
import ButtonPrimary from '../buttons/ButtonPrimary';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/utils/supabaseClient';

const ProfileContent = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        nickname: user.nickname || user.user_metadata?.username || '',
      });
    }
  }, [user]);

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      if (!session?.user?.id) {
        throw new Error('사용자 세션을 찾을 수 없습니다.');
      }

      // profiles 테이블 업데이트
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: formData.name || null,
          nickname: formData.nickname || null,
        })
        .eq('id', session.user.id);

      if (profileError) throw profileError;

      // user_metadata 업데이트
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { username: formData.nickname || null },
      });

      if (metadataError) throw metadataError;

      alert('프로필이 성공적으로 업데이트되었습니다.');

      // 페이지 새로고침 대신 상태 직접 업데이트
      if (user) {
        user.name = formData.name;
        user.nickname = formData.nickname;
        user.user_metadata = {
          ...user.user_metadata,
          username: formData.nickname,
        };
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(`프로필 업데이트 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  return (
    <form
      className="text-sm text-blackColor dark:text-blackColor-dark leading-1.8"
      data-aos="fade-up"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-y-15px">
        <div>
          <label className="mb-3 block font-semibold">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full py-10px px-5 text-sm focus:outline-none text-contentColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 leading-23px rounded-md font-no"
          />
        </div>
        <div>
          <label className="mb-3 block font-semibold">Nickname</label>
          <input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            placeholder="Nickname"
            className="w-full py-10px px-5 text-sm focus:outline-none text-contentColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 leading-23px rounded-md font-no"
          />
        </div>
      </div>

      <div className="mt-15px">
        <ButtonPrimary type="submit">Update Infomation</ButtonPrimary>
      </div>
    </form>
  );
};

export default ProfileContent;
