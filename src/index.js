export default {
  async fetch(request, env) {
    let response = await env.ASSETS.fetch(request);

    // SPA fallback — serve index.html for client-side routes
    if (response.status === 404) {
      const url = new URL(request.url);
      url.pathname = '/index.html';
      response = await env.ASSETS.fetch(new Request(url, request));
    }

    const headers = new Headers(response.headers);

    headers.set("X-Frame-Options", "DENY");
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("X-XSS-Protection", "1; mode=block");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), hid=(), screen-wake-lock=(), display-capture=(), interest-cohort=()");
    headers.set("Cross-Origin-Opener-Policy", "same-origin");
    headers.set("Cross-Origin-Resource-Policy", "same-site");
    headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
    headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self'; worker-src 'self' blob:; media-src 'none'; object-src 'none'; frame-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'none'; upgrade-insecure-requests;"
    );

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  },
};
