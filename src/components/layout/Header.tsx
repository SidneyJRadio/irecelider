import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Radio, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Início", href: "/" },
  { label: "Notícias", href: "/noticias" },
  { label: "Comunicadores", href: "/comunicadores" },
  { label: "Contato", href: "/contato" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg gradient-radio">
            <Radio className="w-5 h-5 text-primary-foreground" />
            <div className="absolute inset-0 rounded-lg bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg font-bold text-foreground leading-none">
              Portal de Notícias
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              Grupo de Rádios
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== "/" && location.pathname.startsWith(item.href));
            
            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={isActive ? "navActive" : "nav"}
                  size="sm"
                  className={cn(
                    "rounded-full px-4",
                    isActive && "bg-primary/10 text-primary"
                  )}
                >
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Live Radio Button - Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/#player">
            <Button variant="accent" size="sm" className="gap-2 rounded-full">
              <Headphones className="w-4 h-4" />
              <span>Ao Vivo</span>
              <span className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse" />
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-foreground" />
          ) : (
            <Menu className="w-6 h-6 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border shadow-lg animate-fade-in">
          <nav className="container py-4 flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button
                    variant={isActive ? "navActive" : "nav"}
                    className={cn(
                      "w-full justify-start",
                      isActive && "bg-primary/10 text-primary"
                    )}
                  >
                    {item.label}
                  </Button>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-border mt-2">
              <Link to="/#player" onClick={() => setIsMenuOpen(false)}>
                <Button variant="accent" className="w-full gap-2">
                  <Headphones className="w-4 h-4" />
                  <span>Ouvir Ao Vivo</span>
                  <span className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse" />
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
