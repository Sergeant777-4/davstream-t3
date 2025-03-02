import { Parser } from "m3u8-parser";
import type { NextRequest } from "next/server";
import { serializeM3U8 } from "~/lib/utils";

const headers = {
  Accept: "*/*",
  "Accept-Encoding": "gzip, deflate, br",
  "Accept-Language": "en-US,en;q=0.5",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:135.0) Gecko/20100101 Firefox/135.0",
  DNT: "1",
  Connection: "keep-alive",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "cross-site",
  Pragma: "no-cache",
  "Cache-Control": "no-cache",
  "Upgrade-Insecure-Requests": "1",
  Priority: "u=4",
  TE: "trailers",
  "X-Requested-With": "XMLHttpRequest",
};

const getLinks = (payload: { newUri: string; ref: string; isTs: boolean }) => {
  const apiUrl = "https://davstream-t3.vercel.app";
  return payload.isTs
    ? `${apiUrl}/proxy/direct?url=${encodeURIComponent(payload.newUri)}&ref=${encodeURIComponent(payload.ref)}`
    : `${apiUrl}/proxy/hls?url=${encodeURIComponent(payload.newUri)}&ref=${encodeURIComponent(payload.ref)}`;
};

export const GET = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const encodedUrl = searchParams.get("url");
    const encodedRef = searchParams.get("ref");
    if (!encodedUrl) throw new Error("URL is required");

    const url = decodeURIComponent(encodedUrl);
    const baseUrl = new URL(url);
    const ref = encodedRef ? decodeURIComponent(encodedRef) : baseUrl.origin;

    const res = await fetch(url, {
      headers: {
        Referer: ref,
        Origin: ref,
        Host: baseUrl.host,
        ...headers,
      },
      cache: "force-cache",
      next: { revalidate: 900 },
      mode: "no-cors",
    });
    const data = await res.text();
    if (data.includes("403 Forbidden")) throw new Error("403 Forbidden");

    const parser = new Parser();
    parser.push(data);
    parser.end();

    const iframePlaylists = parser.manifest.iFramePlaylists;
    const playlists = parser.manifest.playlists;
    const segments = parser.manifest.segments;

    const newIframePlaylists = iframePlaylists?.map((iframe) => {
      const uri = iframe.uri;
      const isUrl = uri.startsWith("http");
      const newUri = isUrl ? uri : new URL(uri, baseUrl).toString();
      const isTs = uri.includes(".ts");

      return {
        ...iframe,
        attributes: {
          ...iframe.attributes,
          URI: getLinks({ isTs, newUri, ref }),
        },
        uri: getLinks({ isTs, newUri, ref }),
      };
    });

    const newPlaylists = playlists?.map((playlist) => {
      // @ts-ignore
      const uri = playlist?.uri as string;
      const isUrl = uri.startsWith("http");
      const newUri = isUrl ? uri : new URL(uri, baseUrl).toString();
      const isTs = uri.includes(".ts");

      return {
        ...playlist,
        uri: getLinks({ isTs, newUri, ref }),
      };
    });

    const newSegments = segments?.map((segment) => {
      const uri = segment.uri;
      const isUrl = uri.startsWith("http");
      const newUri = isUrl ? uri : new URL(uri, baseUrl).toString();
      const isTs = uri.includes(".ts");

      return {
        ...segment,
        uri: getLinks({ isTs, newUri, ref }),
      };
    });

    const newM3u8Parser = new Parser();
    newM3u8Parser.push(data);
    newM3u8Parser.manifest.playlists = newPlaylists;
    newM3u8Parser.manifest.segments = newSegments;
    newM3u8Parser.manifest.iFramePlaylists = newIframePlaylists;
    newM3u8Parser.end();

    const m3u8Output = serializeM3U8(newM3u8Parser.manifest);
    return new Response(m3u8Output);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
};
