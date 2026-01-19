import { Link } from "react-router-dom";
import { Headphones, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { radios } from "@/data/radios";

export function RadioPartners() {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-background to-secondary/30">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Nossas Rádios
          </h2>
          <p className="text-muted-foreground mt-2">
            Conheça as emissoras do nosso grupo
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {radios.map((radio, index) => (
            <div
              key={radio.id}
              className="group flex flex-col items-center text-center"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Logo Container */}
              <div className="relative mb-4">
                <div 
                  className="absolute inset-0 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity"
                  style={{ backgroundColor: radio.color }}
                />
                <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-card shadow-card p-4 flex items-center justify-center group-hover:shadow-hover transition-all duration-300 group-hover:-translate-y-1">
                  <img
                    src={radio.logo}
                    alt={`Logo ${radio.name}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Radio Info */}
              <h3 className="font-display text-lg font-bold text-foreground mb-1">
                {radio.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-1">
                {radio.frequency}
              </p>
              <p className="text-xs text-muted-foreground/70 italic">
                {radio.tagline}
              </p>

              {/* Listen Button */}
              <button
                className="mt-3 flex items-center gap-1.5 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: radio.color }}
              >
                <Headphones className="w-4 h-4" />
                <span>Ouvir</span>
              </button>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link to="/contato">
            <Button variant="outline" className="gap-2 rounded-full">
              Fale com nossas rádios
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
