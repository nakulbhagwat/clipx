import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { email, password, name, handle } = await request.json();
    
    if (!email || !password || !name || !handle) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400 });
    }

    const supabase = supabaseServer(cookies);
    
    // Check if handle is already taken
    const { data: existingHandle, error: handleErr } = await supabase
      .from('channels')
      .select('handle')
      .eq('handle', handle)
      .single();

    if (existingHandle) {
      return new Response(JSON.stringify({ error: 'Handle is already taken' }), { status: 400 });
    }

    // Pass custom metadata so the trigger can pick it up
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          handle: handle,
        }
      }
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    return new Response(JSON.stringify({ success: true, user: data.user }), { status: 201 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
