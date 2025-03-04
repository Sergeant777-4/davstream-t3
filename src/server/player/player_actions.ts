"use server";
import { DOMAINS } from "~/lib/constants";
import playerService from "~/server/player/player_service";

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
