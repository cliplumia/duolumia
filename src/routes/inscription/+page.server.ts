import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request, platform }) => {
    const data = await request.formData();
    const email = data.get('email');
    const nom = data.get('nom');

    const bd = platform.env.BD; 

    await bd.prepare(
      'INSERT INTO clients (nom, email) VALUES (?, ?)'
    ).bind(nom, email).run();

    return { success: true };
  }
};
