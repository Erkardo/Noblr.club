// SECURITY NOTE: SUPABASE_URL + SUPABASE_ANON_KEY are exposed client-side via
// vite.config.ts define. This is acceptable — anon keys are designed for
// client exposure (RLS enforces row-level auth). NEVER put the service_role
// key here — it bypasses RLS and is admin-level.

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey, {
    auth: { persistSession: false },
    realtime: { params: { eventsPerSecond: 10 } },
  }) : null;

export const isSupabaseAvailable = (): boolean => supabase !== null;

export const APP_STATE_TABLE = 'app_state';
