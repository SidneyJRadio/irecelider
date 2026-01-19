import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewsCard } from "@/components/news/NewsCard";
import { mockNews } from "@/data/news";
import { regions } from "@/data/radios";

export function RegionalNews() {
  return (
    <section className="py-10 md:py-14 radio-wave-bg">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Notícias por Região
            </h2>
            <p className="text-muted-foreground mt-1">
              Acompanhe as notícias da sua região
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {regions.map((region) => {
            const regionNews = mockNews.find(
              (n) => n.region.toLowerCase() === region.name.toLowerCase()
            );

            return (
              <Link
                key={region.id}
                to={`/noticias?regiao=${region.id}`}
                className="group"
              >
                <div className="card-news h-full">
                  {regionNews ? (
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={regionNews.image}
                        alt={regionNews.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <span
                          className="region-badge mb-2"
                          style={{ backgroundColor: region.color, color: "white" }}
                        >
                          <MapPin className="w-3 h-3 mr-1" />
                          {region.name}
                        </span>
                        <h4 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-accent transition-colors">
                          {regionNews.title}
                        </h4>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="aspect-[4/3] flex flex-col items-center justify-center p-4"
                      style={{ backgroundColor: `${region.color}20` }}
                    >
                      <MapPin
                        className="w-8 h-8 mb-2"
                        style={{ color: region.color }}
                      />
                      <span
                        className="font-semibold"
                        style={{ color: region.color }}
                      >
                        {region.name}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
