/** @jsx h */
import { h } from "preact";
import { useState, useEffect, useRef, MutableRef } from "preact/hooks";
import _YT from "youtube/index.d.ts";

const YOUTUBE_IFRAME_API_SRC = 'https://www.youtube.com/iframe_api';

export type PlayerVars = YT.PlayerVars;
export type PlayerHandler = YT.Player;

export interface YouTubePlayerProps {
  height: number;
  width: number;
  videoId: string;
  playerVars?: PlayerVars;
  playerHandler?: MutableRef<PlayerHandler | undefined>,
  onPlayerReady?: () => void,
}

export function loadYouTubeAPI() {
  return new Promise((resolve, reject) => {
    const existingScript = document.getElementById('youtube-iframe-api');
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        existingScript.onerror = existingScript.onload = null;
        resolve(existingScript);
      });

      existingScript.addEventListener('error', () => {
        script.onerror = script.onload = null;
        reject(new Error(`Failed to load ${script}`));
      });
      return;
    }

    const script: HTMLScriptElement = document.createElement('script');
    script.id = 'youtube-iframe-api';
    script.src = YOUTUBE_IFRAME_API_SRC;
    script.async = true;

    script.addEventListener('load', () => {
      script.onerror = script.onload = null;
      resolve(script);
    });

    script.addEventListener('error', () => {
      script.onerror = script.onload = null;
      reject(new Error(`Failed to load ${script}`));
    });

    const head = document.head || document.getElementsByTagName('head')[0];
    head.appendChild(script);
  });
}

export function YouTubePlayer(props: YouTubePlayerProps) {
  const [ytAPI, setYtAPI] = useState(globalThis.window.YT);
  const [countPrepare, setCountPrepare] = useState(0);
  const player = props.playerHandler || useRef<PlayerHandler>();
  const [playerId, _setPlayerId] = useState("ytplayer-" + Math.random().toString(36).slice(-8));
  const [playerReady, serPlayerReady] = useState(false);

  useEffect(() => {
    loadYouTubeAPI().then(() => {
      setYtAPI(globalThis.window.YT);
    });
  });

  useEffect(() => {
    if (!globalThis.window.YT || !globalThis.window.YT.Player) {
      const id = setInterval(() => setCountPrepare(countPrepare + 1), 100);
      return () => clearInterval(id);
    }

    if (!player.current) {
      console.log(`${props.videoId}: Setting YouTube Player`);
      player.current = new ytAPI.Player(playerId, {
        width: props.width,
        height: props.height,
        videoId: props.videoId,
        playerVars: props.playerVars,
      });
      serPlayerReady(true);
    }

    if (!props.playerHandler) return;

    if (!props.playerHandler?.current?.getVideoUrl) {
      const id = setInterval(() => setCountPrepare(countPrepare + 1), 100);
      return () => clearInterval(id);
    }

    if (props.onPlayerReady) props.onPlayerReady();
  }, [countPrepare]);

  return (
    <div>
      {
        !playerReady && (
          <div id={playerId} style={{ height: `${props.height}px`, width: `${props.width}px` }} />
        )
      }
    </div>
  );
}
