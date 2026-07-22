import { json } from '@sveltejs/kit';

export async function GET({ platform }) {
  const s = platform?.env?.STRIPE_WEBHOOK_SECRET || '';
  return json({
    length: s.length,
    first6: s.slice(0, 6),
    last6: s.slice(-6),
    hasWhitespace: /\s/.test(s)
  });
}
