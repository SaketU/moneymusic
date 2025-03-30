import { useEffect } from "react";

function AudioPlayer({ url, autoplay = true, muted = false }) {
  useEffect(() => {
    if (url) {
      const audio = new Audio(url);
      audio.muted = muted;
      if (autoplay) {
        audio
          .play()
          .then(() => console.log("Audio playing"))
          .catch((err) =>
            console.error("Audio playback prevented or error occurred:", err)
          );
      }
    }
  }, [url, autoplay, muted]);

  return null; // This component renders nothing visible.
}

export default AudioPlayer;
