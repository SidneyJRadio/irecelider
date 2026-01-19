import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLatestNews } from "@/data/news";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function LatestNews() {
  const latestNews = getLatestNews(6);

  return (
    <section className="py-10 md:py-14">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Últimas Notícias
            </h2>
            <p className="text-muted-foreground mt-1">
              Fique por dentro das novidades
            </p>
          </div>
          <Link to="/noticias" className="hidden md:block">
            <Button variant="outline" className="gap-2 rounded-full">
              Ver todas
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestNews.map((news, index) => (
            <Link
              key={news.id}
              to={`/noticias/${news.id}`}
              className="group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <article className="card-news h-full flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="region-badge bg-primary text-primary-foreground">
                      {news.region}
                    </span>
                  </div>
                </div>

                <div className="flex-1 p-4 flex flex-col">
                  <h3 className="news-title text-lg text-card-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 flex-1">
                    {news.excerpt}
                  </p>
                  <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      {news.author}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(news.createdAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
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
