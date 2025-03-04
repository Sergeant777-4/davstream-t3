import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import * as z from "zod";
import Player from "~/components/Player";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import {
  getMediaDetails,
  getRecommendations,
} from "~/server/media/media_actions";
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
    <main className="container flex flex-col gap-4 py-2 lg:flex-row">
      <section className="flex flex-1 flex-col gap-2">
        <Card className="aspect-video w-full overflow-hidden">
          {extracted.type === "iframe" ? (
            <iframe className="size-full" src={player.url}></iframe>
          ) : (
            <Player data={extracted} />
          )}
        </Card>

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
        <Link key={item.id} href={`/watch?id=${item.id}&type=${item.type}`}>
          <Card className="flex h-32 overflow-hidden">
            <figure className="aspect-[3/4.5] h-full">
              <Image
                alt=""
                src={item.posterPath || ""}
                width={500}
                height={500}
                unoptimized
              />
            </figure>

            <div className="flex flex-col justify-center gap-1 p-3">
              <p className="line-clamp-1 text-sm font-medium">{item.title}</p>
              <p className="line-clamp-2 text-xs">{item.overview}</p>

              <div className="mt-1 flex flex-wrap gap-1">
                <Badge>{item.releaseDate.getFullYear()}</Badge>
                <Badge>{item.tmdbRating.toFixed(1)}</Badge>
                <Badge>{item.type}</Badge>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </>
  );
};

export default WatchPage;
