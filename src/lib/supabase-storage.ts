import { createClient } from '@supabase/supabase-js';

// Client-side Supabase instance for storage uploads
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload a file to a Supabase Storage bucket.
 * Returns the public URL of the uploaded file.
 */
export async function uploadToStorage(
  bucket: 'videos' | 'thumbnails',
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `${fileName}`;

  // Simulate progress since supabase-js doesn't expose upload progress natively
  if (onProgress) onProgress(10);

  const { data, error } = await supabaseClient.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (onProgress) onProgress(80);

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabaseClient.storage
    .from(bucket)
    .getPublicUrl(data.path);

  if (onProgress) onProgress(100);

  return urlData.publicUrl;
}
