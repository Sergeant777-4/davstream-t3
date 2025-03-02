"use server";
import playerService from "~/server/player/player_service";

const DOMAINS = [
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

export const getDirectLink = async (url: string): Promise<ExtractedLink> => {
  if (!url) return { url, ref: "#", type: "iframe" };

  const hostname = new URL(url).hostname;
  const host = DOMAINS.find((item) =>
    item.domains.some((keyword) => hostname.match(keyword)),
  )?.name;

  if (!host) return { url, ref: "#", type: "iframe" };
  const extractedData = await playerService.extractDirectLink(url, host);
  return extractedData;
};
