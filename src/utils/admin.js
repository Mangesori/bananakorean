import { supabase } from './supabaseClient';

export const updateUserRole = async (userId, newRole) => {
  try {
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { success: false, error: error.message };
  }
};
