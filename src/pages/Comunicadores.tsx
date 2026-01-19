import { Instagram, Radio } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { communicators } from "@/data/communicators";
import { radios } from "@/data/radios";

const Comunicadores = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="gradient-hero py-12 md:py-16">
          <div className="container">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground text-center">
              Nossos Comunicadores
            </h1>
            <p className="text-primary-foreground/80 text-center mt-2 max-w-xl mx-auto">
              Conheça os profissionais que levam informação e entretenimento até você
            </p>
          </div>
        </section>

        {/* Communicators Grid */}
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {communicators.map((communicator, index) => {
                const radio = radios.find((r) => r.id === communicator.radioId);
                
                return (
                  <article
                    key={communicator.id}
                    className="card-news group text-center p-6"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Photo */}
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <div 
                        className="absolute inset-0 rounded-full opacity-20 blur-xl transition-opacity group-hover:opacity-40"
                        style={{ backgroundColor: radio?.color || "hsl(220, 70%, 45%)" }}
                      />
                      <img
                        src={communicator.photo}
                        alt={communicator.name}
                        className="relative w-full h-full object-cover rounded-full border-4 border-background shadow-lg"
                      />
                    </div>

                    {/* Info */}
                    <h3 className="font-display text-xl font-bold text-card-foreground">
                      {communicator.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      {communicator.role}
                    </p>

                    {/* Program */}
                    {communicator.program && (
                      <p className="text-sm font-medium text-primary mt-2">
                        "{communicator.program}"
                      </p>
                    )}

                    {/* Radio Badge */}
                    <div className="flex items-center justify-center gap-1.5 mt-3">
                      <Radio
                        className="w-4 h-4"
                        style={{ color: radio?.color }}
                      />
                      <span
                        className="text-sm font-medium"
                        style={{ color: radio?.color }}
                      >
                        {communicator.radio}
                      </span>
                    </div>

                    {/* Instagram */}
                    <a
                      href={`https://instagram.com/${communicator.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      <Instagram className="w-4 h-4" />
                      @{communicator.instagram}
                    </a>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-secondary/30">
          <div className="container text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              Quer fazer parte da nossa equipe?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-6">
              Estamos sempre em busca de novos talentos para integrar nossa equipe de comunicação.
            </p>
            <a
              href="/contato"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            >
              Entre em contato
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Comunicadores;
