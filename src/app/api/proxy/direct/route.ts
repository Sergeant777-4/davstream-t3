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

    await new Promise((resolve) => setTimeout(resolve, 300));

    const proxyHeaders = {
      "User-Agent":
        request.headers.get("user-agent") ||
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:135.0) Gecko/20100101 Firefox/135.0",
      Accept: request.headers.get("accept") || "*/*",
      Referer: ref || request.headers.get("referer") || "",
      Range: request.headers.get("range") || "bytes=0-",
    };
    const res = await fetch(url, { headers: proxyHeaders });

    return new Response(res.body, {
      status: res.status,
      headers: res.headers,
    });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
};

// accept: "*/*",
// "accept-language": "en-US,en;q=0.9",
// "sec-fetch-dest": "video",
// "sec-fetch-mode": "no-cors",
// "sec-fetch-site": "same-site",
// "sec-ch-ua-mobile": "?0",
// "sec-ch-ua-platform": '"Windows"',
// "sec-ch-ua":
//   '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
// TE: "trailers",
// Pragma: "no-cache",
// "cache-control": "no-cache",
// "Referrer-Policy": "strict-origin-when-cross-origin",
