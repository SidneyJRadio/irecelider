import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdBannerProps {
  className?: string;
  position?: "above_news" | "above_communicators";
}

interface Banner {
  id: string;
  title: string;
  image_url: string;
  link_url: string | null;
  position: string;
  display_order: number;
}

export function AdBanner({ className, position = "above_news" }: AdBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const { data: banners, isLoading } = useQuery({
    queryKey: ["banners", position],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .eq("position", position)
        .eq("active", true)
        .order("display_order");

      if (error) throw error;
      return data as Banner[];
    },
  });

  // Calculate total pages (2 banners per page)
  const totalPages = banners ? Math.ceil(banners.length / 2) : 0;
  const needsCarousel = banners && banners.length > 2;

  const nextSlide = useCallback(() => {
    if (!needsCarousel) return;
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  }, [totalPages, needsCarousel]);

  const prevSlide = useCallback(() => {
    if (!needsCarousel) return;
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages, needsCarousel]);

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (!needsCarousel || isPaused) return;

    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [needsCarousel, isPaused, nextSlide]);

  const renderBanner = (banner: Banner) => {
    const content = (
      <img
        src={banner.image_url}
        alt={banner.title}
        className="w-full h-full object-cover"
      />
    );

    if (banner.link_url) {
      return (
        <a
          key={banner.id}
          href={banner.link_url.startsWith("http") ? banner.link_url : `https://${banner.link_url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="relative bg-muted rounded-xl overflow-hidden group hover:ring-2 hover:ring-primary/30 transition-all flex-1 block"
        >
          <div className="aspect-[6/1] md:aspect-[8/1]">{content}</div>
        </a>
      );
    }

    return (
      <div key={banner.id} className="relative bg-muted rounded-xl overflow-hidden flex-1">
        <div className="aspect-[6/1] md:aspect-[8/1]">{content}</div>
      </div>
    );
  };

  const renderPlaceholder = () => (
    <div className="relative bg-gradient-to-br from-muted to-muted/50 rounded-xl border border-dashed border-border overflow-hidden flex-1">
      <div className="aspect-[6/1] md:aspect-[8/1] flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Publicidade</p>
          <p className="text-sm font-medium text-muted-foreground/70">Espaço para anúncio</p>
        </div>
      </div>
    </div>
  );

  // Show loading state
  if (isLoading) {
    return (
      <section className={cn("py-4", className)}>
        <div className="container">
          <div className="flex gap-4">
            {renderPlaceholder()}
            {renderPlaceholder()}
          </div>
        </div>
      </section>
    );
  }

  // No banners available
  if (!banners || banners.length === 0) {
    return null;
  }

  // Get current page banners (2 per page)
  const getCurrentBanners = () => {
    const startIndex = currentIndex * 2;
    return banners.slice(startIndex, startIndex + 2);
  };

  const currentBanners = getCurrentBanners();

  return (
    <section 
      className={cn("py-4", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container">
        <div className="relative">
          {/* Banners Grid - 2 side by side */}
          <div className="flex gap-4">
            {currentBanners.map(renderBanner)}
            {/* If only 1 banner on current page, show placeholder */}
            {currentBanners.length === 1 && renderPlaceholder()}
          </div>

          {/* Navigation arrows - only show if carousel is needed */}
          {needsCarousel && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-md opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity z-10"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-md opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity z-10"
                onClick={nextSlide}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Indicators - only show if carousel is needed */}
          {needsCarousel && (
            <div className="flex justify-center gap-2 mt-3">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    index === currentIndex
                      ? "bg-primary w-4"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                  aria-label={`Ir para página ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
