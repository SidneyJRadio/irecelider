import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFeaturedNews } from "@/hooks/useData";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

export function HeroSection() {
  const { data: featuredNews, isLoading } = useFeaturedNews();

  const mainNews = featuredNews?.[0];
  const secondaryNews = featuredNews?.[1];

  if (isLoading) {
    return (
      <section className="py-6 md:py-8">
        <div className="container">
          <Skeleton className="h-10 w-full mb-6 rounded-lg" />
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            <Skeleton className="md:col-span-2 aspect-[16/10] rounded-xl" />
            <Skeleton className="aspect-[16/10] rounded-xl" />
          </div>
        </div>
      </section>
    );
  }

  if (!mainNews) {
    return null;
  }

  return (
    <section className="py-6 md:py-8">
      <div className="container">
        {/* Breaking News Banner */}
        <div className="mb-6 flex items-center gap-3 p-3 bg-accent/10 rounded-lg border border-accent/20 animate-fade-in">
          <span className="px-2 py-1 bg-accent text-accent-foreground text-xs font-bold uppercase rounded animate-pulse">
            Urgente
          </span>
          <p className="text-sm font-medium text-foreground line-clamp-1">
            {mainNews.title}
          </p>
        </div>

        {/* Featured News Grid */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {/* Main Featured */}
          <article className="md:col-span-2 group relative overflow-hidden rounded-xl shadow-card hover:shadow-hover transition-all duration-300">
            <Link to={`/noticias/${mainNews.slug}`}>
              <div className="aspect-[16/10] md:aspect-[16/9]">
                <img
                  src={mainNews.image_url || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80"}
                  alt={mainNews.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="px-2 py-1 text-xs font-bold uppercase rounded"
                    style={{
                      backgroundColor: mainNews.regions?.color || "hsl(220, 70%, 45%)",
                      color: "white",
                    }}
                  >
                    {mainNews.regions?.name || "Notícia"}
                  </span>
                  <span className="text-xs text-white/70">
                    {mainNews.published_at && formatDistanceToNow(new Date(mainNews.published_at), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </span>
                </div>
                <h2 className="font-display text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight mb-2">
                  {mainNews.title}
                </h2>
                <p className="text-sm md:text-base text-white/80 line-clamp-2 mb-3">
                  {mainNews.excerpt}
                </p>
                <p className="text-xs text-white/60">
                  Por Redação
                </p>
              </div>
            </Link>
          </article>

          {/* Secondary Featured */}
          {secondaryNews && (
            <article className="group relative overflow-hidden rounded-xl shadow-card hover:shadow-hover transition-all duration-300">
              <Link to={`/noticias/${secondaryNews.slug}`}>
                <div className="aspect-[16/10] md:aspect-auto md:h-full">
                  <img
                    src={secondaryNews.image_url || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80"}
                    alt={secondaryNews.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span
                    className="inline-block px-2 py-1 text-xs font-bold uppercase rounded mb-2"
                    style={{
                      backgroundColor: secondaryNews.regions?.color || "hsl(220, 70%, 45%)",
                      color: "white",
                    }}
                  >
                    {secondaryNews.regions?.name || "Notícia"}
                  </span>
                  <h3 className="font-display text-lg font-bold text-white leading-tight">
                    {secondaryNews.title}
                  </h3>
                </div>
              </Link>
            </article>
          )}
        </div>

        {/* CTA Button */}
        <div className="mt-6 flex justify-center">
          <Link to="/noticias">
            <Button variant="outline" className="gap-2 rounded-full">
              Ver todas as notícias
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
