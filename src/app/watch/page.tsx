import Link from "next/link";
import { notFound } from "next/navigation";
import * as z from "zod";
import Player from "~/components/Player";
import mediaAction from "~/server/media/media_actions";
import playerAction from "~/server/player/player_actions";

const searchParamsType = z.object({
  id: z.coerce.number(),
  type: z.enum(["TV", "MOVIE"]),
  player: z.coerce.number().default(1),
});

type Props = {
  searchParams: Promise<z.infer<typeof searchParamsType>>;
};

const WatchPage = async ({ searchParams }: Props) => {
  const valid = searchParamsType.safeParse(await searchParams);
  if (!valid.success) notFound();

  const media = await mediaAction.getMediaDetails(valid.data.id);
  const players = await playerAction.getDirectLinks({ mediaId: media.id });
  const player = players?.[valid.data.player];
  // TODO: https://fremtv.lol:443/movie/144BB5626E2EDF5C9E6B39A688E5DF07/256.mp4

  return (
    <div>
      <div className="aspect-video w-full max-w-md">
        {player?.type === "embed" ? (
          <iframe src={player.url}></iframe>
        ) : (
          <Player url={player?.url} />
        )}
      </div>

      <ul className="flex flex-col">
        {players?.map((item, index) => (
          <Link
            key={index}
            href={`?id=${media.id}&type=${media.type}&player=${index}`}
          >
            {index}. {item.host}
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default WatchPage;
