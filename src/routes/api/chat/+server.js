import { json } from '@sveltejs/kit';

export async function POST({ request, platform, cookies }) {
  try {
    const userId = cookies.get('user_id') || cookies.get('userid');
    if (!userId) return json({ error: 'Non connecte' }, { status: 401 });

    const BD = platform.env.BD;
    const user = await BD.prepare('SELECT * FROM utilisateurs WHERE id = ?').bind(userId).first();
    if (!user) return json({ error: 'Utilisateur inconnu' }, { status: 404 });

    const isAdmin = ['contact.cliplumia@gmail.com', 'dussolliermarjorie@gmail.com'].includes(user.email);

    if (!isAdmin && (user.chat_restantes || 0) <= 0) {
      return json({ error: 'Credits chat epuises' }, { status: 403 });
    }

    const { message } = await request.json();
    if (!message) return json({ error: 'Message vide' }, { status: 400 });

    const replicateRes = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${platform.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait'
      },
      body: JSON.stringify({
        version: "meta/meta-llama-3-8b-instruct",
        input: {
          prompt: message,
          max_tokens: 512
        }
      })
    });

    if (!replicateRes.ok) {
      const err = await replicateRes.json();
      throw new Error(err.detail || 'Erreur Replicate');
    }

    const data = await replicateRes.json();

    if (data.status !== 'succeeded' || !data.output) {
      throw new Error('Reponse echoue');
    }

    if (!isAdmin) {
      await BD.prepare('UPDATE utilisateurs SET chat_restantes = chat_restantes - 1 WHERE id = ?')
        .bind(userId).run();
    }

    const reply = Array.isArray(data.output) ? data.output.join('') : data.output;

    return json({ success: true, reply });

  } catch (err) {
    console.error('Chat error:', err);
    return json({ error: err.message }, { status: 500 });
  }
}
