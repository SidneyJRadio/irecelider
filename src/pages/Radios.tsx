import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useRadios } from "@/hooks/useData";
import { Skeleton } from "@/components/ui/skeleton";
import { Radio, MessageCircle, Phone, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Radios() {
  const { data: radios, isLoading } = useRadios();

  const formatWhatsApp = (number: string | null) => {
    if (!number) return null;
    // Remove all non-digit characters and ensure proper format
    const cleaned = number.replace(/\D/g, '').trim();
    if (cleaned.length < 10) return null;
    return `https://wa.me/${cleaned}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-12 md:py-16">
          <div className="container text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Radio className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Grupo J.Sidney de Comunicação</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Nossas Rádios
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Conheça todas as emissoras do Grupo J.Sidney. Estamos presentes em diversas cidades, 
              levando informação e entretenimento para toda a região.
            </p>
          </div>
        </section>

        {/* Radios Grid */}
        <section className="py-12 md:py-16">
          <div className="container">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-72 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {radios?.map((radio) => (
                  <div
                    key={radio.id}
                    className="bg-card rounded-xl shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden group"
                  >
                    {/* Header with color */}
                    <div 
                      className="h-3"
                      style={{ backgroundColor: radio.color || "hsl(220, 70%, 45%)" }}
                    />
                    
                    <div className="p-6">
                      {/* Logo and Info */}
                      <div className="flex items-start gap-4 mb-4">
                        {radio.logo_url ? (
                          <img
                            src={radio.logo_url}
                            alt={radio.name}
                            className="w-20 h-20 rounded-xl object-contain bg-muted p-2"
                          />
                        ) : (
                          <div 
                            className="w-20 h-20 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${radio.color}20` }}
                          >
                            <Radio className="w-8 h-8" style={{ color: radio.color || undefined }} />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 
                            className="font-display text-xl font-bold mb-1"
                            style={{ color: radio.color || undefined }}
                          >
                            {radio.name}
                          </h3>
                          <p className="text-lg font-semibold text-foreground">
                            {radio.frequency}
                          </p>
                          {radio.tagline && (
                            <p className="text-sm text-muted-foreground italic mt-1">
                              {radio.tagline}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* WhatsApp Links */}
                      <div className="space-y-2 mb-4">
                        {radio.whatsapp_station && (
                          <a
                            href={formatWhatsApp(radio.whatsapp_station)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg hover:bg-green-100 dark:hover:bg-green-950/50 transition-colors"
                          >
                            <MessageCircle className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="text-sm font-medium text-green-700 dark:text-green-400">
                                WhatsApp Estúdio
                              </p>
                              <p className="text-xs text-green-600/70 dark:text-green-500/70">
                                Participe ao vivo
                              </p>
                            </div>
                          </a>
                        )}
                        {radio.whatsapp_commercial && (
                          <a
                            href={formatWhatsApp(radio.whatsapp_commercial)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors"
                          >
                            <Phone className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                                WhatsApp Comercial
                              </p>
                              <p className="text-xs text-blue-600/70 dark:text-blue-500/70">
                                Anuncie conosco
                              </p>
                            </div>
                          </a>
                        )}
                      </div>

                      {/* Listen Button */}
                      {radio.stream_url && (
                        <Button 
                          className="w-full gap-2"
                          style={{ 
                            backgroundColor: radio.color || undefined,
                          }}
                        >
                          <Headphones className="w-4 h-4" />
                          Ouvir ao vivo
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}