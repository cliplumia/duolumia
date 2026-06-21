import { json } from '@sveltejs/kit';

export async function POST({ request, platform }) {
  try {
    const { imageBase64 } = await request.json();
    
    if (!imageBase64 || !platform.env.R2_BUCKET) {
      return json({ error: 'Image ou bucket R2 manquant' }, { status: 400 });
    }

    // Extraire le type d'image et les données binaires
    const matches = imageBase64.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) {
      return json({ error: 'Format image invalide' }, { status: 400 });
    }

    const contentType = matches[1]; // ex: "image/webp" ou "image/png"
    const base64Data = matches[2];
    
    // Convertir base64 en binaire
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Nom unique pour le fichier
    const extension = contentType.split('/')[1]; // "webp", "png", etc.
    const filename = `lipsync-${Date.now()}.${extension}`;

    // Upload sur R2
    await platform.env.R2_BUCKET.put(filename, bytes, {
      httpMetadata: { contentType: contentType }
    });

    // URL publique R2
    const publicUrl = `https://pub-735f3b0c41604ae28dc263d976e80d1e.r2.dev/${filename}`;
    
    return json({ success: true, url: publicUrl });
  } catch (err) {
    console.error('Upload error:', err);
    return json({ error: err.message }, { status: 500 });
  }
}
