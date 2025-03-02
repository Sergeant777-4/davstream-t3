import Link from "next/link";
import { notFound } from "next/navigation";
import * as z from "zod";
import Player from "~/components/Player";
import mediaAction from "~/server/media/media_actions";
import { getDirectLink } from "~/server/player/player_actions";

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
  const player = media.players[valid.data.player];
  if (!player) notFound();

  const extracted = await getDirectLink(player.url);
  // const players = await playerAction.getDirectLinks({ mediaId: media.id });
  // const player = players?.[valid.data.player];
  // TODO: DELETE VIDSTACK

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="aspect-video w-full max-w-md">
        {extracted.type === "iframe" ? (
          <iframe src={player.url}></iframe>
        ) : (
          <>
            {/* <video src={player.url} controls></video> */}
            <Player data={extracted} />
          </>
        )}
      </div>

      <ul className="flex flex-col">
        {media.players?.map((item, index) => (
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
