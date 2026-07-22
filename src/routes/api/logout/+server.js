import { json } from '@sveltejs/kit';

export async function POST({ cookies }) {
  cookies.delete('user_id', { path: '/' });
  return json({ success: true });
}
