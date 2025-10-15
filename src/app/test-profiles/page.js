'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function TestProfilesPage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfiles() {
      try {
        const supabase = createClient();

        // 모든 프로필 가져오기
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        console.log('All profiles:', data);
        setProfiles(data || []);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfiles();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Profiles 테이블 데이터</h1>

      <div className="mb-4 p-4 bg-blue-50 rounded">
        <p className="font-semibold">총 사용자 수: {profiles.length}</p>
        <p>Admin: {profiles.filter(p => p.role === 'admin').length}</p>
        <p>Student: {profiles.filter(p => p.role === 'student').length}</p>
      </div>

      {profiles.length === 0 ? (
        <p className="text-gray-500">프로필 데이터가 없습니다.</p>
      ) : (
        <div className="space-y-4">
          {profiles.map(profile => (
            <div
              key={profile.id}
              className="border p-4 rounded-lg bg-white shadow"
            >
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-semibold">ID:</span> {profile.id}
                </div>
                <div>
                  <span className="font-semibold">Name:</span> {profile.name || '(없음)'}
                </div>
                <div>
                  <span className="font-semibold">Email:</span> {profile.email || '(없음)'}
                </div>
                <div>
                  <span className="font-semibold">Role:</span>{' '}
                  <span className={`px-2 py-1 rounded ${profile.role === 'admin' ? 'bg-red-100' : 'bg-blue-100'}`}>
                    {profile.role || '(없음)'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
