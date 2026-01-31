import { Play, Pause, Volume2, VolumeX, Radio, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRadioPlayer } from "@/contexts/RadioPlayerContext";
import mascoteLider from "@/assets/mascote-lider-novo.png";

export function RadioPlayer() {
  const {
    currentRadio,
    setCurrentRadio,
    isPlaying,
    togglePlay,
    isMuted,
    toggleMute,
    radios,
    isLoading,
  } = useRadioPlayer();

  if (isLoading) {
    return (
      <section id="player" className="relative py-6">
        <div className="container">
          <div className="relative rounded-2xl player-glass overflow-hidden p-8 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-foreground" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="player" className="relative py-6">
      <div className="container">
        <div className="relative rounded-2xl player-glass overflow-visible">
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
              {/* Radio Selector with Logos */}
              <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
                {radios.map((radio) => (
                  <button
                    key={radio.id}
                    onClick={() => setCurrentRadio(radio)}
                    className={cn(
                      "relative flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-200",
                      currentRadio.id === radio.id
                        ? "bg-primary-foreground text-primary shadow-md"
                        : "bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
                    )}
                  >
                    <img 
                      src={radio.logo} 
                      alt={radio.name}
                      className="w-10 h-10 md:w-12 md:h-12 object-contain rounded-lg"
                    />
                    <span className="text-[10px] md:text-xs font-semibold">{radio.frequency}</span>
                  </button>
                ))}
              </div>

              {/* Selected Radio Info */}
              <div className="flex-1 flex items-center gap-4 text-center md:text-left">
                <div className="hidden md:block w-12 h-12 rounded-lg bg-primary-foreground/10 p-1.5">
                  <img 
                    src={currentRadio.logo} 
                    alt={currentRadio.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <Radio className="w-4 h-4 text-accent" />
                    <span className="text-accent text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5">
                      <span className={cn(
                        "w-2 h-2 rounded-full bg-accent",
                        isPlaying && "animate-pulse"
                      )} />
                      {isPlaying ? "Ao Vivo" : "Pausado"}
                    </span>
                  </div>
                  <h3 className="text-primary-foreground font-display text-xl font-bold mt-1">
                    {currentRadio.name}
                  </h3>
                  <p className="text-primary-foreground/70 text-sm">
                    {currentRadio.tagline}
                  </p>
                </div>
              </div>

              {/* Mascot Image - Centered between radio info and controls */}
              <div className="flex items-center justify-center relative">
                <img 
                  src={mascoteLider}
                  alt="Mascote Líder - 1º Lugar em Audiência"
                  className="h-32 md:h-48 w-auto object-contain drop-shadow-xl -my-6 md:-my-12"
                />
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </Button>

                <button
                  onClick={togglePlay}
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
