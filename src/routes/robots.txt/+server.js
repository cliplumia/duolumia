export const prerender = true;

export function GET() {
  const body = `User-agent: *
Allow: /

Sitemap: https://cliplumia.com/sitemap.xml`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain' }
  });
}
