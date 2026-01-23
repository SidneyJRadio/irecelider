import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Play, Pause, Volume2, VolumeX, Radio } from "lucide-react";
import { useRadioPlayer } from "@/contexts/RadioPlayerContext";
import { radios } from "@/data/radios";

interface PiPPlayerProps {
  pipWindow: Window;
}

export function PiPPlayer({ pipWindow }: PiPPlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { currentRadio, setCurrentRadio, isPlaying, togglePlay, isMuted, toggleMute } = useRadioPlayer();

  useEffect(() => {
    // Create container in PiP window
    const container = pipWindow.document.createElement("div");
    container.id = "pip-player-root";
    pipWindow.document.body.appendChild(container);
    containerRef.current = container;

    return () => {
      container.remove();
    };
  }, [pipWindow]);

  if (!containerRef.current) return null;

  return createPortal(
    <div className="w-full h-full p-4 flex flex-col items-center justify-center gap-3">
      {/* Radio Logo */}
      <div className="w-16 h-16 rounded-xl bg-white/10 backdrop-blur p-2 flex items-center justify-center">
        <img
          src={currentRadio.logo}
          alt={currentRadio.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Radio Info */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <Radio className="w-3 h-3 text-red-400" />
          <span className="text-red-400 text-[10px] font-semibold uppercase tracking-wide flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            Ao Vivo
          </span>
        </div>
        <h3 className="text-white font-bold text-sm">{currentRadio.name}</h3>
        <p className="text-white/60 text-xs">{currentRadio.frequency}</p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMute}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </button>
      </div>

      {/* Radio Switcher */}
      <div className="flex items-center gap-1.5 mt-2">
        {radios.slice(0, 4).map((radio) => (
          <button
            key={radio.id}
            onClick={() => setCurrentRadio(radio)}
            className={`w-7 h-7 rounded-lg p-1 transition-all ${
              currentRadio.id === radio.id
                ? "bg-white shadow-md"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            <img
              src={radio.logo}
              alt={radio.name}
              className="w-full h-full object-contain"
            />
          </button>
        ))}
      </div>
    </div>,
    containerRef.current
  );
}
