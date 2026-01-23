import { useEffect } from "react";
import { useRadioPlayer } from "@/contexts/RadioPlayerContext";
import { useMediaSession } from "@/hooks/useMediaSession";

export function AudioPlayer() {
  const { currentRadio, audioRef, setIsPlaying } = useRadioPlayer();
  
  // Initialize Media Session
  useMediaSession();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    const handleError = (e: Event) => {
      console.error("Audio error:", e);
      setIsPlaying(false);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [audioRef, setIsPlaying]);

  return (
    <audio
      ref={audioRef}
      src={currentRadio.streamUrl}
      preload="none"
      className="hidden"
    />
  );
}
