import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const GET: APIRoute = async () => {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

import { supabaseServer } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  const supabaseServerClient = supabaseServer(cookies);
  const { data: { session } } = await supabaseServerClient.auth.getSession();

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { data: profile } = await supabaseServerClient.from('channels').select('is_admin').eq('id', session.user.id).single();
  if (!profile?.is_admin) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from('videos')
    .insert([
      {
        user_id: session.user.id,
        title: body.title,
        description: body.description || null,
        view_count: body.view_count || 0,
        duration: body.duration || null,
        timestamp: body.timestamp || 'Just now',
        thumbnail_url: body.thumbnail_url || null,
        video_url: body.video_url || null,
        author_name: body.author_name || 'Anonymous',
        author_avatar: body.author_avatar || null,
        is_verified: body.is_verified || false,
      },
    ])
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(data), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
};
