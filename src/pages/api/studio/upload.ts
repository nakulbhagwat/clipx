import type { APIRoute } from 'astro';
import { supabaseServer } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  const supabase = supabaseServer(cookies);
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, video_url, thumbnail_url, is_short } = body;

    if (!title || !video_url) {
      return new Response(JSON.stringify({ error: 'Title and video file are required' }), { status: 400 });
    }

    const { data, error } = await supabase
      .from('videos')
      .insert([
        {
          user_id: session.user.id,
          title,
          description: description || null,
          video_url,
          thumbnail_url: thumbnail_url || null,
          is_short: is_short || false,
          view_count: 0,
          timestamp: 'Just now',
        }
      ])
      .select()
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
