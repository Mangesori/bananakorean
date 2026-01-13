'use client';

import React, { useEffect, useState } from 'react';
import { getAdminStats } from '@/lib/supabase/admin-stats';
import counter1 from '@/assets/images/counter/counter__1.png';
import counter2 from '@/assets/images/counter/counter__2.png';
import counter3 from '@/assets/images/counter/counter__3.png';
import counter4 from '@/assets/images/counter/counter__4.png';
import CounterDashboard from '@/components/shared/dashboards/CounterDashboard';
import HeadingDashboard from '@/components/shared/headings/HeadingDashboard';

const CounterAdmin = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalAttempts: 0,
    pendingReviews: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getAdminStats();
      setStats(data);
    };
    fetchStats();
  }, []);

  const counts = [
    {
      name: 'Total Students',
      image: counter1,
      data: stats.totalStudents,
      symbol: '',
    },
    {
      name: 'Total Teachers',
      image: counter2,
      data: stats.totalTeachers,
      symbol: '',
    },
    {
      name: 'Pending Reviews',
      image: counter3,
      data: stats.pendingReviews,
      symbol: '',
    },
    {
      name: 'Total Activities',
      image: counter4,
      data: stats.totalAttempts,
      symbol: ' completions',
    },
  ];
  return (
    <CounterDashboard counts={counts}>
      <HeadingDashboard>Admin Overview</HeadingDashboard>
    </CounterDashboard>
  );
};

export default CounterAdmin;
