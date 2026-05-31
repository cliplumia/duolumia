import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
 
  const secret = request.headers.get('x-api-secret');
  
  if (secret !== env.API_SECRET) {
    return json({ error: 'Accès refusé' }, { status: 401 });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-5.5',
        input: 'Generate en image of: logo moderne cliplumia, fond violet, dimanche matin, style minimaliste',
        tools: [{ type: 'image_generation', action: 'generate' }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return json({
        error: data.error?.message,
        type: data.error?.type,
        code: data.error?.code
      }, { status: response.status });
    }

    return json(data);

  } catch (error) {
    return json({ error: 'Erreur serveur' }, { status: 500 });
  }
