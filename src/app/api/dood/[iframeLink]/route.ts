export const dynamic = "force-dynamic";
import { connect } from "puppeteer-real-browser";

// const headers = {
//   "User-Agent":
//     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
//   "Accept-Language": "en-US,en;q=0.5",
//   "Accept-Encoding": "gzip, deflate, br",
//   Accept: "*/*",
//   DNT: "1",
//   Connection: "keep-alive",
//   "Sec-Fetch-Dest": "iframe",
//   "Sec-Fetch-Mode": "navigate",
//   "Sec-Fetch-Site": "cross-site",
//   Pragma: "no-cache",
//   "Cache-Control": "no-cache",
//   "Upgrade-Insecure-Requests": "1",
//   Priority: "u=4",
//   TE: "trailers",
//   "X-Requested-With": "XMLHttpRequest",
// };

const headers = {
  Host: "dooodster.com",
  "Accept-Encoding": "gzip, deflate, br, zstd",
  DNT: "1",
  Connection: "keep-alive",
  "Upgrade-Insecure-Requests": "1",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  TE: "trailers",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:135.0) Gecko/20100101 Firefox/135.0x",
  Origin: "https://dooodster.com",
  Referer: "https://dooodster.com",
  Cookie: "lang=1",
};

const getDoodStreamLink = async (url: string) => {
  const { page, browser } = await connect({ turnstile: true, headless: true });
  await page.goto(url, { waitUntil: "load" });
  const content = await page.content();
  await browser.close();

  // const res = await fetch(url, { headers: headers });
  // const html = await res.text();

  if (content.includes("Video not found"))
    throw new Error("Wrong url or video deleted");

  const md5Link = /\$.get\('(\/pass_md5\/.*?)'/gm.exec(content)?.[1];
  if (!md5Link) throw new Error("Md5Link not found");

  const match = /\/pass_md5\/(.*)\/(.*)/.exec(md5Link);
  if (!match) throw new Error("Invalid endpoint format");

  const [, hash, token] = match;
  if (!hash || !token) throw new Error("Invalid endpoint");

  const validatedRes = await fetch(
    `https://dooodster.com/dood?op=watch&hash=${hash}&token=${token}&embed=1&ref2=&adb=0&ftor=0`,
    { headers: headers },
  );
  const validate = await validatedRes.text();
  const isValidated = validate.includes("OK");

  return {
    md5Link: "https://dooodster.com" + md5Link,
    hash,
    token,
    isValidated,
  };
};

export const GET = async (
  _: Request,
  { params }: { params: Promise<{ iframeLink: string }> },
) => {
  const iframeLink = decodeURIComponent((await params).iframeLink);
  // const iframeBaseURL = new URL(iframeLink);

  const { md5Link, isValidated, token } = await getDoodStreamLink(iframeLink);
  if (!isValidated) throw new Error("Request not validated");

  const t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const randomGenerated = Array.from(
    { length: 10 },
    () => t[Math.floor(Math.random() * t.length)],
  ).join("");

  const res = await fetch(md5Link, { headers });
  const partialLink = await res.text();
  const fullLink = `${partialLink}${randomGenerated}?token=${token}&expiry=${Date.now()}`;

  return Response.json(
    { url: fullLink, type: "direct", ref: "https://dooodster.com" },
    { status: 200 },
  );
};
