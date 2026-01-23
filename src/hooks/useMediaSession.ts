import { useEffect } from "react";
import { useRadioPlayer } from "@/contexts/RadioPlayerContext";

export function useMediaSession() {
  const { currentRadio, isPlaying, play, pause, togglePlay } = useRadioPlayer();

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    // Set metadata
    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentRadio.name,
      artist: currentRadio.tagline,
      album: currentRadio.frequency,
      artwork: [
        {
          src: currentRadio.logo,
          sizes: "96x96",
          type: "image/png",
        },
        {
          src: currentRadio.logo,
          sizes: "128x128",
          type: "image/png",
        },
        {
          src: currentRadio.logo,
          sizes: "256x256",
          type: "image/png",
        },
      ],
    });

    // Set playback state
    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
  }, [currentRadio, isPlaying]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    // Set action handlers
    navigator.mediaSession.setActionHandler("play", () => {
      play();
    });

    navigator.mediaSession.setActionHandler("pause", () => {
      pause();
    });

    navigator.mediaSession.setActionHandler("stop", () => {
      pause();
    });

    return () => {
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
      navigator.mediaSession.setActionHandler("stop", null);
    };
  }, [play, pause, togglePlay]);
}
