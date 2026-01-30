import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, Clock } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

const Noticias = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  
  const selectedRegion = searchParams.get("regiao") || "todas";

  // Fetch regions
  const { data: regions = [] } = useQuery({
    queryKey: ["regions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("regions")
        .select("id, name, color")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  // Fetch news - order by featured first, then by date
  const { data: news = [], isLoading } = useQuery({
    queryKey: ["all-news", selectedRegion],
    queryFn: async () => {
      let query = supabase
        .from("news")
        .select("*, regions(name, color)")
        .eq("status", "published")
        .order("featured", { ascending: false })
        .order("published_at", { ascending: false });

      if (selectedRegion !== "todas") {
        query = query.eq("region_id", selectedRegion);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const filteredNews = news.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const handleRegionChange = (regionId: string) => {
    if (regionId === "todas") {
      searchParams.delete("regiao");
    } else {
      searchParams.set("regiao", regionId);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="gradient-hero py-12 md:py-16">
          <div className="container">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground text-center">
              Notícias
            </h1>
            <p className="text-primary-foreground/80 text-center mt-2 max-w-xl mx-auto">
              Acompanhe as últimas notícias da região com informação de qualidade
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 border-b border-border sticky top-16 bg-background/95 backdrop-blur z-40">
          <div className="container">
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
              {/* Search */}
              <div className="relative max-w-md flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar notícias..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-full"
                />
              </div>

              {/* Region Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
                <button
                  onClick={() => handleRegionChange("todas")}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                    selectedRegion === "todas"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  Todas
                </button>
                {regions.map((region) => (
                  <button
                    key={region.id}
                    onClick={() => handleRegionChange(region.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                      selectedRegion === region.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    )}
                  >
                    {region.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* News Grid */}
        <section className="py-8 md:py-12">
          <div className="container">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
                ))}
              </div>
            ) : filteredNews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNews.map((article) => (
                  <article
                    key={article.id}
                    className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300"
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
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  Nenhuma notícia encontrada para os filtros selecionados.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    handleRegionChange("todas");
                  }}
                >
                  Limpar filtros
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Noticias;
