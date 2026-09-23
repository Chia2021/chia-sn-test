import { supabase } from './supabase';

/**
 * Uploads a file to the public `cms-assets` bucket and returns its public URL.
 * If `path` already exists, it is overwritten.
 */
export async function uploadToCmsAssets(
  file: File | Blob,
  path: string
): Promise<{ success: true; publicUrl: string } | { success: false; message: string }> {
  try {
    const { error: uploadError } = await supabase.storage
      .from('cms-assets')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || 'application/octet-stream',
      });

    if (uploadError) {
      return { success: false, message: uploadError.message };
    }

    const { data } = supabase.storage.from('cms-assets').getPublicUrl(path);
    if (!data?.publicUrl) {
      return { success: false, message: 'Could not resolve public URL.' };
    }

    return { success: true, publicUrl: data.publicUrl };
  } catch (err: any) {
    return { success: false, message: err?.message ?? 'Upload failed.' };
  }
}