export const handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	if (event.url.pathname === '/favicon.png') {
		return new Response(null, { status: 200 });
	}
	return response;
};
