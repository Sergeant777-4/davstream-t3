"use server";
import * as z from "zod";
import mediaService from "~/server/media/media_service";

export const getRecommendations = async (id: number) => {
  if (isNaN(id) || id < 1) throw new Error("Invalid ID");
  const recommendations = await mediaService.getRecommendations(id);
  return recommendations;
};

export const getSimilars = async (id: number) => {
  if (isNaN(id) || id < 1) throw new Error("Invalid ID");
  const similars = await mediaService.getSimilars(id);
  return similars;
};

export const getPopular = async (payload: { page: number; limit: number }) => {
  const schema = z.object({
    page: z.coerce.number().int().min(1),
    limit: z.coerce.number().int().min(1).max(30),
  });

  const valid = schema.parse(payload);
  const popular = await mediaService.getPopulars(valid);

  return popular;
};

export const getTrending = async (payload: { page: number; limit: number }) => {
  const schema = z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(30).optional().default(25),
  });

  const valid = schema.parse(payload);
  const trending = await mediaService.getTrending(valid);

  return trending;
};

export const getMediaDetails = async (id: number) => {
  if (isNaN(id) || id < 1) throw new Error("Invalid ID");
  const media = await mediaService.findById(id);
  if (!media) throw new Error("Media not found");
  return media;
};

export const searchMedia = async (payload: {
  query: string;
  page: number;
  limit: number;
}) => {
  const schema = z.object({
    query: z.string().min(1),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(30).optional().default(25),
  });

  const valid = schema.parse(payload);
  const results = await mediaService.search(valid);

  return results;
};
