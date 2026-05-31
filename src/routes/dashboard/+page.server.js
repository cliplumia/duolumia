import { redirect } from '@sveltejs/kit';

export async function load({ platform, cookies }) {
  const userId = cookies.get('user_id');

  if (!userId) {
    throw redirect(302, '/signup');
  }

  const user = await platform.env.BD.prepare(
    'SELECT * FROM utilisateurs WHERE id = ?'
  ).bind(userId).first();

  if (!user) {
    throw redirect(302, '/signup');
  }

  return { user };
}
