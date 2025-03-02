const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.5",
  "Accept-Encoding": "gzip, deflate, br",
  Accept: "*/*",
  DNT: "1",
  Connection: "keep-alive",
  "Sec-Fetch-Dest": "iframe",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "cross-site",
  Pragma: "no-cache",
  "Cache-Control": "no-cache",
  "Upgrade-Insecure-Requests": "1",
  Priority: "u=4",
  TE: "trailers",
  "X-Requested-With": "XMLHttpRequest",
};

export const GET = async (
  _: Request,
  { params }: { params: Promise<{ iframeLink: string }> },
) => {
  // voe: https://maxfinishseveral.com/e/3smqgedolfsz
  const iframeLink = decodeURIComponent((await params).iframeLink);
  const iframeBaseURL = new URL(iframeLink);

  const res = await fetch(iframeLink, {
    headers: {
      referer: iframeBaseURL.origin,
      origin: iframeBaseURL.origin,
      ...headers,
    },
    cache: "no-cache",
  });

  const dummyPage = await res.text();
  const dummyRegex = /window.location.href\s+=\s+\'(.*)\'/;
  const redirectUrl = dummyRegex.exec(dummyPage)?.[1];

  const res2 = await fetch(redirectUrl || iframeLink, {
    headers: {
      referer: iframeBaseURL.origin,
      origin: iframeBaseURL.origin,
      ...headers,
    },
    cache: "no-cache",
  });
  const document = await res2.text();

  const regex = /sources\s+=\s+{\s+'hls':\s+'(.*)',/gm;
  const encoded = regex.exec(document)?.[1];

  if (!encoded)
    return Response.json({ error: "Encoded url not found" }, { status: 404 });

  const url = atob(encoded);
  return Response.json(
    { url, type: "hls", ref: iframeBaseURL.origin },
    { status: 200 },
  );
};

// Extractors ==================================
// app.get("/uqload/:url", async (c) => {
//   // uqload: https://uqload.net/embed-x5tlt4mbfwh4.html
//   const embedLink = decodeURIComponent(c.req.param("url"));
//   const baseURL = new URL(embedLink);

//   const response = await fetch(embedLink, {
//     headers: secureHeaders({
//       referer: baseURL.origin,
//       origin: baseURL.origin,
//       host: baseURL.host,
//     }),
//   });
//   const document = await response.text();

//   const regex = /sources:\s\["(.*)"],/gm;
//   const url = regex.exec(document)?.[1];

//   if (!url) throw new HTTPException(404, { message: "MP4 file not found" });

//   return c.json({ url, type: "direct", ref: baseURL.origin });
// });

// app.get("/voe/:url", async (c) => {});

// Proxy ==================================
// app.get("/proxy/direct", async (c) => {
//   const url = decodeURIComponent(c.req.query().url);

//   const ref = c.req.query().ref;
//   const referer = ref && decodeURIComponent(ref);

//   if (!url) throw new HTTPException(400, { message: "URL is required" });

//   return proxy(url, {
//     headers: {
//       ...secureHeaders({ referer }),
//       "sec-fetch-dest": "video",
//       range: "bytes=0-",
//     },
//   });
// });

// app.get("/proxy/hls", async (c) => {
//   const url = decodeURIComponent(c.req.query().url);
//   const apiUrl = env(c).API_URL;

//   const ref = c.req.query().ref;
//   const referer = ref && decodeURIComponent(ref);

//   if (!url) throw new HTTPException(400, { message: "URL is required" });

//   const baseURL = new URL(url);

//   const headers = secureHeaders({
//     referer: baseURL.origin,
//     origin: baseURL.origin,
//   });

//   const res = await fetch(url, { headers, method: "GET" });

//   const data = await res.text();

//   console.log("DATA", JSON.stringify(data));

//   const parser = new Parser();
//   parser.push(data);
//   parser.end();

//   console.log("BEFORE", JSON.stringify(parser.manifest));

//   const iframePlaylists = parser.manifest.iFramePlaylists;
//   const playlists = parser.manifest.playlists;
//   const segments = parser.manifest.segments;

//   const newIframePlaylists = iframePlaylists?.map((iframe) => {
//     const uri = iframe.uri;
//     const newUri = uri.startsWith("http")
//       ? uri
//       : new URL(uri, baseURL).toString();
//     const isTs = /.ts/gm.exec(uri);

//     return {
//       ...iframe,
//       attributes: {
//         ...iframe.attributes,
//         URI: isTs
//           ? `${apiUrl}/proxy/direct?url=${encodeURIComponent(newUri)}`
//           : `${apiUrl}/proxy/hls?url=${encodeURIComponent(newUri)}`,
//       },
//       uri: isTs
//         ? `${apiUrl}/proxy/direct?url=${encodeURIComponent(newUri)}`
//         : `${apiUrl}/proxy/hls?url=${encodeURIComponent(newUri)}`,
//     };
//   });

//   const newPlaylists = playlists?.map((playlist) => {
//     //@ts-ignore
//     const uri = playlist.uri;
//     const newUri = uri.startsWith("http")
//       ? uri
//       : new URL(uri, baseURL).toString();
//     const isTs = /.ts/gm.exec(uri);

//     return {
//       ...playlist,
//       uri: isTs
//         ? `${apiUrl}/proxy/direct?url=${encodeURIComponent(newUri)}`
//         : `${apiUrl}/proxy/hls?url=${encodeURIComponent(newUri)}`,
//     };
//   });

//   const newSegments = segments?.map((segment) => {
//     //@ts-ignore
//     const uri = segment.uri;
//     const newUri = uri.startsWith("http")
//       ? uri
//       : new URL(uri, baseURL).toString();
//     const isTs = /.ts/gm.exec(uri);

//     return {
//       ...segment,
//       uri: isTs
//         ? `${apiUrl}/proxy/direct?url=${encodeURIComponent(newUri)}`
//         : `${apiUrl}/proxy/hls?url=${encodeURIComponent(newUri)}`,
//     };
//   });

//   const newM3u8Parser = new Parser();
//   newM3u8Parser.push(data);
//   newM3u8Parser.manifest.playlists = newPlaylists;
//   newM3u8Parser.manifest.segments = newSegments;
//   newM3u8Parser.manifest.iFramePlaylists = newIframePlaylists;
//   newM3u8Parser.end();

//   console.log("AFTER", JSON.stringify(newM3u8Parser.manifest));

//   const m3u8Output = serializeM3U8(newM3u8Parser.manifest);

//   return new Response(m3u8Output, {
//     headers: { "Content-Type": "application/vnd.apple.mpegurl" },
//   });
// });
