import { notFound } from "next/navigation";
import * as z from "zod";
import Player from "~/components/Player";
import mediaAction from "~/server/media/media_actions";
import playerAction from "~/server/player/player_actions";

const searchParamsType = z.object({
  id: z.coerce.number(),
  type: z.enum(["TV", "MOVIE"]),
});

type Props = {
  searchParams: Promise<z.infer<typeof searchParamsType>>;
};

const WatchPage = async ({ searchParams }: Props) => {
  const valid = searchParamsType.safeParse(await searchParams);
  if (!valid.success) notFound();

  const media = await mediaAction.getMediaDetails(valid.data.id);
  const players = await playerAction.getDirectLinks({ mediaId: media.id });
  const file = players?.find((item) => item.type === "hls");

  return (
    <div>
      {JSON.stringify(file)}
      <Player url={file?.url} />
    </div>
  );
};

export default WatchPage;
