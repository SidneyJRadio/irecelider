import { Link } from "react-router-dom";
import { Instagram, Youtube, Facebook, Link as LinkIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import grupoLogo from "@/assets/logos/grupo-jsidney.png";
import mascoteFooter from "@/assets/mascote-footer.png";

interface FooterLink {
  id: string;
  type: string;
  label: string;
  url: string;
  icon: string | null;
  display_order: number;
  active: boolean;
}

const getIconComponent = (iconName: string | null) => {
  switch (iconName) {
    case "instagram":
      return <Instagram className="w-5 h-5" />;
    case "youtube":
      return <Youtube className="w-5 h-5" />;
    case "facebook":
      return <Facebook className="w-5 h-5" />;
    default:
      return <LinkIcon className="w-5 h-5" />;
  }
};

export function Footer() {
  const { data: radios = [] } = useQuery({
    queryKey: ["radios-footer"],
    queryFn: async () => {
      const { data } = await supabase
        .from("radios")
        .select("id, name, frequency")
        .eq("active", true)
        .order("display_order", { ascending: true });
      return data || [];
    },
  });

  const { data: footerLinks = [] } = useQuery({
    queryKey: ["footer-links"],
    queryFn: async () => {
      const { data } = await supabase
        .from("footer_links")
        .select("*")
        .eq("active", true)
        .order("display_order", { ascending: true });
      return (data || []) as FooterLink[];
    },
  });

  const socialLinks = footerLinks.filter((link) => link.type === "social");
  const navigationLinks = footerLinks.filter((link) => link.type === "navigation");
  const regionLinks = footerLinks.filter((link) => link.type === "region");

  const isExternalLink = (url: string) => url.startsWith("http");

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
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target={isExternalLink(link.url) ? "_blank" : undefined}
                  rel={isExternalLink(link.url) ? "noopener noreferrer" : undefined}
                  className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                  aria-label={link.label}
                >
                  {getIconComponent(link.icon)}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">
              Navegação
            </h4>
            <nav className="flex flex-col gap-2">
              {navigationLinks.map((link) =>
                isExternalLink(link.url) ? (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.id}
                    to={link.url}
                    className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              )}
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
              {regionLinks.map((link) =>
                isExternalLink(link.url) ? (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.id}
                    to={link.url}
                    className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              )}
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
