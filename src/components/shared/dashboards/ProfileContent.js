'use client';
import React, { useState } from 'react';
import { useAuth } from '@/lib/supabase/hooks';
import { updateProfile, uploadProfileImage } from '@/lib/supabase/profile';

const ProfileContent = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.name || '',
    email: user?.email || '',
    avatar_url: user?.user_metadata?.avatar_url || '',
  });

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
      const { error } = await updateProfile({
        name: formData.name,
        avatar_url: formData.avatar_url,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error updating profile:', error);
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
          <div className="relative w-24 h-24">
            <img
              src={formData.avatar_url || '/images/user1.jpg'}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-primaryColor text-white p-2 rounded-full cursor-pointer hover:bg-primaryColor-dark"
            >
              <i className="icofont-camera text-lg"></i>
            </label>
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          <div>
            <h3 className="text-lg font-medium text-blackColor dark:text-blackColor-dark">
              {formData.name}
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
