import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://imwglurmizfepuwoaocp.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 只在客户端创建Supabase客户端
let supabase: SupabaseClient | null = null;

if (typeof window !== 'undefined') {
  // 只在浏览器环境中创建客户端
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
