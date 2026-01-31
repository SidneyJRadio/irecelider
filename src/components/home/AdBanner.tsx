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
  display_order: number;
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
        .order("display_order");

      if (error) throw error;
      return data as Banner[];
    },
  });

  const renderBanner = (banner: Banner) => {
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
          key={banner.id}
          href={banner.link_url.startsWith("http") ? banner.link_url : `https://${banner.link_url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="relative bg-muted rounded-xl overflow-hidden group hover:ring-2 hover:ring-primary/30 transition-all w-full block"
        >
          <div className="aspect-[6/1] md:aspect-[8/1]">{content}</div>
        </a>
      );
    }

    return (
      <div key={banner.id} className="relative bg-muted rounded-xl overflow-hidden w-full">
        <div className="aspect-[6/1] md:aspect-[8/1]">{content}</div>
      </div>
    );
  };

  const renderPlaceholder = () => (
    <div className="relative bg-gradient-to-br from-muted to-muted/50 rounded-xl border border-dashed border-border overflow-hidden w-full">
      <div className="aspect-[6/1] md:aspect-[8/1] flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Publicidade</p>
          <p className="text-sm font-medium text-muted-foreground/70">Espaço para anúncio</p>
        </div>
      </div>
    </div>
  );

  // Show loading state
  if (isLoading) {
    return (
      <section className={cn("py-4", className)}>
        <div className="container">
          <div className="flex flex-col gap-4">
            {renderPlaceholder()}
          </div>
        </div>
      </section>
    );
  }

  // No banners available
  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <section className={cn("py-4", className)}>
      <div className="container">
        {/* All banners stacked vertically */}
        <div className="flex flex-col gap-4">
          {banners.map(renderBanner)}
        </div>
      </div>
    </section>
  );
}
