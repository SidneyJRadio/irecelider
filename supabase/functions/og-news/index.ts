import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SITE_URL = "https://irecelider.lovable.app";
const SITE_NAME = "Irecê Líder";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");

    if (!slug) {
      return new Response("Missing slug parameter", { status: 400, headers: corsHeaders });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { data: news, error } = await supabase
      .from("news")
      .select("title, excerpt, image_url, slug, published_at")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (error || !news) {
      return new Response(null, {
        status: 302,
        headers: { ...corsHeaders, Location: SITE_URL },
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
  
  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:url" content="${newsUrl}">
  <meta property="og:site_name" content="${SITE_NAME}">
  ${news.published_at ? `<meta property="article:published_time" content="${news.published_at}">` : ""}
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${imageUrl}">
  
  <!-- Redirect -->
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
    console.error("Error in og-news:", err);
    return new Response("Internal Server Error", {
      status: 500,
      headers: corsHeaders,
    });
  }
});
