'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/supabase/hooks';
import { updateProfile, uploadProfileImage } from '@/lib/supabase/profile';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { supabase } from '@/utils/supabaseClient';
import UserAvatar from '@/components/shared/UserAvatar';

const ProfileContent = () => {
  const { user } = useAuth();
  const { userName, avatarUrl, refreshProfile } = useUserProfile();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    avatar_url: '',
  });

  useEffect(() => {
    // Context에서 가져온 값으로 초기화
    setFormData(prev => ({
      ...prev,
      name: userName || '',
      avatar_url: avatarUrl || '',
    }));
  }, [userName, avatarUrl]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const { data, error } = await uploadProfileImage(file);
      if (error) throw error;

      setFormData(prev => ({ ...prev, avatar_url: data.publicUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await updateProfile(user.id, {
        full_name: formData.name,
        avatar_url: formData.avatar_url,
      });
      if (error) throw error;

      // Context 새로고침하여 모든 컴포넌트 업데이트
      refreshProfile();
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-6 text-blackColor dark:text-blackColor-dark">
        Profile Settings
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <UserAvatar name={userName} size={96} />
          </div>
          <div>
            <h3
              className="text-lg font-medium text-blackColor dark:text-blackColor-dark"
              suppressHydrationWarning
            >
              {userName}
            </h3>
            <p className="text-contentColor dark:text-contentColor-dark">{formData.email}</p>
          </div>
        </div>

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-blackColor dark:text-blackColor-dark mb-2"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-primaryColor dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-blackColor dark:text-blackColor-dark mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            disabled
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primaryColor text-white py-2 px-4 rounded-lg hover:bg-primaryColor-dark disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default ProfileContent;
