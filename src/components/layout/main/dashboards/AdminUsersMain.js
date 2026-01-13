'use client';

import React, { useEffect, useState } from 'react';
import HeadingDashboard from '@/components/shared/headings/HeadingDashboard';
import { getAllUsers } from '@/lib/supabase/profile';

const AdminUsersMain = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all'); // all, student, teacher
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await getAllUsers();
        if (data) {
          setUsers(data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true;
    return user.role === filter;
  });

  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
      <HeadingDashboard>User Management</HeadingDashboard>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
        {['all', 'student', 'teacher'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg capitalize font-medium transition-colors ${filter === f
              ? 'bg-primaryColor text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
          >
            {f === 'all' ? 'All Users' : `${f}s`}
          </button>
        ))}
      </div>

      {/* User Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="p-4 font-semibold text-gray-900 dark:text-white">Name</th>
              <th className="p-4 font-semibold text-gray-900 dark:text-white">Email</th>
              <th className="p-4 font-semibold text-gray-900 dark:text-white">Role</th>
              <th className="p-4 font-semibold text-gray-900 dark:text-white">Joined</th>
              <th className="p-4 font-semibold text-gray-900 dark:text-white">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">Loading users...</td>
              </tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-lg">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt={user.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <span>{(user.name || user.email || 'U')[0].toUpperCase()}</span>
                        )}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {user.name || 'No Name'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize
                      ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'teacher' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                      }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 text-sm">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                      Active
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersMain;
