# fresh-youtube-player
YouTube player component for Fresh

## Installation
Add next lines to `import_map.json`.
```json
{
  "imports": {
    ...
    "youtube/": "https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/youtube/",
    "fresh-youtube-player/": "https://deno.land/x/fresh_youtube_player@0.9.3/"
  }
}
```

Run the following command to cache the module.
```sh
deno cache dev.ts
```

## Example
You can use fresh-youtube-player only for the islands, because YouTube API is processed by the client-side.
```tsx
/** @jsx h */
/** islands/Theater.tsx */
import { h } from "preact";
import { useRef, useCallback } from "preact/hooks";
import { YouTubePlayer, PlayerHandler } from "fresh-youtube-player/mod.ts";

export default function Theater() {
  const playerHandler = useRef<PlayerHandler>();

  const onPlayerReady = useCallback(() => {
    playerHandler.current?.playVideo();
  }, []);

  return (
    <div>
      <YouTubePlayer
        width={640}
        height={390}
        videoId={'4boXExbbGCk'}
        playerVars={{ mute: 1 }}
        playerHandler={playerHandler}
        onPlayerReady={onPlayerReady}
      />
    </div>
  );
}
```
