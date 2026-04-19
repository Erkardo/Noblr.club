import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { supabase, APP_STATE_TABLE } from '../services/supabase';
import { useLocalStorage } from './useLocalStorage';

const WRITE_DEBOUNCE_MS = 400;

/**
 * Supabase-backed state hook with localStorage fallback.
 * - If Supabase is configured: reads initial value from Supabase, writes on
 *   change (debounced), subscribes to realtime updates for cross-tab sync.
 * - If not configured: behaves like useLocalStorage (drop-in replacement).
 * - localStorage is always kept as a mirror for offline reloads.
 */
export function useSupabaseState<T>(
  key: string,
  initial: T
): [T, Dispatch<SetStateAction<T>>] {
  // localStorage hook gives us an immediate initial value + offline mirror
  const [value, setValue] = useLocalStorage<T>(`noblr:${key}`, initial);
  const lastWrittenRef = useRef<string | null>(null);
  const writeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // On mount: fetch from Supabase, overwriting local if remote exists
  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from(APP_STATE_TABLE)
        .select('value')
        .eq('key', key)
        .maybeSingle();
      if (cancelled || error || !data) return;
      const remote = data.value as T;
      lastWrittenRef.current = JSON.stringify(remote);
      setValue(remote);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // On value change: debounce-write to Supabase
  useEffect(() => {
    if (!supabase) return;
    const serialized = JSON.stringify(value);
    if (serialized === lastWrittenRef.current) return;

    if (writeTimerRef.current) clearTimeout(writeTimerRef.current);
    writeTimerRef.current = setTimeout(async () => {
      const { error } = await supabase!
        .from(APP_STATE_TABLE)
        .upsert({ key, value }, { onConflict: 'key' });
      if (!error) lastWrittenRef.current = serialized;
    }, WRITE_DEBOUNCE_MS);

    return () => {
      if (writeTimerRef.current) clearTimeout(writeTimerRef.current);
    };
  }, [key, value]);

  // Realtime subscription for cross-tab sync
  useEffect(() => {
    if (!supabase) return;
    const channel = supabase
      .channel(`app_state:${key}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: APP_STATE_TABLE, filter: `key=eq.${key}` },
        (payload) => {
          const next = (payload.new as { value?: T } | null)?.value;
          if (next === undefined) return;
          const serialized = JSON.stringify(next);
          if (serialized === lastWrittenRef.current) return;
          lastWrittenRef.current = serialized;
          setValue(next);
        }
      )
      .subscribe();
    return () => {
      supabase!.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [value, setValue];
}
