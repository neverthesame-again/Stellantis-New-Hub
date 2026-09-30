import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://obdlwgafbhmrgwmvlgei.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iZGx3Z2FmYmhtcmd3bXZsZ2VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0NjY4MjUsImV4cCI6MjEwNTA0MjgyNX0.2hSWkeMHjv5vITrk8LBwyMDCgwULf9dWv_7mMfmRmfI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
