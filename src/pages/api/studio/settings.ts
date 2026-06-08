import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../lib/supabase';

export const PUT: APIRoute = async ({ request, cookies }) => {
  const supabase = supabaseServer(cookies);
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const body = await request.json();
    const { channel_name, handle, description, avatar_url } = body;

    if (!channel_name || !handle) {
      return new Response(JSON.stringify({ error: 'Name and handle are required' }), { status: 400 });
    }

    // Check if handle is already taken by someone else
    const { data: existingHandle } = await supabase
      .from('channels')
      .select('id')
      .eq('handle', handle)
      .neq('id', session.user.id)
      .single();

    if (existingHandle) {
      return new Response(JSON.stringify({ error: 'Handle is already taken' }), { status: 400 });
    }

    const { error } = await supabase
      .from('channels')
      .update({
        channel_name,
        handle,
        description: description || null,
        avatar_url: avatar_url || null,
      })
      .eq('id', session.user.id);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
