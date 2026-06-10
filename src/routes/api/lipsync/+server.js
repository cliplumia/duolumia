import { json } from '@sveltejs/kit';

export async function POST({ request, platform, cookies }) {
  try {
   const userId = cookies.get('user_id') || cookies.get('userId');
 if (!userId) return json({ error: 'Non connecte' }, { status: 401 });

 const user = await platform.env.BD.prepare("SELECT * FROM utilisateurs WHERE id =?").bind(userId).first();
 if (!user) return json({ error: 'Utilisateur introuvable' }, { status: 401 });
 const userEmail = user.email;
    if (!image || !audio) return json({ error: 'Image et audio requis' }, { status: 400 });

    const replicateRes = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${platform.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait'
      },
      body: JSON.stringify({
        version: "cjwbw/sadtalker:VERSION_A_REMPLACER", // Récupère le hash sur Replicate
        input: {
          source_image: image,
          driven_audio: audio
        }
      })
    });

    if (!replicateRes.ok) {
      const err = await replicateRes.json();
      throw new Error(err.detail || 'Erreur Replicate');
    }

    const data = await replicateRes.json();
    
    if (data.status !== 'succeeded' || !data.output) {
      throw new Error('Lipsync echoue');
    }
 const videoUrl = Array.isArray(data.output)? data.output[0] : data.output;

 // ✅ DÉCOMPTE -1 SEULEMENT SI LA VIDÉO A RÉUSSI
  const isAdmin = ['contact.cliplumia@gmail.com', 'dussolliermarjorie@gmail.com'].includes(userEmail);

  if (!isAdmin) {
  await platform.env.BD.prepare("UPDATE utilisateurs SET voices_restantes = voices_restantes - 1 WHERE id =?")
.bind(userId).run();
 }
return json({ success: true, url: videoUrl });

  } catch (err) {
    console.error('Lipsync error:', err);
    return json({ error: err.message }, { status: 500 });
  }
}
