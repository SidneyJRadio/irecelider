import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface AdBannerProps {
  className?: string;
  position?: "above_news" | "above_communicators";
}

interface Banner {
  id: string;
  title: string;
  image_url: string;
  link_url: string | null;
  position: string;
  slot: number;
}

export function AdBanner({ className, position = "above_news" }: AdBannerProps) {
  const { data: banners, isLoading } = useQuery({
    queryKey: ["banners", position],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .eq("position", position)
        .eq("active", true)
        .order("slot");

      if (error) throw error;
      return data as Banner[];
    },
  });

  // Se está carregando ou não há banners, mostra placeholders
  const slot1Banner = banners?.find((b) => b.slot === 1);
  const slot2Banner = banners?.find((b) => b.slot === 2);

  const renderBanner = (banner: Banner | undefined, slotNumber: number) => {
    if (banner) {
      const content = (
        <img
          src={banner.image_url}
          alt={banner.title}
          className="w-full h-full object-cover"
        />
      );

      if (banner.link_url) {
        return (
          <a
            href={banner.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative bg-muted rounded-xl overflow-hidden group hover:ring-2 hover:ring-primary/30 transition-all"
          >
            <div className="aspect-[4/1] md:aspect-[5/1]">{content}</div>
          </a>
        );
      }

      return (
        <div className="relative bg-muted rounded-xl overflow-hidden">
          <div className="aspect-[4/1] md:aspect-[5/1]">{content}</div>
        </div>
      );
    }

    // Placeholder
    return (
      <div className="relative bg-gradient-to-br from-muted to-muted/50 rounded-xl border border-dashed border-border overflow-hidden group hover:border-primary/30 transition-colors">
        <div className="aspect-[4/1] md:aspect-[5/1] flex items-center justify-center">
          <div className="text-center p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Publicidade</p>
            <p className="text-sm font-medium text-muted-foreground/70">728 x 90</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className={cn("py-4", className)}>
      <div className="container">
        <div className="grid md:grid-cols-2 gap-4">
          {renderBanner(slot1Banner, 1)}
          {renderBanner(slot2Banner, 2)}
        </div>
      </div>
    </section>
  );
}
