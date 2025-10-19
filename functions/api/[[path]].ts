export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Only proxy /api/*
    if (url.pathname.startsWith("/api/")) {
      const rest = url.pathname.replace(/^\/api/, "") || "/";
      const upstream = new URL(env.BACKEND_ORIGIN);
      upstream.pathname = `${upstream.pathname.replace(/\/$/, "")}${rest}`;
      upstream.search = url.search;

      const headers = new Headers(request.headers);
      headers.set("CF-Access-Client-Id", env.CF_ACCESS_CLIENT_ID);
      headers.set("CF-Access-Client-Secret", env.CF_ACCESS_CLIENT_SECRET);

      return fetch(upstream.toString(), {
        method: request.method,
        headers,
        body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
        redirect: "follow",
      });
    }

    // Let Pages serve static assets for everything else
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<{
  BACKEND_ORIGIN: string;
  CF_ACCESS_CLIENT_ID: string;
  CF_ACCESS_CLIENT_SECRET: string;
}>;
