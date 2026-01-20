import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePublishedNews } from "@/hooks/useData";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

export function LatestNews() {
  const { data: news, isLoading } = usePublishedNews(6);

  if (isLoading) {
    return (
      <section className="py-10 md:py-14">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-32 hidden md:block" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!news || news.length === 0) {
    return null;
  }

  return (
    <section className="py-10 md:py-14">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Últimas Notícias
          </h2>
          <Link to="/noticias" className="hidden md:block">
            <Button variant="outline" className="gap-2 rounded-full">
              Ver todas
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article, index) => (
            <article
              key={article.id}
              className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Link to={`/noticias/${article.slug}`}>
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={article.image_url || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80"}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="px-2 py-0.5 text-xs font-semibold rounded"
                      style={{
                        backgroundColor: `${article.regions?.color || "hsl(220, 70%, 45%)"}20`,
                        color: article.regions?.color || "hsl(220, 70%, 45%)",
                      }}
                    >
                      {article.regions?.name || "Notícia"}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {article.published_at && formatDistanceToNow(new Date(article.published_at), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-8 flex justify-center md:hidden">
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
