import { useState, useCallback, useEffect } from "react";

interface UsePictureInPictureReturn {
  isPiPSupported: boolean;
  isPiPActive: boolean;
  openPiP: () => Promise<Window | null>;
  closePiP: () => void;
  pipWindow: Window | null;
}

export function usePictureInPicture(): UsePictureInPictureReturn {
  const [isPiPActive, setIsPiPActive] = useState(false);
  const [pipWindow, setPipWindow] = useState<Window | null>(null);

  // Check if Document PiP is supported
  const isPiPSupported = "documentPictureInPicture" in window;

  const openPiP = useCallback(async (): Promise<Window | null> => {
    if (!isPiPSupported) {
      console.warn("Document Picture-in-Picture not supported");
      return null;
    }

    try {
      // @ts-ignore - Document PiP API types not yet in TypeScript
      const pipWin = await window.documentPictureInPicture.requestWindow({
        width: 320,
        height: 180,
      });

      setPipWindow(pipWin);
      setIsPiPActive(true);

      // Copy stylesheets to PiP window
      const styles = document.querySelectorAll('link[rel="stylesheet"], style');
      styles.forEach((style) => {
        pipWin.document.head.appendChild(style.cloneNode(true));
      });

      // Add base styles
      const baseStyle = pipWin.document.createElement("style");
      baseStyle.textContent = `
        * { box-sizing: border-box; }
        body { 
          margin: 0; 
          padding: 0;
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, hsl(220, 70%, 25%), hsl(220, 70%, 35%));
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `;
      pipWin.document.head.appendChild(baseStyle);

      // Handle PiP window close
      pipWin.addEventListener("pagehide", () => {
        setIsPiPActive(false);
        setPipWindow(null);
      });

      return pipWin;
    } catch (error) {
      console.error("Failed to open Picture-in-Picture:", error);
      return null;
    }
  }, [isPiPSupported]);

  const closePiP = useCallback(() => {
    if (pipWindow) {
      pipWindow.close();
      setPipWindow(null);
      setIsPiPActive(false);
    }
  }, [pipWindow]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pipWindow) {
        pipWindow.close();
      }
    };
  }, [pipWindow]);

  return {
    isPiPSupported,
    isPiPActive,
    openPiP,
    closePiP,
    pipWindow,
  };
}
