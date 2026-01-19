import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { NewsArticle } from "@/data/news";

interface NewsCardProps {
  news: NewsArticle;
  variant?: "default" | "compact" | "featured";
}

export function NewsCard({ news, variant = "default" }: NewsCardProps) {
  if (variant === "compact") {
    return (
      <Link to={`/noticias/${news.id}`} className="group">
        <article className="flex gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
          <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold text-accent uppercase">
              {news.region}
            </span>
            <h4 className="font-semibold text-sm line-clamp-2 mt-1 group-hover:text-primary transition-colors">
              {news.title}
            </h4>
            <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(news.createdAt), {
                addSuffix: true,
                locale: ptBR,
              })}
            </span>
          </div>
        </article>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link to={`/noticias/${news.id}`} className="group">
        <article className="relative rounded-xl overflow-hidden aspect-[16/10]">
          <img
            src={news.image}
            alt={news.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <span className="region-badge bg-accent text-accent-foreground mb-2">
              {news.region}
            </span>
            <h3 className="news-title text-xl text-white line-clamp-2 group-hover:text-accent transition-colors">
              {news.title}
            </h3>
            <p className="text-white/70 text-sm line-clamp-2 mt-2">
              {news.excerpt}
            </p>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link to={`/noticias/${news.id}`} className="group">
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
            <span className="text-xs text-muted-foreground">{news.author}</span>
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
  );
}
