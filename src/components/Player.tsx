"use client";
import { useEffect, useRef } from "react";
import Artplayer from "artplayer";
import Hls from "hls.js";

type Props = { data: ExtractedLink; poster: string };

const Player = ({ data, poster }: Props) => {
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
      playbackRate: true,
      aspectRatio: true,
      miniProgressBar: true,
      mutex: true,
      backdrop: true,
      playsInline: true,
      autoPlayback: true,
      airplay: true,
      poster: poster,
      theme: "#23ade5",
      moreVideoAttr: { crossOrigin: "anonymous" },
      lang: navigator.language.toLowerCase(),
      url: data.url,
      ...(data.type === "direct" && {
        controls: [
          {
            index: 1,
            position: "right",
            html: `<a href="${data.url}" download><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor class="size-2" width="24px" height="24px"><path fill-rule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" /></svg></a>`,
            tooltip: "Telechargement",
          },
        ],
      }),
      icons: {
        state:
          '<img width="150" heigth="150" src="https://artplayer.org/assets/img/state.svg">',
        indicator:
          '<img width="16" heigth="16" src="https://artplayer.org/assets/img/indicator.svg">',
      },
    });

    return () => {
      if (art?.destroy) art.destroy(false);
    };
  }, [data.type, data.url, poster]);

  return <div id="player" ref={artRef} className="size-full"></div>;
};

export default Player;
