import { Link } from "react-router-dom";
import { Instagram, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { communicators } from "@/data/communicators";
import { radios } from "@/data/radios";

export function CommunicatorsPreview() {
  // Show first 4 communicators
  const featuredCommunicators = communicators.slice(0, 4);

  return (
    <section className="py-12 md:py-16">
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredCommunicators.map((communicator, index) => {
            const radio = radios.find((r) => r.id === communicator.radioId);

            return (
              <article
                key={communicator.id}
                className="group text-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Photo */}
                <div className="relative w-24 h-24 md:w-28 md:h-28 mx-auto mb-4">
                  <div
                    className="absolute inset-0 rounded-full opacity-20 blur-xl transition-opacity group-hover:opacity-40"
                    style={{ backgroundColor: radio?.color || "hsl(220, 70%, 45%)" }}
                  />
                  <img
                    src={communicator.photo}
                    alt={communicator.name}
                    className="relative w-full h-full object-cover rounded-full border-4 border-card shadow-card group-hover:shadow-hover transition-all duration-300"
                  />
                </div>

                {/* Info */}
                <h3 className="font-display text-base md:text-lg font-bold text-foreground line-clamp-1">
                  {communicator.name}
                </h3>
                <p className="text-muted-foreground text-xs md:text-sm mt-0.5">
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
                  style={{ color: radio?.color }}
                >
                  {communicator.radio}
                </p>

                {/* Instagram - shows on hover */}
                <a
                  href={`https://instagram.com/${communicator.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  @{communicator.instagram}
                </a>
              </article>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center md:hidden">
          <Link to="/comunicadores">
            <Button variant="outline" className="gap-2 rounded-full">
              Ver todos os comunicadores
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
