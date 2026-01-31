import { useState } from "react";
import { Play, Pause, Volume2, VolumeX, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRadioPlayer } from "@/contexts/RadioPlayerContext";
import { Button } from "@/components/ui/button";

export function GlobalMiniPlayer() {
  const {
    currentRadio,
    setCurrentRadio,
    isPlaying,
    togglePlay,
    isMuted,
    toggleMute,
    radios,
  } = useRadioPlayer();

  const [showRadioSelector, setShowRadioSelector] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Radio Selector Dropdown */}
      <div
        className={cn(
          "bg-background/95 backdrop-blur-lg border-t border-border shadow-lg transition-all duration-300 ease-out overflow-hidden",
          showRadioSelector ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="container py-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">
            Escolha uma rádio
          </p>
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {radios.map((radio) => (
              <button
                key={radio.id}
                onClick={() => {
                  setCurrentRadio(radio);
                  setShowRadioSelector(false);
                }}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 min-w-[80px] flex-shrink-0",
                  currentRadio.id === radio.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted hover:bg-muted/80"
                )}
              >
                <div className="w-12 h-12 rounded-lg bg-white p-1.5">
                  <img
                    src={radio.logo}
                    alt={radio.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold truncate max-w-[70px]">
                    {radio.frequency}
                  </p>
                  <p className="text-[10px] opacity-70 truncate max-w-[70px]">
                    {radio.name.split(" ")[0]}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Mini Player */}
      <div
        className="bg-primary/95 backdrop-blur-lg border-t border-primary-foreground/10 shadow-2xl"
        style={{
          background: `linear-gradient(135deg, ${currentRadio.color}, hsl(220, 70%, 35%))`,
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
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full bg-accent",
                    isPlaying && "animate-pulse"
                  )}
                />
                <span className="text-accent text-[10px] font-semibold uppercase tracking-wide">
                  {isPlaying ? "Ao Vivo" : "Pausado"}
                </span>
              </div>
              <h4 className="text-white font-bold text-sm truncate">
                {currentRadio.name}
              </h4>
              <p className="text-white/60 text-xs truncate">
                {currentRadio.frequency} • {currentRadio.tagline}
              </p>
            </div>

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

              {/* Radio Selector Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowRadioSelector(!showRadioSelector)}
                className="w-9 h-9 text-white/70 hover:text-white hover:bg-white/10"
                title="Escolher rádio"
              >
                {showRadioSelector ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
