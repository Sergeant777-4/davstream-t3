import * as z from "zod";
import mediaService from "~/server/media/media_service";

class MediaAction {
  getRecommendations = async (id: number) => {
    "use server";

    if (isNaN(id) || id < 1) throw new Error("Invalid ID");
    const recommendations = await mediaService.getRecommendations(id);

    return recommendations;
  };

  getSimilars = async (id: number) => {
    "use server";

    if (isNaN(id) || id < 1) throw new Error("Invalid ID");
    const similars = await mediaService.getSimilars(id);

    return similars;
  };

  getPopular = async (payload: { page: number; limit: number }) => {
    "use server";

    const schema = z.object({
      page: z.coerce.number().int().min(1),
      limit: z.coerce.number().int().min(1).max(30),
    });

    const valid = schema.parse(payload);
    const popular = await mediaService.getPopulars(valid);

    return popular;
  };

  getTrending = async (payload: { page: number; limit: number }) => {
    "use server";

    const schema = z.object({
      page: z.coerce.number().int().min(1).optional().default(1),
      limit: z.coerce.number().int().min(1).max(30).optional().default(25),
    });

    const valid = schema.parse(payload);
    const trending = await mediaService.getTrending(valid);

    return trending;
  };

  getMediaDetails = async (id: number) => {
    "use server";

    if (isNaN(id) || id < 1) throw new Error("Invalid ID");

    const media = await mediaService.findById(id);
    if (!media) throw new Error("Media not found");

    return media;
  };

  searchMedia = async (payload: {
    query: string;
    page: number;
    limit: number;
  }) => {
    "use server";

    const schema = z.object({
      query: z.string().min(1),
      page: z.coerce.number().int().min(1).optional().default(1),
      limit: z.coerce.number().int().min(1).max(30).optional().default(25),
    });

    const valid = schema.parse(payload);
    const results = await mediaService.search(valid);

    return results;
  };
}

const mediaAction = new MediaAction();
export default mediaAction;
