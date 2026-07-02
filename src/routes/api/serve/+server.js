import { json } from '@sveltejs/kit';

export async function GET({ url, platform, cookies }) {
  try {
    const token = url.searchParams.get('token');
    if (!token) return json({ error: 'Token manquant' }, { status: 400 });

    const userId = cookies.get('user_id') || cookies.get('userid');
    if (!userId) return json({ error: 'Non connecte' }, { status: 401 });

    // Chercher la génération (token de preview OU token final)
    const generation = await platform.env.BD.prepare(
      "SELECT * FROM generations WHERE (final_token = ? OR preview_token = ?) AND user_id = ?"
    ).bind(token, token, userId).first();

    if (!generation) {
      return json({ error: 'Token invalide' }, { status: 403 });
    }

    // Vérifier l'expiration
    const now = new Date();
    let expiresAt;
    
    if (generation.final_token === token && generation.final_token_expires_at) {
      expiresAt = new Date(generation.final_token_expires_at);
    } else if (generation.preview_token === token && generation.preview_token_expires_at) {
      expiresAt = new Date(generation.preview_token_expires_at);
    } else {
      return json({ error: 'Token expire' }, { status: 403 });
    }

    if (expiresAt < now) {
      return json({ error: 'Token expire' }, { status: 403 });
    }

    // Récupérer le fichier dans le bucket R2 privé
    const objectKey = generation.final_key;
    const object = await platform.env.R2_GENERATIONS_BUCKET.get(objectKey);

    if (!object) {
      return json({ error: 'Fichier introuvable' }, { status: 404 });
    }

    // Servir le fichier
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    
    // Si c'est un token final, forcer le téléchargement, sinon afficher en ligne (preview)
    if (generation.final_token === token) {
      headers.set('Content-Disposition', `attachment; filename="${objectKey}"`);
    } else {
      headers.set('Content-Disposition', `inline; filename="${objectKey}"`);
    }

    return new Response(object.body, { headers });

  } catch (err) {
    console.error('Serve error:', err);
    return json({ error: err.message }, { status: 500 });
  }
}
