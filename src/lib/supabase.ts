import { createClient } from '@supabase/supabase-js';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { AstroCookies } from 'astro';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

// Default client (useful for client-side or simple ops without auth context)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with Cookie context for Auth
export const supabaseServer = (cookies: AstroCookies) => {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(key: string) {
        return cookies.get(key)?.value;
      },
      set(key: string, value: string, options: CookieOptions) {
        try {
          cookies.set(key, value, options);
        } catch (error) {
          // Response may have already been sent to the browser
        }
      },
      remove(key: string, options: CookieOptions) {
        try {
          cookies.delete(key, options);
        } catch (error) {
          // Response may have already been sent to the browser
        }
      },
    },
  });
};
