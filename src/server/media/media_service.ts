import type { CategoryEnum, Prisma, TypeEnum } from "@prisma/client";
import { db } from "~/server/db";

export type MediaSelectType = Prisma.MediaGetPayload<{
  select: {
    id: true;
    type: true;
    title: true;
    releaseDate: true;
    posterPath: true;
    tmdbRating: true;
    backdropPath: true;
    overview: true;
    recommendations: true;
    similars: true;
  };
}>;

class MediaService {
  mediaSelect: Prisma.MediaSelect = {
    id: true,
    type: true,
    title: true,
    releaseDate: true,
    posterPath: true,
    backdropPath: true,
    tmdbRating: true,
    overview: true,
    recommendations: true,
    similars: true,
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

  findByTmdbId = async (payload: { tmdbId: number; type: TypeEnum }) => {
    const media = await db.media.findUnique({
      where: { tmdbId_type: payload },
      select: this.mediaSelect,
    });
    return media as MediaSelectType;
  };

  findById = async (id: number) => {
    const media = await db.media.findUnique({
      where: { id },
      select: this.mediaSelect,
    });
    return media as MediaSelectType;
  };

  getDetails = async (id: number) => {
    return await db.media.findUnique({
      where: { id },
      include: {
        watchProviders: true,
        collection: {
          select: { media: true },
        },
        players: true,
        seasons: true,
        genres: true,
      },
    });
  };

  getSeason = async (payload: { mediaId: number; number: number }) => {
    return await db.season.findUnique({
      include: { episodes: { orderBy: { number: "asc" } } },
      where: { mediaId_number: payload },
    });
  };

  getPlayers = async (mediaId: number) => {
    return await db.player.findMany({ where: { mediaId } });
  };

  findManyByTmdbIds = async (payload: {
    tmdbIds: number[];
    type: TypeEnum;
  }) => {
    const media = await db.media.findMany({
      where: {
        AND: [{ type: payload.type }, { tmdbId: { in: payload.tmdbIds } }],
      },
      orderBy: { popularity: "desc" },
      select: this.mediaSelect,
    });
    return media as MediaSelectType[];
  };

  count = async (where?: Prisma.MediaWhereInput) => {
    return await db.media.count({ where });
  };

  getTrending = async ({ limit, page }: { limit: number; page: number }) => {
    const totalResults = await this.count();
    const trending = await db.media.findMany({
      orderBy: [{ releaseDate: "desc" }, { popularity: "desc" }],
      select: this.mediaSelect,
      skip: (page - 1) * limit,
      take: limit,
    });
    return { trending, totalResults };
  };

  getPopulars = async ({ limit, page }: { limit: number; page: number }) => {
    const totalResults = await this.count();
    const populars = await db.media.findMany({
      orderBy: [{ popularity: "desc" }, { releaseDate: "desc" }],
      select: this.mediaSelect,
      skip: (page - 1) * limit,
      take: limit,
    });
    return { populars, totalResults };
  };

  getByCategory = async ({
    limit,
    page,
    category,
  }: {
    category: CategoryEnum;
    limit: number;
    page: number;
  }) => {
    const totalResults = await this.count();
    const results = await db.media.findMany({
      orderBy: [{ releaseDate: "desc" }, { popularity: "desc" }],
      select: this.mediaSelect,
      skip: (page - 1) * limit,
      where: { category },
      take: limit,
    });
    return { results, totalResults };
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
    const offset = (page - 1) * limit;

    const totalResults = await db.$queryRaw`
    SELECT COUNT(*) AS total_count FROM "Media"
    WHERE SIMILARITY(title, ${query}) > 0.14
       OR SIMILARITY("originalTitle", ${query}) > 0.14
       OR SIMILARITY("alternativeTitles", ${query}) > 0.14;`;

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

    return {
      results: results as MediaSelectType[],
      totalResults: totalResults as number,
    };
  };
}

const mediaService = new MediaService();
export default mediaService;
