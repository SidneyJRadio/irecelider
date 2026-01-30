import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { radios as fallbackRadios, Radio as StaticRadio } from "@/data/radios";

export interface Radio {
  id: string;
  name: string;
  frequency: string;
  logo: string;
  streamUrl: string;
  tagline: string;
  color: string;
}

interface RadioPlayerContextType {
  currentRadio: Radio;
  setCurrentRadio: (radio: Radio) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  toggleMute: () => void;
  radios: Radio[];
  isLoading: boolean;
}

const RadioPlayerContext = createContext<RadioPlayerContextType | null>(null);

// Convert database radio to context radio format
function mapDatabaseRadio(dbRadio: {
  id: string;
  name: string;
  frequency: string;
  logo_url: string | null;
  stream_url: string | null;
  tagline: string | null;
  color: string | null;
}): Radio {
  return {
    id: dbRadio.id,
    name: dbRadio.name,
    frequency: dbRadio.frequency,
    logo: dbRadio.logo_url || "/placeholder.svg",
    streamUrl: dbRadio.stream_url || "",
    tagline: dbRadio.tagline || "",
    color: dbRadio.color || "hsl(220, 70%, 45%)",
  };
}

// Convert static radio to context radio format
function mapStaticRadio(staticRadio: StaticRadio): Radio {
  return {
    id: staticRadio.id,
    name: staticRadio.name,
    frequency: staticRadio.frequency,
    logo: staticRadio.logo,
    streamUrl: staticRadio.streamUrl,
    tagline: staticRadio.tagline,
    color: staticRadio.color,
  };
}

export function RadioPlayerProvider({ children }: { children: React.ReactNode }) {
  const { data: dbRadios, isLoading } = useQuery({
    queryKey: ["radios-player"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("radios")
        .select("*")
        .eq("active", true)
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  // Use database radios if available, otherwise fallback to static
  const radios: Radio[] = dbRadios && dbRadios.length > 0
    ? dbRadios.map(mapDatabaseRadio)
    : fallbackRadios.map(mapStaticRadio);

  const [currentRadio, setCurrentRadio] = useState<Radio>(radios[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Update currentRadio when radios load from database
  useEffect(() => {
    if (radios.length > 0 && !radios.find(r => r.id === currentRadio.id)) {
      setCurrentRadio(radios[0]);
    }
  }, [radios, currentRadio.id]);

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle radio change
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.load();
      audioRef.current.play().catch(console.error);
    }
  }, [currentRadio]);

  return (
    <RadioPlayerContext.Provider
      value={{
        currentRadio,
        setCurrentRadio,
        isPlaying,
        setIsPlaying,
        isMuted,
        setIsMuted,
        volume,
        setVolume,
        audioRef,
        play,
        pause,
        togglePlay,
        toggleMute,
        radios,
        isLoading,
      }}
    >
      {children}
    </RadioPlayerContext.Provider>
  );
}

export function useRadioPlayer() {
  const context = useContext(RadioPlayerContext);
  if (!context) {
    throw new Error("useRadioPlayer must be used within a RadioPlayerProvider");
  }
  return context;
}
