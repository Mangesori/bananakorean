import React from 'react';
import HeadingDashboard from '@/components/shared/headings/HeadingDashboard';

const AdminCoursesMain = () => {
    return (
        <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
            <HeadingDashboard>Course Management</HeadingDashboard>
            <div className="py-10 text-center">
                <p className="text-gray-500">Course management features coming soon (Phase 5).</p>
            </div>
        </div>
    );
};

export default AdminCoursesMain;
