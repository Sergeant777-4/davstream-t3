import type { Prisma } from "@prisma/client";
import { db } from "~/server/db";

class SeasonService {
  async upsert(insertData: Prisma.SeasonCreateInput) {
    return await db.season.upsert({
      create: insertData,
      update: insertData,
      where: {
        mediaTmdbId_number: {
          mediaTmdbId: insertData.mediaTmdbId,
          number: insertData.number,
        },
      },
    });
  }

  async getDetails(payload: { mediaId: number; number: number }) {
    return await db.season.findUnique({
      where: { mediaId_number: payload },
      include: { episodes: true },
    });
  }

  async getMediaSeasons(mediaId: number) {
    return await db.season.findMany({
      include: { episodes: true },
      orderBy: { number: "asc" },
      where: { mediaId },
    });
  }

  async delete(payload: { mediaTmdbId: number; number: number }) {
    return await db.season.delete({ where: { mediaTmdbId_number: payload } });
  }
}

const seasonService = new SeasonService();
export default seasonService;
