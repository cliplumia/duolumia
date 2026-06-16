import { json } from '@sveltejs/kit';
import Replicate from 'replicate';

export async function POST({ request, platform, cookies }) {
  try {
    const replicate = new Replicate({
      auth: platform.env.REPLICATE_API_TOKEN,
    });

    const userId = cookies.get('user_id') || cookies.get('userid');
    if (!userId) return json({ error: 'Non connecte' }, { status: 401 });

    const BD = platform.env.BD;
    const user = await BD.prepare('SELECT * FROM utilisateurs WHERE id =?').bind(userId).first();
    if (!user) return json({ error: 'Utilisateur inconnu' }, { status: 404 });

    const isAdmin = ['contact.cliplumia@gmail.com', 'dussolliermarjorie@gmail.com'].includes(user.email);
    if (!isAdmin && (user.images_restantes || 0) <= 0) {
      return json({ error: 'Credits images epuises' }, { status: 403 });
    }

    const { prompt } = await request.json();
    if (!prompt) return json({ error: 'Prompt manquant' }, { status: 400 });

    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt: prompt,
          aspect_ratio: "1:1",
          output_format: "webp",
          output_quality: 90
        }
      }
    );

    if (!isAdmin) {
      await BD.prepare('UPDATE utilisateurs SET images_restantes = images_restantes - 1 WHERE id =?').bind(userId).run();
    }

    return json({ image: output[0] });
    
  } catch (error) {
    console.error('Generate image error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}
