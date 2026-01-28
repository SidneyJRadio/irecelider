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
  const bannersPerPage = 2;
  const totalPages = Math.ceil(totalBanners / bannersPerPage);
  const needsCarousel = totalBanners > bannersPerPage;

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
          className="relative bg-muted rounded-xl overflow-hidden group hover:ring-2 hover:ring-primary/30 transition-all"
        >
          <div className="aspect-[4/1] md:aspect-[5/1]">{content}</div>
        </a>
      );
    }

    return (
      <div key={banner.id} className="relative bg-muted rounded-xl overflow-hidden">
        <div className="aspect-[4/1] md:aspect-[5/1]">{content}</div>
      </div>
    );
  };

  const renderPlaceholder = (index: number) => (
    <div
      key={`placeholder-${index}`}
      className="relative bg-gradient-to-br from-muted to-muted/50 rounded-xl border border-dashed border-border overflow-hidden group hover:border-primary/30 transition-colors"
    >
      <div className="aspect-[4/1] md:aspect-[5/1] flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Publicidade</p>
          <p className="text-sm font-medium text-muted-foreground/70">728 x 90</p>
        </div>
      </div>
    </div>
  );

  // Show loading state
  if (isLoading) {
    return (
      <section className={cn("py-4", className)}>
        <div className="container">
          <div className="grid md:grid-cols-2 gap-4">
            {renderPlaceholder(1)}
            {renderPlaceholder(2)}
          </div>
        </div>
      </section>
    );
  }

  // No banners available
  if (!banners || banners.length === 0) {
    return null; // Don't show anything if no active banners
  }

  // Get banners for current page
  const startIndex = currentIndex * bannersPerPage;
  const visibleBanners = banners.slice(startIndex, startIndex + bannersPerPage);

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

          {/* Banners Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {visibleBanners.map(renderBanner)}
            {/* Fill empty slots with placeholders if less than 2 banners on current page */}
            {visibleBanners.length === 1 && renderPlaceholder(1)}
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
