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
  // uqload: https://uqload.net/embed-x5tlt4mbfwh4.html
  const iframeLink = decodeURIComponent((await params).iframeLink);
  const baseURL = new URL(iframeLink);

  const res = await fetch(iframeLink, {
    headers: {
      referer: baseURL.origin,
      origin: baseURL.origin,
      host: baseURL.host,
      ...headers,
    },
    cache: "force-cache",
    next: { revalidate: 900 },
    mode: "no-cors",
  });

  const document = await res.text();
  const regex = /sources:\s\["(.*)"],/gm;
  const url = regex.exec(document)?.[1];

  if (!url)
    return Response.json({ error: "MP4 file not found" }, { status: 404 });

  return Response.json({ url, type: "direct", ref: baseURL.origin });
};
