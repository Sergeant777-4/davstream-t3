import type { Prisma, TypeEnum } from "@prisma/client";
import { db } from "~/server/db";

class MediaService {
  mediaSelect: Prisma.MediaSelect = {
    id: true,
    type: true,
    title: true,
    releaseDate: true,
    posterPath: true,
    tmdbRating: true,
  };

  upsert = async (insertData: Prisma.MediaCreateInput) => {
    return await db.media.upsert({
      create: insertData,
      update: insertData,
      where: {
        tmdbId_type: {
          tmdbId: insertData.tmdbId,
          type: insertData.type,
        },
      },
    });
  };

  findByTmdbId = async ({
    tmdbId,
    type,
  }: {
    tmdbId: number;
    type: TypeEnum;
  }) => {
    return await db.media.findUnique({
      where: { tmdbId_type: { tmdbId, type } },
    });
  };

  findById = async (id: number) => {
    return await db.media.findUnique({
      where: { id },
      include: {
        players: true,
        seasons: true,
        collection: true,
        genres: true,
        watchProviders: true,
      },
    });
  };

  getSeason = async ({
    mediaId,
    number,
  }: {
    mediaId: number;
    number: number;
  }) => {
    return await db.season.findUnique({
      include: { episodes: { orderBy: { number: "asc" } } },
      where: { mediaId_number: { mediaId, number } },
    });
  };

  getPlayers = async (mediaId: number) => {
    return await db.player.findMany({ where: { mediaId } });
  };

  findManyByTmdbIds = async (tmdbIds: number[], type: TypeEnum) => {
    return await db.media.findMany({
      where: { AND: [{ type: type }, { tmdbId: { in: tmdbIds } }] },
      select: this.mediaSelect,
      orderBy: { popularity: "desc" },
      take: 10,
    });
  };

  getRecommendations = async (id: number) => {
    const media = await db.media.findUnique({
      select: {
        tmdbRating: true,
        title: true,
        type: true,
        recommendations: true,
        releaseDate: true,
      },
      where: { id },
    });
    if (!media) throw new Error("Media not found");

    const results = await this.findManyByTmdbIds(
      media.recommendations,
      media.type,
    );

    return {
      id,
      type: media.type,
      title: media.title,
      releaseDate: media.releaseDate,
      tmdbRating: media.tmdbRating,
      results,
    };
  };

  getSimilars = async (id: number) => {
    const media = await db.media.findUnique({
      select: {
        tmdbRating: true,
        title: true,
        type: true,
        similars: true,
        releaseDate: true,
      },
      where: { id },
    });
    if (!media) throw new Error("Media not found");

    const results = await this.findManyByTmdbIds(media.similars, media.type);

    return {
      id,
      type: media.type,
      title: media.title,
      releaseDate: media.releaseDate,
      tmdbRating: media.tmdbRating,
      results,
    };
  };

  count = async (where?: Prisma.MediaWhereInput) => {
    return await db.media.count({ where });
  };

  getTrending = async ({ limit, page }: { limit: number; page: number }) => {
    const trending = await db.media.findMany({
      orderBy: [{ releaseDate: "desc" }, { popularity: "desc" }],
      select: this.mediaSelect,
      skip: (page - 1) * limit,
      take: limit,
    });
    return trending;
  };

  getPopulars = async ({ limit, page }: { limit: number; page: number }) => {
    const populars = await db.media.findMany({
      orderBy: [{ popularity: "desc" }, { releaseDate: "desc" }],
      select: this.mediaSelect,
      skip: (page - 1) * limit,
      take: limit,
    });
    return populars;
  };

  delete = async ({ tmdbId, type }: { tmdbId: number; type: TypeEnum }) => {
    return await db.media.delete({
      where: { tmdbId_type: { tmdbId, type } },
    });
  };

  search = async ({
    query,
    limit,
    page,
  }: {
    query: string;
    limit: number;
    page: number;
  }) => {
    const count = await this.count();
    const offset = (page - 1) * limit;

    const results = await db.$queryRaw`
    SELECT GREATEST(SIMILARITY(title, ${query}),
        SIMILARITY("originalTitle", ${query}),
        SIMILARITY("alternativeTitles", ${query})
    ) AS score, id, type, title, "releaseDate", "posterPath", "tmdbRating"
    FROM "Media" WHERE SIMILARITY(title, ${query}) > 0.14
      OR SIMILARITY("originalTitle", ${query}) > 0.14
      OR SIMILARITY("alternativeTitles", ${query}) > 0.14
    ORDER BY score DESC
    LIMIT ${limit} OFFSET ${offset};`;

    return { count, results };
  };
}

const mediaService = new MediaService();
export default mediaService;
