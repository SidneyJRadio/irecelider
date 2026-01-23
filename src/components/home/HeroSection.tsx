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

  if (isLoading) {
    return (
      <section className="py-6 md:py-8">
        <div className="container">
          <Skeleton className="h-10 w-full mb-6 rounded-lg" />
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="aspect-[16/7] rounded-xl" />
            ))}
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

        {/* Featured News - Single Column with Large Images */}
        <div className="flex flex-col gap-4">
          {featuredNews?.map((news, index) => (
            <article 
              key={news.id} 
              className="group relative overflow-hidden rounded-xl shadow-card hover:shadow-hover transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Link to={`/noticias/${news.slug}`}>
                <div className="aspect-[16/7] md:aspect-[16/6]">
                  <img
                    src={news.image_url || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80"}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="px-2 py-1 text-xs font-bold uppercase rounded"
                      style={{
                        backgroundColor: news.regions?.color || "hsl(220, 70%, 45%)",
                        color: "white",
                      }}
                    >
                      {news.regions?.name || "Notícia"}
                    </span>
                    <span className="text-xs text-white/70">
                      {news.published_at && formatDistanceToNow(new Date(news.published_at), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                  <h2 className="font-display text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight mb-2">
                    {news.title}
                  </h2>
                  <p className="text-sm md:text-base text-white/80 line-clamp-2">
                    {news.excerpt}
                  </p>
                </div>
              </Link>
            </article>
          ))}
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