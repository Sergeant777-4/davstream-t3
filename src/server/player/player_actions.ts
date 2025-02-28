import * as z from "zod";
import playerService from "~/server/player/player_service";

class PlayerAction {
  getDirectLinks = async (payload: {
    episodeId?: number;
    mediaId?: number;
  }) => {
    "use server";

    const schema = z.object({
      episodeId: z.coerce.number().int().min(1).optional(),
      mediaId: z.coerce.number().int().min(1).optional(),
    });

    const valid = schema.parse(payload);

    let players;
    if (valid.episodeId)
      players = await playerService.getAllMediaLinks(valid.episodeId, "TV");
    if (valid.mediaId)
      players = await playerService.getAllMediaLinks(valid.mediaId, "MOVIE");

    return players;
  };
}

const playerAction = new PlayerAction();
export default playerAction;
