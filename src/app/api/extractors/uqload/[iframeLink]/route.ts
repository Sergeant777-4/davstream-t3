export const dynamic = "force-dynamic";

const headers = {
  dnt: "1",
  host: "uqload.net",
  "alt-used": "uqload.net",
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:135.0) Gecko/20100101 Firefox/135.0",
  accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "accept-language": "en-US,en;q=0.5",
  "accept-encoding": "gzip, deflate, br",
  connection: "keep-alive",
  "upgrade-insecure-requests": "1",
  "sec-fetch-dest": "document",
  "sec-fetch-mode": "navigate",
  "sec-fetch-site": "none",
  "sec-fetch-user": "?1",
  pragma: "no-cache",
  "cache-control": "no-cache",
  te: "trailers",
  // "X-Requested-With": "XMLHttpRequest",
};

export const GET = async (
  _: Request,
  { params }: { params: Promise<{ iframeLink: string }> },
) => {
  try {
    const iframeLink = decodeURIComponent((await params).iframeLink);

    const res = await fetch(iframeLink, {
      next: { revalidate: 1 },
      cache: "no-cache",
      keepalive: true,
      headers,
    });

    const document = await res.text();
    const regex = /sources:\s\["(.*)"],/gm;
    const url = regex.exec(document)?.[1];

    if (!url)
      return Response.json({ error: "MP4 file not found" }, { status: 404 });

    return Response.json({ url, type: "direct", ref: "https://uqload.net/" });
  } catch (error) {
    return Response.json(error, { status: 400 });
  }
};
