import { json } from '@sveltejs/kit';

export async function POST({ request, platform, cookies }) {
  try {
    const userId = cookies.get('user_id') || cookies.get('userid');
    if (!userId) return json({ error: 'Non connecté' }, { status: 401 });

    const BD = platform.env.BD;
    const user = await BD.prepare('SELECT * FROM utilisateurs WHERE id = ?').bind(userId).first();
    if (!user) return json({ error: 'Utilisateur inconnu' }, { status: 404 });

    const isAdmin = ['contact.cliplumia@gmail.com', 'dussolliermarjorie@gmail.com'].includes(user.email);

    if (!isAdmin && (user.voices_restantes || 0) <= 0) {
      return json({ error: 'Forfait voix epuise. Passez a un forfait superieur !' }, { status: 403 });
    }

    const { text, speaker, lang, emotion } = await request.json();
    if (!text) return json({ error: 'Texte manquant' }, { status: 400 });

    const rep = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${platform.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait'
      },
      body: JSON.stringify({
        version: "qwen/qwen3-tts",
        input: {
          text: text,
          mode: "custom_voice",
          language: lang || "auto",
          speaker: speaker || "Serena",
          style_instruction: emotion || ""
        }
      })
    });

    if (!rep.ok) {
      const err = await rep.json();
      console.error('Replicate error:', err);
      throw new Error(err.detail || JSON.stringify(err));
    }

    const data = await rep.json();

    if (data.status !== 'succeeded' || !data.output) {
      throw new Error('Génération échouée');
    }

    const audioUrl = Array.isArray(data.output) ? data.output[0] : data.output;

    const genId = crypto.randomUUID();
    const now = new Date().toISOString();

    await BD.prepare(
      'INSERT INTO generations (id, user_id, type, prompt, url, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(genId, userId, 'voice', text, audioUrl, 'preview', now).run();

    if (!isAdmin) {
      await BD.prepare('UPDATE utilisateurs SET voices_restantes = voices_restantes - 1 WHERE id = ?')
        .bind(userId).run();
    }

    return json({ success: true, url: audioUrl, id: genId });

  } catch (err) {
    console.error('Voice error:', err);
    return json({ error: err.message }, { status: 500 });
  }
}
