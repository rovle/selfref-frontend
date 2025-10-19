// /server/api/[...path].ts
export default defineEventHandler(async (event) => {
  // Read Pages bindings from the Cloudflare runtime (Nuxt exposes them here on Pages)
  const { BACKEND_ORIGIN, CF_ACCESS_CLIENT_ID, CF_ACCESS_CLIENT_SECRET } =
    (event.context.cloudflare?.env || {}) as Record<string, string>;

  if (!BACKEND_ORIGIN || !CF_ACCESS_CLIENT_ID || !CF_ACCESS_CLIENT_SECRET) {
    return new Response("Missing required env vars", { status: 500 });
  }

  // Build upstream URL: keep path after /api and forward query string
  const incoming = new URL(getRequestURL(event));
  const rest = incoming.pathname.replace(/^\/api/, "") || "/";
  const upstream = new URL(BACKEND_ORIGIN);
  upstream.pathname = `${upstream.pathname.replace(/\/$/, "")}${rest}`;
  upstream.search = incoming.search;

  // Forward request headers and add Access service token
  const hdrs = new Headers(getRequestHeaders(event));
  hdrs.set("CF-Access-Client-Id", CF_ACCESS_CLIENT_ID);
  hdrs.set("CF-Access-Client-Secret", CF_ACCESS_CLIENT_SECRET);

  const method = getMethod(event);
  const body =
    method === "GET" || method === "HEAD" ? undefined : await readRawBody(event);

  const resp = await fetch(upstream.toString(), {
    method,
    headers: hdrs,
    body: body as any,
    redirect: "follow",
  });

  // Return the upstream response as-is (no CORS needed; same-origin to the browser)
  return new Response(resp.body, { status: resp.status, headers: resp.headers });
});

