import { Play, Pause, Volume2, VolumeX, X, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRadioPlayer } from "@/contexts/RadioPlayerContext";
import { Button } from "@/components/ui/button";

interface MiniPlayerProps {
  isVisible: boolean;
  onScrollToPlayer: () => void;
}

export function MiniPlayer({ isVisible, onScrollToPlayer }: MiniPlayerProps) {
  const {
    currentRadio,
    isPlaying,
    togglePlay,
    isMuted,
    toggleMute,
  } = useRadioPlayer();

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div 
        className="bg-primary/95 backdrop-blur-lg border-t border-primary-foreground/10 shadow-2xl"
        style={{ 
          background: `linear-gradient(135deg, ${currentRadio.color}, hsl(220, 70%, 35%))` 
        }}
      >
        <div className="container">
          <div className="flex items-center gap-3 py-3 px-2">
            {/* Radio Logo */}
            <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur p-1.5 flex-shrink-0">
              <img
                src={currentRadio.logo}
                alt={currentRadio.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Radio Info */}
            <button 
              onClick={onScrollToPlayer}
              className="flex-1 text-left group"
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full bg-accent",
                  isPlaying && "animate-pulse"
                )} />
                <span className="text-accent text-[10px] font-semibold uppercase tracking-wide">
                  {isPlaying ? "Ao Vivo" : "Pausado"}
                </span>
              </div>
              <h4 className="text-white font-bold text-sm truncate group-hover:underline">
                {currentRadio.name}
              </h4>
              <p className="text-white/60 text-xs truncate">
                {currentRadio.frequency} • {currentRadio.tagline}
              </p>
            </button>

            {/* Controls */}
            <div className="flex items-center gap-1">
              {/* Volume */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="w-9 h-9 text-white/70 hover:text-white hover:bg-white/10"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>

              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="w-11 h-11 rounded-full bg-white text-primary flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </button>

              {/* Scroll to player */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onScrollToPlayer}
                className="w-9 h-9 text-white/70 hover:text-white hover:bg-white/10"
                title="Ir para o player"
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
