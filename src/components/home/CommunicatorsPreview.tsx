import { Link } from "react-router-dom";
import { Instagram, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCommunicators } from "@/hooks/useData";
import { Skeleton } from "@/components/ui/skeleton";

export function CommunicatorsPreview() {
  const { data: communicators, isLoading } = useCommunicators();

  // Duplicate communicators for seamless infinite loop
  const duplicatedCommunicators = communicators ? [...communicators, ...communicators] : [];

  if (isLoading) {
    return (
      <section className="py-12 md:py-16 overflow-hidden">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <Skeleton className="h-8 w-56 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-56 h-64 rounded-2xl flex-shrink-0" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!communicators || communicators.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 overflow-hidden">
      <div className="container">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Nossos Comunicadores
            </h2>
            <p className="text-muted-foreground mt-1">
              Conheça quem leva informação até você
            </p>
          </div>
          <Link to="/comunicadores" className="hidden md:block">
            <Button variant="outline" className="gap-2 rounded-full">
              Ver todos
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Infinite Marquee Container */}
      <div className="relative w-full">
        {/* Gradient overlays for smooth fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* Marquee track */}
        <div className="flex animate-marquee hover:[animation-play-state:paused]">
          {duplicatedCommunicators.map((communicator, index) => (
            <article
              key={`${communicator.id}-${index}`}
              className="flex-shrink-0 w-48 md:w-56 mx-3 md:mx-4 group"
            >
              <div className="bg-card rounded-2xl p-4 shadow-card hover:shadow-hover transition-all duration-300 border border-border/50">
                {/* Photo */}
                <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-3">
                  <div
                    className="absolute inset-0 rounded-full opacity-20 blur-xl transition-opacity group-hover:opacity-40"
                    style={{ backgroundColor: communicator.radios?.color || "hsl(220, 70%, 45%)" }}
                  />
                  {communicator.photo_url ? (
                    <img
                      src={communicator.photo_url}
                      alt={communicator.name}
                      className="relative w-full h-full object-cover rounded-full border-3 border-card shadow-md group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div 
                      className="relative w-full h-full rounded-full flex items-center justify-center text-white font-bold text-xl"
                      style={{ backgroundColor: communicator.radios?.color || "hsl(220, 70%, 45%)" }}
                    >
                      {communicator.name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="text-center">
                  <h3 className="font-display text-sm md:text-base font-bold text-foreground line-clamp-1">
                    {communicator.name}
                  </h3>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    {communicator.role}
                  </p>

                  {/* Program */}
                  {communicator.program && (
                    <p className="text-xs font-medium text-primary mt-1 line-clamp-1">
                      "{communicator.program}"
                    </p>
                  )}

                  {/* Radio Info */}
                  <p
                    className="text-xs mt-2 font-medium"
                    style={{ color: communicator.radios?.color || "hsl(220, 70%, 45%)" }}
                  >
                    {communicator.radios?.name}
                  </p>

                  {/* Instagram */}
                  {communicator.instagram && (
                    <a
                      href={`https://instagram.com/${communicator.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Instagram className="w-3 h-3" />
                      @{communicator.instagram}
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="container mt-8 flex justify-center md:hidden">
        <Link to="/comunicadores">
          <Button variant="outline" className="gap-2 rounded-full">
            Ver todos os comunicadores
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
