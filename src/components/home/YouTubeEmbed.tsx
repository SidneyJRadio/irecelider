import { useQuery } from "@tanstack/react-query";
import { Youtube, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

export function YouTubeEmbed() {
  const { data: settings, isLoading } = useQuery({
    queryKey: ["site-settings-youtube"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .in("key", ["youtube_video_id", "youtube_channel_url"]);

      if (error) throw error;

      const settingsMap: Record<string, string> = {};
      data?.forEach((setting) => {
        settingsMap[setting.key] = setting.value || "";
      });

      return {
        videoId: settingsMap.youtube_video_id || "CyKl-0Y1ZDg",
        channelUrl: settingsMap.youtube_channel_url || "https://youtube.com/@example",
      };
    },
  });

  const videoId = settings?.videoId || "CyKl-0Y1ZDg";
  const channelUrl = settings?.channelUrl || "https://youtube.com/@example";

  return (
    <section className="py-10 md:py-14 bg-secondary/30">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Youtube className="w-6 h-6 text-accent" />
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Assista no YouTube
              </h2>
            </div>
            <p className="text-muted-foreground">
              Veja os programas que foram ao ar
            </p>
          </div>
          <a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:block"
          >
            <Button variant="outline" className="gap-2 rounded-full">
              Ver canal
              <ExternalLink className="w-4 h-4" />
            </Button>
          </a>
        </div>

        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <Skeleton className="aspect-video rounded-xl" />
          ) : (
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="Último programa"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center md:hidden">
          <a href={channelUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="gap-2 rounded-full">
              Ver canal no YouTube
              <ExternalLink className="w-4 h-4" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
