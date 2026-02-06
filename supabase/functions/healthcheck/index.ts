import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "https://aliderdachapada.com.br";
const SITE_NAME = "Irecê Líder";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");

    if (!slug) {
      return new Response(JSON.stringify({ error: "Missing slug" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

    const apiUrl = `${supabaseUrl}/rest/v1/news?select=title,excerpt,image_url,slug,published_at&slug=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`;

    const response = await fetch(apiUrl, {
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
      },
    });

    const data = await response.json();
    const news = data?.[0];

    if (!news) {
      return new Response(null, {
        status: 302,
        headers: { ...corsHeaders, "Location": SITE_URL },
      });
    }

    const newsUrl = `${SITE_URL}/noticias/${news.slug}`;
    const title = escapeHtml(news.title);
    const description = escapeHtml(news.excerpt || news.title);
    const imageUrl = news.image_url || `${SITE_URL}/favicon.ico`;

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - ${SITE_NAME}</title>
  <meta property="og:type" content="article">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:url" content="${newsUrl}">
  <meta property="og:site_name" content="${SITE_NAME}">
  ${news.published_at ? `<meta property="article:published_time" content="${news.published_at}">` : ""}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${imageUrl}">
  <meta http-equiv="refresh" content="0;url=${newsUrl}">
  <link rel="canonical" href="${newsUrl}">
</head>
<body>
  <p>Redirecionando para <a href="${newsUrl}">${title}</a>...</p>
  <script>window.location.replace("${newsUrl}");</script>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response("Internal Server Error", {
      status: 500,
      headers: corsHeaders,
    });
  }
});
