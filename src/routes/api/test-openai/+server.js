import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';

const OPENAI_API_KEY = env.OPENAI_API_KEY;

export async function GET() {
    try {
        const response = await fetch('https://api.openai.com/v1/responses', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-5.5',
                input: 'Generate an image of: Logo moderne Cliplumia, fond violet, dimanche matin, style minimaliste',
                tools: [{ type: "image_generation", action: "generate" }]
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
        
        const imageOutput = data.output?.find(o => o.type === 'image_generation_call');
        
        if (imageOutput?.result) {
            // On renvoie direct une page HTML pour voir l'image
            return new Response(`
                <h1>Logo Cliplumia généré avec GPT-5.5 ✅</h1>
                <img src="data:image/png;base64,${imageOutput.result}" style="max-width:500px; border:2px solid #7c3aed"/>
                <p>Fond violet validé chef 👊</p>
            `, {
                headers: { 'Content-Type': 'text/html' }
            });
        }
        
        return json(data);
        
    } catch (error) {
        return json({ error: error.message }, { status: 500 });
    }
}

