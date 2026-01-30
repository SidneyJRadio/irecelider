import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { useFeaturedNewsByRegion } from "@/hooks/useData";
import { Skeleton } from "@/components/ui/skeleton";

export function RegionalNews() {
  const { data: regionData, isLoading } = useFeaturedNewsByRegion();

  if (isLoading) {
    return (
      <section className="py-10 md:py-14 radio-wave-bg">
        <div className="container">
          <div className="mb-8">
            <Skeleton className="h-8 w-56 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!regionData || regionData.length === 0) {
    return null;
  }

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
          {regionData.map(({ region, featuredNews }) => (
            <Link
              key={region.id}
              to={`/noticias?regiao=${region.id}`}
              className="group"
            >
              <div className="card-news h-full">
                {featuredNews ? (
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={featuredNews.image_url || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80"}
                      alt={featuredNews.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span
                        className="region-badge mb-2"
                        style={{ backgroundColor: region.color || "hsl(220, 70%, 45%)", color: "white" }}
                      >
                        <MapPin className="w-3 h-3 mr-1" />
                        {region.name}
                      </span>
                      <h4 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-accent transition-colors">
                        {featuredNews.title}
                      </h4>
                    </div>
                  </div>
                ) : (
                  <div
                    className="aspect-[4/3] flex flex-col items-center justify-center p-4"
                    style={{ backgroundColor: `${region.color || "hsl(220, 70%, 45%)"}20` }}
                  >
                    <MapPin
                      className="w-8 h-8 mb-2"
                      style={{ color: region.color || "hsl(220, 70%, 45%)" }}
                    />
                    <span
                      className="font-semibold text-center"
                      style={{ color: region.color || "hsl(220, 70%, 45%)" }}
                    >
                      {region.name}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      Sem notícia em destaque
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
