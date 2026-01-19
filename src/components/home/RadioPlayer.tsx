import { useState } from "react";
import { Play, Pause, Volume2, VolumeX, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { radios } from "@/data/radios";
import { cn } from "@/lib/utils";

export function RadioPlayer() {
  const [selectedRadio, setSelectedRadio] = useState(radios[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In production, this would control an actual audio element
  };

  return (
    <section id="player" className="relative py-6">
      <div className="container">
        <div className="relative rounded-2xl player-glass overflow-hidden">
          {/* Background waves animation */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 1200 100" preserveAspectRatio="none">
              <path
                d="M0,50 C150,90 350,10 500,50 C650,90 850,10 1000,50 C1150,90 1200,50 1200,50 L1200,100 L0,100 Z"
                fill="currentColor"
                className="text-primary-foreground wave-animation"
              />
            </svg>
          </div>

          <div className="relative z-10 p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              {/* Radio Selector */}
              <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
                {radios.map((radio) => (
                  <button
                    key={radio.id}
                    onClick={() => setSelectedRadio(radio)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                      selectedRadio.id === radio.id
                        ? "bg-primary-foreground text-primary shadow-md"
                        : "bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
                    )}
                  >
                    {radio.frequency}
                  </button>
                ))}
              </div>

              {/* Selected Radio Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Radio className="w-4 h-4 text-accent" />
                  <span className="text-accent text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    Ao Vivo
                  </span>
                </div>
                <h3 className="text-primary-foreground font-display text-xl font-bold mt-1">
                  {selectedRadio.name}
                </h3>
                <p className="text-primary-foreground/70 text-sm">
                  {selectedRadio.tagline}
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </Button>

                <button
                  onClick={handlePlayPause}
                  className="relative w-14 h-14 rounded-full bg-primary-foreground text-primary flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-1" />
                  )}
                  {isPlaying && (
                    <span className="absolute inset-0 rounded-full border-2 border-primary-foreground animate-ping opacity-30" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
