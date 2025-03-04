// LULUSTREAM EXTRACTOR
extractorRoute.get("/lulustream/:encodedUrl", async (c) => {
const encodedUrl = c.req.param("encodedUrl");
const url = decodeURIComponent(encodedUrl);

    const res = await fetch(url, { headers: { Referer: url, ...HEADERS } });
    const html = await res.text();
    const regex = /sources:\s+\[\{file:"(.*)"\}\],/gm;

    const m3uLink = regex.exec(html)?.[1];
    if (!m3uLink) throw new Error("M3U8 link not found");

    return c.json({ type: "hls", url: m3uLink, host: "lulustream" });

});

// ONEUPLOAD EXTRACTOR
extractorRoute.get("/oneupload/:encodedUrl", async (c) => {
const encodedUrl = c.req.param("encodedUrl");
const url = decodeURIComponent(encodedUrl);

    const res = await fetch(url, { headers: { Referer: url, ...HEADERS } });
    const html = await res.text();
    const regex = /sources:\s+\[\{file:"(.*)"\}\],/gm;

    const m3uLink = regex.exec(html)?.[1];
    if (!m3uLink) throw new Error("M3U8 link not found");

    return c.json({ type: "hls", url: m3uLink, host: "oneupload" });

});

// DARKIBOX EXTRACTOR
extractorRoute.get("/darkibox/:encodedUrl", async (c) => {
const encodedUrl = c.req.param("encodedUrl");
const url = decodeURIComponent(encodedUrl);

    const res = await fetch(url, { headers: { Referer: url, ...HEADERS } });
    const html = await res.text();
    const regex = /sources:\s+\[\{src:\s+"(.*)",\s+type/gm;

    const m3uLink = regex.exec(html)?.[1];
    if (!m3uLink) throw new Error("M3U8 link not found");

    return c.json({ type: "hls", url: m3uLink, host: "darkibox" });

});

// VIDMOLY EXTRACTOR
extractorRoute.get("/vidmoly/:encodedUrl", async (c) => {
const encodedUrl = c.req.param("encodedUrl");
const url = decodeURIComponent(encodedUrl);

    const res = await fetch(url, {
      headers: {
        ...HEADERS,
        "sec-fetch-dest": "iframe",
        Referer: url,
      },
    });

    const html = await res.text();
    const regex = /sources:\s+\[\{file:"(.*)"\}\]/gm;

    const m3uLink = regex.exec(html)?.[1];
    if (!m3uLink) throw new Error("M3U8 link not found");

    return c.json({
      type: "hls",
      url: m3uLink,
      host: "vidmoly",
      referer: "https://vidmoly.to",
    });

});
