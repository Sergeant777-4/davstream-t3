export const dynamic = "force-dynamic";
import type { NextRequest } from "next/server";

// const headers = {
//   Accept: "*/*",
//   "Accept-Encoding": "gzip, deflate, br",
//   "Accept-Language": "en-US,en;q=0.5",
//   "User-Agent":
//     "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:135.0) Gecko/20100101 Firefox/135.0",
//   DNT: "1",
//   Connection: "keep-alive",
//   "Sec-Fetch-Dest": "empty",
//   "Sec-Fetch-Mode": "cors",
//   "Sec-Fetch-Site": "cross-site",
//   Pragma: "no-cache",
//   "Cache-Control": "no-cache",
//   "Upgrade-Insecure-Requests": "1",
//   Priority: "u=4",
//   TE: "trailers",
//   "X-Requested-With": "XMLHttpRequest",
// };

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
        Range: request.headers.get("Range") || "bytes=0-",
        "sec-fetch-dest": "video",
        TE: "trailers",
      },
      cache: "no-cache",
    });

    return new Response(res.body);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
};
