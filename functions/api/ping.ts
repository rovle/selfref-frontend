export const onRequestGet: PagesFunction = async () =>
  new Response('ok from pages functions', { status: 200, headers: { 'content-type': 'text/plain' }});

