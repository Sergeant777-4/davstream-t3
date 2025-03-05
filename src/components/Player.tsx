"use client";
import { useEffect, useRef } from "react";
import Artplayer from "artplayer";
import Hls from "hls.js";

type Props = { data: ExtractedLink; poster: string; logoPath?: string | null };

const Player = ({ data, poster, logoPath }: Props) => {
  const artRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const art = new Artplayer({
      container: artRef.current || "#player",
      ...(data.type === "hls" && {
        type: "m3u8",
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
      }),
      fullscreen: true,
      miniProgressBar: true,
      mutex: true,
      backdrop: true,
      playsInline: true,
      airplay: true,
      poster: poster,
      theme: "#23ade5",
      moreVideoAttr: { crossOrigin: "anonymous" },
      lang: navigator.language.toLowerCase(),
      url: data.url,
      icons: {
        state: `<img width="150" heigth="150" src="${logoPath ? logoPath : "https://artplayer.org/assets/img/state.svg"}">`,
        indicator:
          '<img width="16" heigth="16" src="https://artplayer.org/assets/img/indicator.svg">',
      },
    });

    return () => {
      if (art?.destroy) art.destroy(false);
    };
  }, [data.type, data.url, logoPath, poster]);

  return (
    <div id="player" ref={artRef} className="relative -z-0 size-full"></div>
  );
};

export default Player;
