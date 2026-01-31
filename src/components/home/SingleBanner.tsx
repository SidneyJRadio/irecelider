import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface SingleBannerProps {
  className?: string;
  position: string;
}

interface Banner {
  id: string;
  title: string;
  image_url: string;
  link_url: string | null;
  position: string;
  display_order: number;
}

export function SingleBanner({ className, position }: SingleBannerProps) {
  const { data: banners, isLoading } = useQuery({
    queryKey: ["banners", position],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .eq("position", position)
        .eq("active", true)
        .order("display_order")
        .limit(1);

      if (error) throw error;
      return data as Banner[];
    },
  });

  if (isLoading) {
    return (
      <section className={cn("py-4", className)}>
        <div className="container">
          <div className="relative bg-gradient-to-br from-muted to-muted/50 rounded-xl border border-dashed border-border overflow-hidden animate-pulse">
            <div className="aspect-[3/1] md:aspect-[4/1]" />
          </div>
        </div>
      </section>
    );
  }

  const banner = banners?.[0];

  if (!banner) {
    return null;
  }

  const content = (
    <img
      src={banner.image_url}
      alt={banner.title}
      className="w-full h-full object-cover"
    />
  );

  if (banner.link_url) {
    return (
      <section className={cn("py-4", className)}>
        <div className="container">
          <a
            href={banner.link_url.startsWith("http") ? banner.link_url : `https://${banner.link_url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="relative bg-muted rounded-xl overflow-hidden group hover:ring-2 hover:ring-primary/30 transition-all block"
          >
            <div className="aspect-[3/1] md:aspect-[4/1]">{content}</div>
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className={cn("py-4", className)}>
      <div className="container">
        <div className="relative bg-muted rounded-xl overflow-hidden">
          <div className="aspect-[3/1] md:aspect-[4/1]">{content}</div>
        </div>
      </div>
    </section>
  );
}
