// Cloudflare Worker — OAuth proxy para Sveltia CMS
// Deploy em: workers.cloudflare.com
// Variáveis de ambiente necessárias (em Settings > Variables):
//   GITHUB_CLIENT_ID     = Ov23liSMVmUoNoprOtcJ
//   GITHUB_CLIENT_SECRET = <seu novo secret regenerado>

const ALLOWED_ORIGINS = ["https://gibeonita.com.br"];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";

    const corsHeaders = {
      "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Passo 1: redireciona o browser para o GitHub OAuth
    if (url.pathname === "/auth") {
      const params = new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        redirect_uri: `${url.origin}/callback`,
        scope: "repo,user",
        state: crypto.randomUUID(),
      });
      return Response.redirect(`https://github.com/login/oauth/authorize?${params}`);
    }

    // Passo 2: GitHub redireciona de volta com o code — trocamos pelo token
    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      if (!code) return new Response("Missing code", { status: 400 });

      const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: `${url.origin}/callback`,
        }),
      });

      const { access_token, error } = await tokenRes.json();
      if (error || !access_token) return new Response(`OAuth error: ${error}`, { status: 400 });

      // Devolve o token para o CMS via postMessage
      const html = `<!doctype html><html><body><script>
        window.opener.postMessage(
          'authorization:github:success:{"token":"${access_token}","provider":"github"}',
          'https://gibeonita.com.br'
        );
        window.close();
      <\/script></body></html>`;

      return new Response(html, { headers: { "Content-Type": "text/html" } });
    }

    return new Response("Not found", { status: 404 });
  },
};
