import { Youtube, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function YouTubeEmbed() {
  // In production, this would fetch the latest video from YouTube API
  const latestVideoId = "CyKl-0Y1ZDg";
  const channelUrl = "https://youtube.com/@example";

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
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${latestVideoId}`}
              title="Último programa"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
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
