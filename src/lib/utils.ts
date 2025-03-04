/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { clsx, type ClassValue } from "clsx";
import type { Manifest } from "m3u8-parser";
import { twMerge } from "tailwind-merge";
import { env } from "~/env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const serializeM3U8 = (manifest: Manifest): string => {
  let output = "#EXTM3U\n";

  const formatAttributes = (attributes: Record<string, unknown>): string =>
    Object.entries(attributes)
      .map(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          if ("width" in value && "height" in value) {
            return `${key.toUpperCase()}=${value.width as string}x${value.height as string}`;
          }
          return "";
        }
        return `${key.toUpperCase()}=${value as string}`;
      })
      .filter(Boolean)
      .join(",");

  if (manifest.version) output += `#EXT-X-VERSION:${manifest.version}\n`;
  if (manifest.targetDuration)
    output += `#EXT-X-TARGETDURATION:${manifest.targetDuration}\n`;
  if (manifest.mediaSequence !== undefined)
    output += `#EXT-X-MEDIA-SEQUENCE:${manifest.mediaSequence}\n`;
  if (manifest.discontinuitySequence !== undefined)
    output += `#EXT-X-DISCONTINUITY-SEQUENCE:${manifest.discontinuitySequence}\n`;
  if (manifest.playlistType)
    output += `#EXT-X-PLAYLIST-TYPE:${manifest.playlistType}\n`;

  if (manifest.playlists) {
    manifest.playlists.forEach((playlist) => {
      const attributes = formatAttributes(playlist.attributes);
      output += `#EXT-X-STREAM-INF:${attributes}\n`;
      // @ts-ignore
      if (playlist.uri) output += `${playlist.uri}\n`;
    });
  }

  if (manifest.iFramePlaylists) {
    manifest.iFramePlaylists.forEach((iframe) => {
      const attributes = formatAttributes(iframe.attributes);
      output += `#EXT-X-I-FRAME-STREAM-INF:${attributes}\n`;
      if (iframe.uri) output += `${iframe.uri}\n`;
    });
  }

  if (manifest.mediaGroups) {
    Object.entries(manifest.mediaGroups).forEach(([groupName, groups]) => {
      Object.entries(groups).forEach(([groupId, details]) => {
        output += `#EXT-X-MEDIA:TYPE=${groupName.toUpperCase()},GROUP-ID="${groupId}",${formatAttributes(
          details,
        )}\n`;
      });
    });
  }

  if (manifest.segments) {
    manifest.segments.forEach((segment) => {
      if (segment.duration !== undefined) {
        output += `#EXTINF:${segment.duration.toFixed(3)},${
          segment.title || ""
        }\n`;
      }
      if (segment.uri) output += `${segment.uri}\n`;
    });
  }

  if (manifest.discontinuityStarts) {
    manifest.discontinuityStarts.forEach((index) => {
      output += `#EXT-X-DISCONTINUITY:${index}\n`;
    });
  }

  if (manifest.dateRanges) {
    manifest.dateRanges.forEach((range) => {
      output += `#EXT-X-DATERANGE:${formatAttributes(range)}\n`;
    });
  }

  if (manifest.preloadSegment) {
    output += `#EXT-X-PRELOAD-HINT:${formatAttributes(
      // @ts-ignore
      manifest.preloadSegment,
    )}\n`;
  }

  if (manifest.endList) output += "#EXT-X-ENDLIST\n";

  return output;
};

export const getLinks = (payload: {
  newUri: string;
  ref: string;
  isTs: boolean;
}) => {
  return payload.isTs
    ? `${env.API_URL}/proxy/direct?url=${encodeURIComponent(payload.newUri)}&ref=${encodeURIComponent(payload.ref)}`
    : `${env.API_URL}/proxy/hls?url=${encodeURIComponent(payload.newUri)}&ref=${encodeURIComponent(payload.ref)}`;
};
