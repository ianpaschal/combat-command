export const getAuthHeaders = () => ({
  'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
  'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
});
