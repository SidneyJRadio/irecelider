import { Link } from "react-router-dom";
import { Instagram, Youtube, Facebook } from "lucide-react";
import { radios } from "@/data/radios";
import grupoLogo from "@/assets/logos/grupo-jsidney.png";
import mascoteFooter from "@/assets/mascote-footer.png";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img 
                src={grupoLogo} 
                alt="Grupo J.Sidney de Comunicação" 
                className="h-14 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              O portal oficial de notícias do grupo de rádios. Informação de qualidade para toda a região.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="#"
                className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">
              Navegação
            </h4>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Início
              </Link>
              <Link to="/noticias" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Notícias
              </Link>
              <Link to="/comunicadores" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Comunicadores
              </Link>
              <Link to="/contato" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Contato
              </Link>
            </nav>
          </div>

          {/* Radios */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">
              Nossas Rádios
            </h4>
            <nav className="flex flex-col gap-2">
              {radios.map((radio) => (
                <span
                  key={radio.id}
                  className="text-sm text-primary-foreground/80"
                >
                  {radio.name} {radio.frequency}
                </span>
              ))}
            </nav>
          </div>

          {/* Regions */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">
              Regiões
            </h4>
            <nav className="flex flex-col gap-2">
              <Link to="/noticias/irece" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Irecê
              </Link>
              <Link to="/noticias/chapada" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Chapada Diamantina
              </Link>
              <Link to="/noticias/regional" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Regional
              </Link>
              <Link to="/noticias/bahia" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Bahia
              </Link>
            </nav>
          </div>

          {/* Mascot */}
          <div className="hidden lg:flex items-center justify-center self-stretch -my-12">
            <img 
              src={mascoteFooter}
              alt="Mascote Líder - 1º Lugar em Audiência"
              className="h-full max-h-[32rem] w-auto object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-primary-foreground/60">
            © {new Date().getFullYear()} Grupo J.Sidney de Comunicação. Todos os direitos reservados.
          </p>
          <p className="text-xs text-primary-foreground/60">
            Desenvolvido com ❤️ para a comunidade
          </p>
        </div>
      </div>
    </footer>
  );
}
