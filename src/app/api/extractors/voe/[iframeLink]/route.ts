export const dynamic = "force-dynamic";

const headers = {
  dnt: "1",
  host: "maxfinishseveral.com",
  accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:135.0) Gecko/20100101 Firefox/135.0",
  "accept-language": "en-US,en;q=0.5",
  "accept-encoding": "gzip, deflate, br",
  connection: "keep-alive",
  "sec-fetch-dest": "document",
  "sec-fetch-mode": "navigate",
  "sec-fetch-site": "none",
  "sec-fetch-user": "?1",
  pragma: "no-cache",
  "cache-control": "no-cache",
  "upgrade-insecure-requests": "1",
  te: "trailers",
};

export const GET = async (
  _: Request,
  { params }: { params: Promise<{ iframeLink: string }> },
) => {
  try {
    const iframeLink = decodeURIComponent((await params).iframeLink);
    const iframeBaseURL = new URL(iframeLink);

    const res = await fetch(iframeLink, {
      next: { revalidate: 1 },
      cache: "no-cache",
      keepalive: true,
      headers,
    });

    const dummyPage = await res.text();
    const dummyRegex = /window.location.href\s+=\s+\'(.*)\'/;
    const redirectUrl = dummyRegex.exec(dummyPage)?.[1];

    const res2 = await fetch(redirectUrl || iframeLink, {
      next: { revalidate: 1 },
      cache: "no-cache",
      keepalive: true,
      mode: "no-cors",
      headers,
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
  } catch (error) {
    return Response.json(error, { status: 400 });
  }
};
