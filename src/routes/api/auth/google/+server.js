import { json } from '@sveltejs/kit';

export async function POST({ request, platform }) {
  try {
    const body = await request.json();
    
    // Test 1 : platform existe ?
    if (!platform) {
      return json({ error: 'PLATFORM_MANQUANT' }, { status: 500 });
    }
    
    // Test 2 : env existe ?
    if (!platform.env) {
      return json({ error: 'ENV_MANQUANT' }, { status: 500 });
    }
    
    // Test 3 : BD existe ?
    const BD = platform.env.BD;
    if (!BD) {
      return json({ error: 'BD_MANQUANT' }, { status: 500 });
    }
    
    // Test 4 : D1 répond ?
    const test = await BD.prepare('SELECT 1 as test').first();
    
    // Si tout marche, on fait le vrai travail
    const { token, plan } = body;
    if (!token || !plan) {
      return json({ error: 'TOKEN_OU_PLAN_MANQUANT' }, { status: 400 });
    }
    
    // Décodage simple
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const pad = '='.repeat((4 - base64.length % 4) % 4);
    const payload = JSON.parse(atob(base64 + pad));
    
    const userId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    const now = new Date().toISOString();
    
    await BD.prepare(
      'INSERT OR REPLACE INTO utilisateurs (id, google_id, email, nom, plan, cree_a, mis_a_jour_a) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(userId, payload.sub, payload.email, payload.name || '', plan, now, now).run();
    
    return json({ success: true, email: payload.email });
    
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}
