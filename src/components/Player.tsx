"use client";
import { useEffect, useRef } from "react";
import Artplayer from "artplayer";
import Hls from "hls.js";

type Props = { data: ExtractedLink };

const Player = ({ data }: Props) => {
  const artRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const art = new Artplayer({
      container: artRef.current || "#player",
      type: data.type === "hls" ? "m3u8" : "mpd",
      customType: {
        m3u8: (video, url, art) => {
          if (Hls.isSupported()) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            if (art.hls) art?.hls?.destroy();
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
            art.hls = hls;
            art.on("destroy", () => hls.destroy());
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
          } else {
            art.notice.show = "Unsupported playback format: m3u8";
          }
        },
      },
      url: data.url,
    });

    return () => {
      if (art?.destroy) art.destroy(false);
    };
  }, [data.type, data.url]);

  return (
    <div id="player" ref={artRef} className="aspect-video w-[300px]"></div>
  );
};

export default Player;
