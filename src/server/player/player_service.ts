import type { Prisma } from "@prisma/client";
import { env } from "~/env";
import { DOMAINS } from "~/lib/constants";
import { db } from "~/server/db";

class PlayerService {
  apiUrl = env.API_URL;

  upsert = async (insertData: Prisma.PlayerCreateInput) => {
    return await db.player.upsert({
      create: insertData,
      update: insertData,
      where: { url: insertData.url },
    });
  };

  delete = async (url: string) => {
    return await db.player.delete({ where: { url } });
  };

  getEpisodePlayers = async (episodeId: number) => {
    return db.player.findMany({ where: { episodeId } });
  };

  getMediaPlayers = async (mediaId: number) => {
    return db.player.findMany({ where: { mediaId } });
  };

  getHost = (url: string) => {
    if (!url) return null;
    const hostname = new URL(url).hostname;

    const host = DOMAINS.find((item) =>
      item.domains.some((keyword) => hostname.match(keyword)),
    )?.name;
    if (!host) return null;

    return host;
  };

  extractDirectLink = async (
    url: string,
    host: string,
  ): Promise<ExtractedLink> => {
    try {
      const endpoint = `${this.apiUrl}/extractors/${host}/${encodeURIComponent(url)}`;
      const res = await fetch(endpoint, {
        next: { revalidate: 1 },
        cache: "no-cache",
        keepalive: true,
      });

      const data = (await res.json()) as ExtractedLink;
      if (!data.url) throw new Error("Something went wrong");

      const directLink = `${this.apiUrl}/proxy/${data.type}?url=${encodeURIComponent(data.url)}&ref=${encodeURIComponent(data.ref)}`;

      return { ref: data.ref, type: data.type, url: directLink };
    } catch (error) {
      console.error(error);
      return { ref: "#", type: "iframe", url: url };
    }
  };
}

const playerService = new PlayerService();
export default playerService;
