import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import * as z from "zod";
import MediaHCard from "~/components/MediaHCard";
import Player from "~/components/Player";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import {
  getMediaDetails,
  getRecommendations,
} from "~/server/media/media_actions";
import { getDirectLink } from "~/server/player/player_actions";
import playerService from "~/server/player/player_service";

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
  const players = media.players.filter((item) =>
    playerService.getHost(item.url),
  );

  const player = players[valid.data.player];
  if (!player) notFound();

  const extracted = await getDirectLink(player.url);

  return (
    <main className="container flex flex-col gap-4 py-2 lg:flex-row">
      <section className="flex flex-1 flex-col gap-2">
        <Card className="aspect-video w-full overflow-hidden">
          {extracted.type === "iframe" ? (
            <iframe className="size-full" src={player.url}></iframe>
          ) : (
            <Player data={extracted} poster={media.backdropPath || ""} />
          )}
        </Card>

        <ul className="grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] flex-wrap gap-2">
          {players.map((item, index) => (
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
                replace
                key={index}
                href={`?id=${media.id}&type=${media.type}&player=${index}`}
              >
                Serveur {index} ({item.language})
              </Link>
            </Button>
          ))}
        </ul>
      </section>

      <aside className="w-full max-w-[350px]">
        <div className="flex flex-col gap-2">
          <p className="font-medium">Recommendations</p>
          <Suspense fallback="loading">
            <Recommendations mediaId={media.id} />
          </Suspense>
        </div>
      </aside>
    </main>
  );
};

const Recommendations = async ({ mediaId }: { mediaId: number }) => {
  const data = await getRecommendations(mediaId);
  return (
    <>
      {data.recommendations.map((item) => (
        <MediaHCard media={item} key={item.id} />
      ))}
    </>
  );
};

export default WatchPage;
