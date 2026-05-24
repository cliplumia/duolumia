import { env } from '$env/dynamic/private';
const OPENAI_API_KEY = env.OPENAI_API_KEY;

import { json } from '@sveltejs/kit';
export async function GET() {
    try {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'dall-e-3',
                prompt: 'Logo moderne Cliplumia, fond violet, dimanche matin',
                n: 1,
                size: '1024x1024'
            })
        });

        const data = await response.json();
        
        if (data.error) {
            return json({ error: data.error.message }, { status: 400 });
        }

        return json({ url: data.data[0].url });
    } catch (error) {
        return json({ error: error.message }, { status: 500 });
    }
}
