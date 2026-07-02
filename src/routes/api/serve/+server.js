import { json } from '@sveltejs/kit';

export async function GET({ url, platform, cookies }) {
  try {
    const token = url.searchParams.get('token');
    if (!token) return json({ error: 'Token manquant' }, { status: 400 });

    const userId = cookies.get('user_id') || cookies.get('userid');
    if (!userId) return json({ error: 'Non connecte' }, { status: 401 });

    // Vérifier si le token est valide et appartient à l'utilisateur
    const generation = await platform.env.BD.prepare(
      "SELECT * FROM generations WHERE final_token = ? AND user_id = ?"
    ).bind(token, userId).first();

    if (!generation) {
      return json({ error: 'Token invalide' }, { status: 403 });
    }

    // Vérifier l'expiration (15 minutes)
    const expiresAt = new Date(generation.final_token_expires_at);
    if (expiresAt < new Date()) {
      return json({ error: 'Token expire' }, { status: 403 });
    }

    // Récupérer le fichier dans le bucket R2 privé
    const object = await platform.env.R2_GENERATIONS_BUCKET.get(generation.final_key);

    if (!object) {
      return json({ error: 'Fichier introuvable' }, { status: 404 });
    }

    // Servir le fichier avec un en-tête pour forcer le téléchargement
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('Content-Disposition', `attachment; filename="${generation.final_key}"`);

    return new Response(object.body, { headers });

  } catch (err) {
    console.error('Serve error:', err);
    return json({ error: err.message }, { status: 500 });
  }
}
