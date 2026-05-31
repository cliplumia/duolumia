import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ request, platform }) => {
    try {
      const data = await request.formData();
      const email = data.get('email');
      const nom = data.get('nom');

      if (!email || !nom) {
        return fail(400, { error: 'Email et nom requis' });
      }

      const bd = platform?.env?.BD;

      if (!bd) {
        return fail(500, { error: 'Base de données non disponible' });
      }

      await bd.prepare(
        'INSERT INTO clients (nom, email) VALUES (?, ?)'
      ).bind(nom, email).run();

      return { success: true };
    } catch (err) {
      console.error('Erreur inscription:', err);
      return fail(500, { error: 'Erreur lors de l\'inscription' });
    }
  }
};
