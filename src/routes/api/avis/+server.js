import { json } from '@sveltejs/kit';

export async function POST({ request, platform }) {
  try {
    const { uid, note, commentaire, autorisePublication } = await request.json();
    if (!uid) return json({ error: 'Parametres manquants' }, { status: 400 });

    const BD = platform.env.BD;
    const user = await BD.prepare('SELECT id FROM utilisateurs WHERE id = ?').bind(uid).first();
    if (!user) return json({ error: 'Utilisateur inconnu' }, { status: 404 });

    await BD.prepare(
      'INSERT INTO avis (id, user_id, note, commentaire, autorise_publication) VALUES (?, ?, ?, ?, ?)'
    ).bind(crypto.randomUUID(), uid, note || null, commentaire || null, autorisePublication ? 1 : 0).run();

    return json({ success: true });
  } catch (err) {
    console.error('Avis error:', err);
    return json({ error: err.message }, { status: 500 });
  }
}
