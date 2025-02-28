import type { Prisma } from "@prisma/client";
import { db } from "~/server/db";

class EpisodeService {
  upsert = async (insertData: Prisma.EpisodeCreateInput) => {
    return await db.episode.upsert({
      create: insertData,
      update: insertData,
      where: {
        mediaTmdbId_seasonNumber_number: {
          mediaTmdbId: insertData.mediaTmdbId,
          seasonNumber: insertData.seasonNumber,
          number: insertData.number,
        },
      },
    });
  };

  delete = async ({
    mediaTmdbId,
    seasonNumber,
    number,
  }: {
    mediaTmdbId: number;
    seasonNumber: number;
    number: number;
  }) => {
    return await db.episode.delete({
      where: {
        mediaTmdbId_seasonNumber_number: { mediaTmdbId, seasonNumber, number },
      },
    });
  };

  findOne = async ({
    mediaTmdbId,
    seasonNumber,
    number,
  }: {
    mediaTmdbId: number;
    seasonNumber: number;
    number: number;
  }) => {
    return await db.episode.findUnique({
      where: {
        mediaTmdbId_seasonNumber_number: { mediaTmdbId, seasonNumber, number },
      },
      include: { players: true },
    });
  };
}

const episodeService = new EpisodeService();
export default episodeService;
