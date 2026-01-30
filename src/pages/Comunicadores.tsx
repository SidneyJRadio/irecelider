import { Instagram, Radio, MessageCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useCommunicators } from "@/hooks/useData";
import { Skeleton } from "@/components/ui/skeleton";

const Comunicadores = () => {
  const { data: communicators, isLoading } = useCommunicators();

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
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="text-center p-6">
                    <Skeleton className="w-32 h-32 rounded-full mx-auto mb-4" />
                    <Skeleton className="h-6 w-32 mx-auto mb-2" />
                    <Skeleton className="h-4 w-24 mx-auto" />
                  </div>
                ))}
              </div>
            ) : communicators && communicators.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {communicators.map((communicator, index) => (
                  <article
                    key={communicator.id}
                    className="card-news group text-center p-6"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Photo */}
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <div 
                        className="absolute inset-0 rounded-full opacity-20 blur-xl transition-opacity group-hover:opacity-40"
                        style={{ backgroundColor: communicator.radios?.color || "hsl(220, 70%, 45%)" }}
                      />
                      {communicator.photo_url ? (
                        <img
                          src={communicator.photo_url}
                          alt={communicator.name}
                          className="relative w-full h-full object-cover rounded-full border-4 border-background shadow-lg"
                        />
                      ) : (
                        <div 
                          className="relative w-full h-full rounded-full border-4 border-background shadow-lg flex items-center justify-center text-white font-bold text-2xl"
                          style={{ backgroundColor: communicator.radios?.color || "hsl(220, 70%, 45%)" }}
                        >
                          {communicator.name.charAt(0)}
                        </div>
                      )}
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
                    {communicator.radios && (
                      <div className="flex items-center justify-center gap-1.5 mt-3">
                        <Radio
                          className="w-4 h-4"
                          style={{ color: communicator.radios.color || undefined }}
                        />
                        <span
                          className="text-sm font-medium"
                          style={{ color: communicator.radios.color || undefined }}
                        >
                          {communicator.radios.name}
                        </span>
                      </div>
                    )}

                    {/* Social Links */}
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                      {communicator.instagram && (
                        <a
                          href={`https://instagram.com/${communicator.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                          <Instagram className="w-4 h-4" />
                          @{communicator.instagram}
                        </a>
                      )}
                      {communicator.whatsapp && (
                        <a
                          href={`https://wa.me/${communicator.whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366] text-white text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                          <MessageCircle className="w-4 h-4" />
                          WhatsApp
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Nenhum comunicador cadastrado
              </div>
            )}
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
