import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, Clock, User, Eye } from "lucide-react";

export default function NoticiaDetalhe() {
  const { slug } = useParams();

  const { data: news, isLoading, error } = useQuery({
    queryKey: ["news-detail", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*, regions(name, color)")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  // Increment views
  useQuery({
    queryKey: ["news-view", slug],
    queryFn: async () => {
      if (news?.id) {
        await supabase
          .from("news")
          .update({ views: (news.views || 0) + 1 })
          .eq("id", news.id);
      }
      return true;
    },
    enabled: !!news?.id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container py-8 max-w-4xl">
            <Skeleton className="h-8 w-32 mb-8" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-6 w-64 mb-8" />
            <Skeleton className="aspect-video w-full mb-8 rounded-xl" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Notícia não encontrada</h1>
            <p className="text-muted-foreground mb-6">
              A notícia que você procura não existe ou foi removida.
            </p>
            <Link to="/noticias">
              <Button className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Voltar para Notícias
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <article className="container py-8 max-w-4xl">
          {/* Back Link */}
          <Link
            to="/noticias"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Notícias
          </Link>

          {/* Category */}
          {news.regions && (
            <span
              className="inline-block px-3 py-1 text-sm font-semibold rounded-full mb-4"
              style={{
                backgroundColor: `${news.regions.color || "hsl(220, 70%, 45%)"}20`,
                color: news.regions.color || "hsl(220, 70%, 45%)",
              }}
            >
              {news.regions.name}
            </span>
          )}

          {/* Title */}
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4">
            {news.title}
          </h1>

          {/* Excerpt */}
          {news.excerpt && (
            <p className="text-xl text-muted-foreground mb-6">{news.excerpt}</p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
            {news.published_at && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {format(new Date(news.published_at), "d 'de' MMMM 'de' yyyy 'às' HH:mm", {
                  locale: ptBR,
                })}
              </span>
            )}
            {news.views !== null && (
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                {news.views} visualizações
              </span>
            )}
          </div>

          {/* Featured Image */}
          {news.image_url && (
            <div className="aspect-video w-full overflow-hidden rounded-xl mb-8">
              <img
                src={news.image_url}
                alt={news.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {news.content?.split("\n").map((paragraph, index) => (
              <p key={index} className="text-foreground leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
