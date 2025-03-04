import Link from "next/link";
import { notFound } from "next/navigation";
import * as z from "zod";
import Player from "~/components/Player";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { getMediaDetails } from "~/server/media/media_actions";
import { getDirectLink } from "~/server/player/player_actions";

const searchParamsType = z.object({
  id: z.coerce.number(),
  type: z.enum(["TV", "MOVIE"]),
  player: z.coerce.number().default(0),
});

type Props = {
  searchParams: Promise<z.infer<typeof searchParamsType>>;
};

const WatchPage = async ({ searchParams }: Props) => {
  const valid = searchParamsType.safeParse(await searchParams);
  if (!valid.success) notFound();

  const media = await getMediaDetails(valid.data.id);
  const player = media.players[valid.data.player];
  if (!player) notFound();
  const extracted = await getDirectLink(player.url);

  return (
    <main className="container grid grid-cols-1 gap-4 py-4 md:grid-cols-7">
      <section className="col-span-5 flex flex-col gap-2">
        <div className="aspect-video w-full overflow-hidden rounded-lg">
          {extracted.type === "iframe" ? (
            <iframe className="size-full" src={player.url}></iframe>
          ) : (
            <Player data={extracted} />
          )}
        </div>

        <ul className="grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] flex-wrap gap-2">
          {media.players?.map((item, index) => (
            <Button
              asChild
              size={"sm"}
              key={item.id}
              variant={"ghost"}
              className={cn(
                index === valid.data.player && "bg-secondary",
                "capitalize",
              )}
            >
              <Link
                key={index}
                href={`?id=${media.id}&type=${media.type}&player=${index}`}
              >
                Lecteur {index} ({item.language})
              </Link>
            </Button>
          ))}
        </ul>
      </section>

      <aside className="col-span-2 rounded-md bg-muted/20 p-4"></aside>
    </main>
  );
};

export default WatchPage;
