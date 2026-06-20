import { json } from '@sveltejs/kit';

export async function POST({ request, platform, cookies }) {
  try {
    const userId = cookies.get('user_id') || cookies.get('userid');
    if (!userId) return json({ error: 'Non connecte' }, { status: 401 });

    const BD = platform.env.BD;
    const user = await BD.prepare('SELECT * FROM utilisateurs WHERE id = ?').bind(userId).first();
    if (!user) return json({ error: 'Utilisateur inconnu' }, { status: 404 });

    const isAdmin = ['contact.cliplumia@gmail.com', 'dussolliermarjorie@gmail.com'].includes(user.email);

    const { text, voice } = await request.json();
    if (!text) return json({ error: 'Texte manquant' }, { status: 400 });

    // ✅ Voix de référence (femme française calme)
    const voiceMap = {
      'ana': 'https://replicate.delivery/pbxt/JqzxMWScZ4O44XwIwWveDoeAE2Ga7gYdnXKb8l18Fv7D3QEx/female.wav',
      'florence': 'https://replicate.delivery/pbxt/JqzxMWScZ4O44XwIwWveDoeAE2Ga7gYdnXKb8l18Fv7D3QEx/female.wav',
      'thomas': 'https://replicate.delivery/pbxt/JqzxMWScZ4O44XwIwWveDoeAE2Ga7gYdnXKb8l18Fv7D3QEx/female.wav'
    };
    
    const speakerWav = voiceMap[voice] || voiceMap['ana'];

    const replicateRes = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${platform.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait'
      },
      body: JSON.stringify({
        version: "684bc3855b37866c0c65add2ff39c78f3dea3f4ff103a436465326e0f438d55e",
        input: {
          text: text,
          speaker_wav: speakerWav,
          language: "fr"
        }
      })
    });

    if (!replicateRes.ok) {
      const err = await replicateRes.json();
      throw new Error(err.detail || 'Erreur Replicate');
    }

    const data = await replicateRes.json();
    
    if (data.status !== 'succeeded' || !data.output) {
      throw new Error('Generation echoue');
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
