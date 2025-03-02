import type { Prisma, TypeEnum } from "@prisma/client";
import { env } from "~/env";
import { db } from "~/server/db";

export const DOMAINS = [
  {
    name: "voe",
    domains: ["robertordercharacter", "maxfinishseveral", "voe"],
  },
  {
    name: "uqload",
    domains: ["uqload"],
  },
  {
    name: "doodstream",
    domains: ["doodstream", "dooodster"],
  },
  {
    name: "lulustream",
    domains: ["luluvdo"],
  },
  {
    name: "oneupload",
    domains: ["oneupload", "tipfly"],
  },
  {
    name: "darkibox",
    domains: ["oneupload", "tipfly"],
  },
  {
    name: "vidmoly",
    domains: ["vidmoly"],
  },
] as const;

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
    const hostname = new URL(url).hostname;
    const host = DOMAINS.find((item) =>
      item.domains.some((keyword) => hostname.match(keyword)),
    )?.name;
    return host;
  };

  getAllMediaLinks = async (id: number, type: TypeEnum) => {
    const players =
      type === "MOVIE"
        ? await this.getMediaPlayers(id)
        : await this.getEpisodePlayers(id);

    const resultsPromise = players.map(async (player) => {
      try {
        const host = this.getHost(player.url);
        if (!host) throw new Error(`Host not identified ${player.url}`);
        const extractedData = await this.extractDirectLink(player.url, host);
        return { ...player, ...extractedData };
      } catch (error) {
        console.warn(error);
        return { ...player, type: "embed" };
      }
    });
    const results = await Promise.all(resultsPromise);

    const filtered = results.filter(
      (item) => item !== null && item !== undefined,
    );
    return filtered;
  };

  extractDirectLink = async (url: string, host: string) => {
    const endpoint = `${this.apiUrl}/${host}/${encodeURIComponent(url)}`;

    const res = await fetch(endpoint);
    const data = (await res.json()) as ExtractedLink;
    const directLink = `${this.apiUrl}/proxy/${data.type}?url=${encodeURIComponent(data.url)}&ref=${encodeURIComponent(data.ref)}`;

    return { ...data, url: directLink };
  };
}

const playerService = new PlayerService();
export default playerService;
