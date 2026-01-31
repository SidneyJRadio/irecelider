import { useEffect, useState, useCallback } from "react";
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

  const totalBanners = banners?.length || 0;
  const bannersPerPage = 1; // Show 1 banner at a time (stacked layout)
  const totalPages = totalBanners;
  const needsCarousel = totalBanners > 1;

  const nextSlide = useCallback(() => {
    if (totalPages > 1) {
      setCurrentIndex((prev) => (prev + 1) % totalPages);
    }
  }, [totalPages]);

  const prevSlide = useCallback(() => {
    if (totalPages > 1) {
      setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
    }
  }, [totalPages]);

  // Auto-advance carousel
  useEffect(() => {
    if (!needsCarousel || isPaused) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [needsCarousel, isPaused, nextSlide]);

  // Reset index when banners change
  useEffect(() => {
    setCurrentIndex(0);
  }, [banners?.length]);

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
          className="relative bg-muted rounded-xl overflow-hidden group hover:ring-2 hover:ring-primary/30 transition-all w-full"
        >
          <div className="aspect-[6/1] md:aspect-[8/1]">{content}</div>
        </a>
      );
    }

    return (
      <div key={banner.id} className="relative bg-muted rounded-xl overflow-hidden w-full">
        <div className="aspect-[6/1] md:aspect-[8/1]">{content}</div>
      </div>
    );
  };

  const renderPlaceholder = (index: number) => (
    <div
      key={`placeholder-${index}`}
      className="relative bg-gradient-to-br from-muted to-muted/50 rounded-xl border border-dashed border-border overflow-hidden group hover:border-primary/30 transition-colors w-full"
    >
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
          <div className="flex flex-col gap-4">
            {renderPlaceholder(1)}
          </div>
        </div>
      </section>
    );
  }

  // No banners available
  if (!banners || banners.length === 0) {
    return null; // Don't show anything if no active banners
  }

  // Get current banner
  const visibleBanner = banners[currentIndex];

  return (
    <section
      className={cn("py-4", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container">
        <div className="relative">
          {/* Carousel Navigation - Previous */}
          {needsCarousel && (
            <Button
              variant="outline"
              size="icon"
              className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}

          {/* Banner - Full Width Stacked */}
          <div className="flex flex-col gap-4">
            {visibleBanner && renderBanner(visibleBanner)}
          </div>

          {/* Carousel Navigation - Next */}
          {needsCarousel && (
            <Button
              variant="outline"
              size="icon"
              className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={nextSlide}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Dots indicator */}
        {needsCarousel && totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-3">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === currentIndex
                    ? "bg-primary w-4"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
