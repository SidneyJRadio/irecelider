import { Link } from "react-router-dom";
import { Headphones, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRadios } from "@/hooks/useData";
import { Skeleton } from "@/components/ui/skeleton";

export function RadioPartners() {
  const { data: radios, isLoading } = useRadios();

  // Duplicate radios for seamless infinite loop
  const duplicatedRadios = radios ? [...radios, ...radios] : [];

  if (isLoading) {
    return (
      <section className="py-12 md:py-16 bg-gradient-to-b from-background to-secondary/30">
        <div className="container">
          <div className="text-center mb-10">
            <Skeleton className="h-8 w-48 mx-auto mb-2" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-64 h-48 rounded-2xl flex-shrink-0" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!radios || radios.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-background to-secondary/30 overflow-hidden">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Nossas Rádios
          </h2>
          <p className="text-muted-foreground mt-2">
            Conheça as emissoras do nosso grupo
          </p>
        </div>
      </div>

      {/* Infinite Marquee Container */}
      <div className="relative w-full">
        {/* Gradient overlays for smooth fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* Marquee track */}
        <div className="flex animate-marquee hover:[animation-play-state:paused]">
          {duplicatedRadios.map((radio, index) => (
            <div
              key={`${radio.id}-${index}`}
              className="flex-shrink-0 w-52 md:w-64 mx-4 md:mx-6 group"
            >
              <div className="bg-card rounded-2xl p-5 shadow-card hover:shadow-hover transition-all duration-300 border border-border/50 text-center">
                {/* Logo Container */}
                <div className="relative mb-4 flex justify-center">
                  <div 
                    className="absolute inset-0 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"
                    style={{ backgroundColor: radio.color || "hsl(220, 70%, 45%)" }}
                  />
                  <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-xl bg-white/50 p-3 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    {radio.logo_url ? (
                      <img
                        src={radio.logo_url}
                        alt={`Logo ${radio.name}`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div 
                        className="w-full h-full rounded-lg flex items-center justify-center text-white font-bold text-2xl"
                        style={{ backgroundColor: radio.color || "hsl(220, 70%, 45%)" }}
                      >
                        {radio.name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Radio Info */}
                <h3 className="font-display text-base md:text-lg font-bold text-foreground mb-1 line-clamp-1">
                  {radio.name}
                </h3>
                <p 
                  className="text-sm font-semibold mb-1"
                  style={{ color: radio.color || "hsl(220, 70%, 45%)" }}
                >
                  {radio.frequency}
                </p>
                <p className="text-xs text-muted-foreground italic line-clamp-1">
                  {radio.tagline}
                </p>

                {/* Listen Button */}
                <button
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full transition-colors"
                  style={{ 
                    color: radio.color || "hsl(220, 70%, 45%)",
                    backgroundColor: `${radio.color || "hsl(220, 70%, 45%)"}15`
                  }}
                >
                  <Headphones className="w-4 h-4" />
                  <span>Ouvir</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container mt-10 flex justify-center">
        <Link to="/contato">
          <Button variant="outline" className="gap-2 rounded-full">
            Fale com nossas rádios
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
