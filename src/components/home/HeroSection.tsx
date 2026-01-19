import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getBreakingNews, getFeaturedNews } from "@/data/news";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function HeroSection() {
  const breakingNews = getBreakingNews();
  const featuredNews = getFeaturedNews();
  const mainNews = breakingNews[0] || featuredNews[0];
  const secondaryNews = featuredNews.filter((n) => n.id !== mainNews?.id).slice(0, 2);

  if (!mainNews) return null;

  return (
    <section className="py-6 md:py-8">
      <div className="container">
        {/* Breaking News Banner */}
        {breakingNews.length > 0 && (
          <div className="mb-6 flex items-center gap-3 overflow-hidden">
            <span className="breaking-news px-3 py-1 rounded text-xs font-bold uppercase tracking-wider shrink-0">
              Urgente
            </span>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">
                {breakingNews[0].title}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Featured News */}
          <Link
            to={`/noticias/${mainNews.id}`}
            className="lg:col-span-2 group"
          >
            <article className="relative rounded-2xl overflow-hidden aspect-[16/9] lg:aspect-[16/10]">
              <img
                src={mainNews.image}
                alt={mainNews.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="region-badge bg-accent text-accent-foreground">
                    {mainNews.region}
                  </span>
                  <span className="text-xs text-white/70">
                    {formatDistanceToNow(new Date(mainNews.createdAt), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </span>
                </div>
                
                <h2 className="news-title text-2xl md:text-3xl lg:text-4xl text-white mb-3 group-hover:text-accent transition-colors">
                  {mainNews.title}
                </h2>
                
                <p className="text-white/80 text-sm md:text-base line-clamp-2 max-w-2xl">
                  {mainNews.excerpt}
                </p>

                <div className="flex items-center gap-2 mt-4 text-white/70 text-sm">
                  <span>Por {mainNews.author}</span>
                </div>
              </div>
            </article>
          </Link>

          {/* Secondary Featured News */}
          <div className="flex flex-col gap-4">
            {secondaryNews.map((news) => (
              <Link
                key={news.id}
                to={`/noticias/${news.id}`}
                className="group flex-1"
              >
                <article className="relative rounded-xl overflow-hidden h-full min-h-[180px]">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="region-badge bg-accent/90 text-accent-foreground text-[10px] mb-2">
                      {news.region}
                    </span>
                    <h3 className="news-title text-lg text-white line-clamp-2 group-hover:text-accent transition-colors">
                      {news.title}
                    </h3>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>

        {/* View All News Button */}
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
