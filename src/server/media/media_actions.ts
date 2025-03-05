"use server";
import type { CategoryEnum } from "@prisma/client";
import * as z from "zod";
import mediaService from "~/server/media/media_service";

export const getRecommendations = async (id: number) => {
  if (isNaN(id) || id < 1) throw new Error("Invalid ID");
  const limit = 5;

  const media = await mediaService.findById(id);
  if (!media) throw new Error("Media not found");

  const recommendations = await mediaService.findManyByTmdbIds({
    tmdbIds: media.recommendations.slice(0, limit),
    type: media.type,
  });

  return { ...media, recommendations };
};

export const getSimilars = async (id: number) => {
  if (isNaN(id) || id < 1) throw new Error("Invalid ID");
  const limit = 5;

  const media = await mediaService.findById(id);
  if (!media) throw new Error("Media not found");

  const similars = await mediaService.findManyByTmdbIds({
    tmdbIds: media.similars.slice(0, limit),
    type: media.type,
  });

  return { ...media, similars };
};

export const getPopular = async (payload?: {
  page?: number;
  limit?: number;
}) => {
  const schema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(30).default(25),
  });

  const valid = schema.parse(payload || {});
  const { populars, totalResults } = await mediaService.getPopulars(valid);
  const totalPages = Math.floor(totalResults / valid.limit);

  return { page: valid.page, totalPages, totalResults, results: populars };
};

export const getTrending = async (payload?: {
  page?: number;
  limit?: number;
}) => {
  const schema = z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(30).optional().default(25),
  });

  const valid = schema.parse(payload || {});
  const { trending, totalResults } = await mediaService.getTrending(valid);
  const totalPages = Math.floor(totalResults / valid.limit);

  return { page: valid.page, totalPages, totalResults, results: trending };
};

export const getMediaByWatchProviders = async (payload: {
  id: number;
  page?: number;
  limit?: number;
}) => {
  const schema = z.object({
    id: z.coerce.number().int().min(1),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(30).optional().default(25),
  });

  const valid = schema.parse(payload || {});
  const { watchProvider, results, totalResults } =
    await mediaService.getByWatchProviders(valid);
  const totalPages = Math.floor(totalResults / valid.limit);

  return {
    page: valid.page,
    totalPages,
    totalResults,
    watchProvider,
    results: results,
  };
};

export const getByCategory = async (payload: {
  category: CategoryEnum;
  page?: number;
  limit?: number;
}) => {
  const schema = z.object({
    category: z.enum(["ANIME", "CARTOON", "KDRAMA", "DOCUMENTARY"]),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(30).optional().default(25),
  });

  const valid = schema.parse(payload || {});
  const { results, totalResults } = await mediaService.getByCategory(valid);
  const totalPages = Math.floor(totalResults / valid.limit);

  return { page: valid.page, totalPages, totalResults, results };
};

export const getMediaDetails = async (id: number) => {
  if (isNaN(id) || id < 1) throw new Error("Invalid ID");
  const media = await mediaService.getDetails(id);
  if (!media) throw new Error("Media not found");
  return media;
};

export const searchMedia = async (payload?: {
  query: string;
  page?: number;
  limit?: number;
}) => {
  const schema = z.object({
    query: z.string().min(1),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(30).optional().default(25),
  });

  const valid = schema.parse(payload || {});
  const { results, totalResults } = await mediaService.search(valid);
  const totalPages = Math.floor(totalResults / valid.limit);

  return { page: valid.page, totalPages, totalResults, results };
};
