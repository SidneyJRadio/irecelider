import { Phone, MessageCircle, Radio, MapPin, Mail, Building2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { radios } from "@/data/radios";

const Contato = () => {
  const formatWhatsAppLink = (phone: string, message: string = "") => {
    const cleanPhone = phone.replace(/\D/g, "");
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}${message ? `?text=${encodedMessage}` : ""}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="gradient-hero py-12 md:py-16">
          <div className="container">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground text-center">
              Contato
            </h1>
            <p className="text-primary-foreground/80 text-center mt-2 max-w-xl mx-auto">
              Entre em contato com nossas rádios e departamento comercial
            </p>
          </div>
        </section>

        {/* Radio Contacts */}
        <section className="py-12 md:py-16">
          <div className="container">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
              Nossas Rádios
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {radios.map((radio) => (
                <article
                  key={radio.id}
                  className="card-news p-6 border-l-4"
                  style={{ borderLeftColor: radio.color }}
                >
                  {/* Radio Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${radio.color}20` }}
                    >
                      <Radio className="w-6 h-6" style={{ color: radio.color }} />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-card-foreground">
                        {radio.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {radio.frequency} • {radio.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Region */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{radio.region}</span>
                  </div>

                  {/* Contact Buttons */}
                  <div className="space-y-3">
                    {/* Station WhatsApp */}
                    <a
                      href={formatWhatsAppLink(
                        radio.whatsappStation,
                        `Olá! Gostaria de entrar em contato com a ${radio.name}.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button variant="whatsapp" className="w-full gap-2 justify-start">
                        <MessageCircle className="w-4 h-4" />
                        <span className="flex-1 text-left">WhatsApp da Rádio</span>
                        <Phone className="w-4 h-4 opacity-70" />
                      </Button>
                    </a>

                    {/* Commercial WhatsApp */}
                    <a
                      href={formatWhatsAppLink(
                        radio.whatsappCommercial,
                        `Olá! Gostaria de informações comerciais da ${radio.name}.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button variant="outline" className="w-full gap-2 justify-start">
                        <Building2 className="w-4 h-4" />
                        <span className="flex-1 text-left">Departamento Comercial</span>
                        <MessageCircle className="w-4 h-4 opacity-70" />
                      </Button>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* General Contact */}
        <section className="py-12 bg-secondary/30">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                Contato Geral
              </h2>
              <p className="text-muted-foreground mb-8">
                Para assuntos gerais, parcerias ou sugestões, entre em contato conosco.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href="mailto:contato@portalnoticias.com.br"
                  className="card-news p-6 flex flex-col items-center gap-3 group"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">E-mail</p>
                    <p className="text-sm text-muted-foreground">
                      contato@portalnoticias.com.br
                    </p>
                  </div>
                </a>

                <a
                  href={formatWhatsAppLink(
                    "5574999999999",
                    "Olá! Gostaria de entrar em contato."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-news p-6 flex flex-col items-center gap-3 group"
                >
                  <div className="w-14 h-14 rounded-full bg-[hsl(142,70%,45%)]/10 flex items-center justify-center group-hover:bg-[hsl(142,70%,45%)]/20 transition-colors">
                    <MessageCircle className="w-6 h-6 text-[hsl(142,70%,45%)]" />
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">WhatsApp</p>
                    <p className="text-sm text-muted-foreground">
                      (74) 99999-9999
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contato;
