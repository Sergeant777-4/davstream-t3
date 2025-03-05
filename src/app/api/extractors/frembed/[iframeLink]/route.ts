export const dynamic = "force-dynamic";

// const headers = {
//   accept: "*/*",
//   "accept-language": "en-US,en;q=0.9",
//   "cache-control": "no-cache",
//   pragma: "no-cache",
//   range: "bytes=0-",
//   "sec-ch-ua":
//     '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
//   "sec-ch-ua-mobile": "?0",
//   "sec-ch-ua-platform": '"Windows"',
//   "sec-fetch-dest": "video",
//   "sec-fetch-mode": "no-cors",
//   "sec-fetch-site": "cross-site",
//   "sec-fetch-storage-access": "active",
//   Referer: "https://play.frembed.xyz/",
//   "Referrer-Policy": "strict-origin-when-cross-origin",
// };

export const GET = async (
  _: Request,
  { params }: { params: Promise<{ iframeLink: string }> },
) => {
  try {
    // "https://play.frembed.xyz/player/frvod.php?url=https://fremtv.lol:443/movie/144BB5626E2EDF5C9E6B39A688E5DF07/273.mp4"
    const iframeLink = decodeURIComponent((await params).iframeLink);

    // const res = await fetch(
    //   "https://fremtv.lol:443/movie/144BB5626E2EDF5C9E6B39A688E5DF07/273.mp4",
    //   {
    //     method: "HEAD",
    //     cache: "no-cache",
    //     keepalive: true,
    //     headers,
    //   },
    // );

    // const res = await fetch(
    //   "https://fremtv.lol:443/movie/144BB5626E2EDF5C9E6B39A688E5DF07/273.mp4",
    //   {
    //     headers,
    //     redirect: "follow",
    //     cache: "no-cache",
    //     keepalive: true,
    //   },
    // );

    // return res;

    // const document = await res.text();
    // const regex = /sources:\s\["(.*)"],/gm;
    // const url = regex.exec(document)?.[1];

    // if (!url)
    //   return Response.json({ error: "MP4 file not found" }, { status: 404 });

    return Response.json({
      url: iframeLink,
      type: "direct",
      ref: "https://uqload.net/",
    });
  } catch (error) {
    return Response.json(error, { status: 400 });
  }
};
