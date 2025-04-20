import { createBrowserClient } from '@supabase/ssr';

export async function testSupabaseConnection() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  try {
    const { data, error } = await supabase.from('profiles').select('count').single();
    if (error) throw error;
    console.log('Supabase connection successful:', data);
    return true;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
}
