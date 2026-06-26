import { json } from '@sveltejs/kit';

export async function POST({ request, platform, cookies }) {
  try {
    const userId = cookies.get('user_id') || cookies.get('userid');
    if (!userId) return json({ error: 'Non connecté' }, { status: 401 });

    const BD = platform.env.BD;
    const user = await BD.prepare('SELECT * FROM utilisateurs WHERE id = ?').bind(userId).first();
    if (!user) return json({ error: 'Utilisateur inconnu' }, { status: 404 });

    const isAdmin = ['contact.cliplumia@gmail.com', 'dussolliermarjorie@gmail.com'].includes(user.email);

    const { text, voice, lang } = await request.json();
    if (!text) return json({ error: 'Texte manquant' }, { status: 400 });

    // 🌍 Choix de la voix selon la langue
    const isFrench = lang === 'FR' || lang === 'fr' || lang === 'français';
    
    let voiceId;
    if (isFrench) {
      // 🇫🇷 VOIX FRANÇAISES
            const voixMapFR = {
        'femme': 'ff_siwis',
        'homme': 'am_adam',
        'enfant': 'ff_siwis',
        'mature': 'am_michael',
        'ana': 'ff_siwis',
        'florence': 'ff_siwis',
        'thomas': 'am_adam'
      };
      voiceId = voixMapFR[voice] || 'ff_siwis';
    } else {
      // 🇬🇧 VOIX ANGLAISES
      const voixMapEN = {
        'femme': 'af_bella',
        'homme': 'am_adam',
        'enfant': 'af_bella',
        'mature': 'am_adam',
        'ana': 'af_bella',
        'florence': 'af_nicole',
        'thomas': 'am_michael'
      };
      voiceId = voixMapEN[voice] || 'af_bella';
    }

    const rep = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${platform.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait'
      },
      body: JSON.stringify({
        version: "f559560eb822dc509045f3921a1921234918b91739db4bf3daab2169b71c7a13",
        input: {
          text: text,
          voice: voiceId,
          speed: 1
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
