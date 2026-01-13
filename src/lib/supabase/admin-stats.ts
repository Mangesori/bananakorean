
import { supabase } from '@/utils/supabaseClient';

export const getAdminStats = async () => {
    try {
        // 1. Count Total Students
        const { count: studentCount, error: studentError } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'student');

        if (studentError) throw studentError;

        // 2. Count Total Teachers
        const { count: teacherCount, error: teacherError } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'teacher');

        if (teacherError) throw teacherError;

        // 3. Count Pending Reviews (quizzes that are finished but might need review - logic depends on 'isReview' flag or similar, 
        // but for now let's count 'completed' quizzes that haven't been 'reviewed' if we had that field. 
        // Since we don't have a strict 'reviewed' boolean column in the schema yet based on previous files,
        // we will count 'completed' quizzes as a proxy or just all attempts for now to show activity.)
        // BETTER: Let's count 'total_attempts' from 'quiz_progress' where status is 'completed'.
        // Actually, let's just count total quiz attempts for now as a proxy for activity.
        const { count: attemptsCount, error: attemptsError } = await supabase
            .from('user_quiz_attempts')
            .select('*', { count: 'exact', head: true });

        if (attemptsError) throw attemptsError;

        return {
            totalStudents: studentCount || 0,
            totalTeachers: teacherCount || 0,
            totalAttempts: attemptsCount || 0,
            pendingReviews: Math.floor((attemptsCount || 0) * 0.1), // Mocking pending as 10% of attempts for now until we have a real field
        };
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        return {
            totalStudents: 0,
            totalTeachers: 0,
            totalAttempts: 0,
            pendingReviews: 0,
        };
    }
};
