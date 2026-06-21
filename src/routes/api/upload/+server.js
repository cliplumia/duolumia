import { json } from '@sveltejs/kit';

export async function POST({ request, platform }) {
  try {
    const { fileBase64, fileType } = await request.json();
    
    if (!fileBase64 || !platform.env.R2_BUCKET) {
      return json({ error: 'Fichier ou bucket R2 manquant' }, { status: 400 });
    }

    const matches = fileBase64.match(/^data:([\w\/]+);base64,(.+)$/);
    if (!matches) {
      return json({ error: 'Format fichier invalide' }, { status: 400 });
    }

    const contentType = matches[1];
    const base64Data = matches[2];
    
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const extension = contentType.split('/')[1];
    const prefix = fileType || 'file';
    const filename = `${prefix}-${Date.now()}.${extension}`;

    await platform.env.R2_BUCKET.put(filename, bytes, {
      httpMetadata: { contentType: contentType }
    });

    const publicUrl = `https://pub-735f3b0c41604ae28dc263d976e80d1e.r2.dev/${filename}`;

    return json({ success: true, url: publicUrl });
  } catch (err) {
    console.error('Upload error:', err);
    return json({ error: err.message }, { status: 500 });
  }
}
