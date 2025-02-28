"use server";
import * as z from "zod";
import seasonService from "~/server/season/season_service";

class SeasonAction {
  getMediaSeasons = async (mediaId: number) => {
    if (isNaN(mediaId) || mediaId < 1) throw new Error("Invalid mediaId");

    const seasons = await seasonService.getMediaSeasons(mediaId);

    return seasons;
  };

  getSeasonDetails = async (payload: { mediaId: number; number: number }) => {
    const schema = z.object({
      mediaId: z.number().int().min(1),
      number: z.number().int().min(1),
    });

    const valid = schema.parse(payload);
    const season = await seasonService.getDetails(valid);

    return season;
  };
}

const seasonAction = new SeasonAction();
export default seasonAction;
