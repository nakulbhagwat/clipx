import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const GET: APIRoute = async () => {
  // Try to fetch existing settings
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 'main')
    .maybeSingle();

  if (error) {
    return new Response(JSON.stringify({ error: error.message, code: error.code }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // If no row exists, try to create one
  if (!data) {
    const { data: newData, error: insertError } = await supabase
      .from('site_settings')
      .insert([{ id: 'main' }])
      .select()
      .single();

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message, code: insertError.code }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(newData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

import { supabaseServer } from '../../lib/supabase';

export const PUT: APIRoute = async ({ request, cookies }) => {
  const supabaseServerClient = supabaseServer(cookies);
  const { data: { session } } = await supabaseServerClient.auth.getSession();

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { data: profile } = await supabaseServerClient.from('channels').select('is_admin').eq('id', session.user.id).single();
  if (!profile?.is_admin) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  let body;
  try {
    const text = await request.text();
    body = text ? JSON.parse(text) : {};
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Invalid JSON body: ' + err.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const updateData: Record<string, any> = {
    id: 'main',
    updated_at: new Date().toISOString(),
  };

  // Only update fields that are provided
  if (body.branding !== undefined) updateData.branding = body.branding;
  if (body.sidebar !== undefined) updateData.sidebar = body.sidebar;
  if (body.sidebar_footer !== undefined) updateData.sidebar_footer = body.sidebar_footer;
  if (body.categories !== undefined) updateData.categories = body.categories;
  if (body.section_headings !== undefined) updateData.section_headings = body.section_headings;
  if (body.empty_state !== undefined) updateData.empty_state = body.empty_state;

  // Use upsert so it works even if the row doesn't exist yet
  const { data, error } = await supabase
    .from('site_settings')
    .upsert(updateData, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message, code: error.code }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
