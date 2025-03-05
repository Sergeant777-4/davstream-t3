import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import * as z from "zod";
import MediaHCard from "~/components/MediaHCard";
import Player from "~/components/Player";
import TrailerPlayer from "~/components/TrailerPlayer";
import { Badge } from "~/components/ui/badge";
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
            <Player
              data={extracted}
              logoPath={media.logoPath}
              poster={media.backdropPath || ""}
            />
          )}
        </Card>

        <ul className="flex flex-wrap gap-2">
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

        <Card
          className="relative grid grid-cols-1 gap-4 bg-cover bg-center p-4 lg:grid-cols-[200px,1fr]"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,.9), rgba(0,0,0,.8)), url(${media.backdropPath})`,
          }}
        >
          <div className="flex flex-col gap-2">
            <figure className="aspect-[3/4.5] overflow-hidden rounded-lg">
              <Image
                alt=""
                width={500}
                height={500}
                src={media.posterPath || ""}
                className="size-full object-cover object-center"
              />
            </figure>

            <div className="flex flex-col gap-2">
              <Button variant={"secondary"}>Plus Tard</Button>
              <Button variant={"secondary"}>Details</Button>
              <Button variant={"secondary"}>Partager</Button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-2xl font-bold">
                {media.title} ({media.originalTitle})
              </p>

              <p className="text-xs">{media.alternativeTitles}</p>

              <div className="mt-2 flex flex-wrap gap-2">
                <Badge>{media.releaseDate.getFullYear()}</Badge>
                {media.category && <Badge>{media.category}</Badge>}
                <Badge>{media.duration}m</Badge>
                <Badge>{media.status}</Badge>
                <Badge>{media.type}</Badge>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-lg font-bold">Description</p>
              <p className="text-sm">{media.overview}</p>
            </div>

            {media.watchProviders.length > 0 && (
              <div className="flex flex-col gap-1">
                <p className="text-lg font-bold">Plateformes</p>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(3rem,1fr))] gap-2">
                  {media.watchProviders.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <Image
                        src={item.logoPath || ""}
                        alt=""
                        width={500}
                        height={500}
                        className="size-full object-contain object-center"
                      />
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {media.genres.length > 0 && (
              <div className="flex flex-col gap-1">
                <p className="text-lg font-bold">Genres</p>
                <div className="flex flex-wrap gap-2">
                  {media.genres.map((item) => (
                    <Badge key={item.id}>{item.name}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </section>

      <aside className="flex w-full flex-col gap-4 lg:max-w-[350px]">
        <div>
          <p className="font-medium">Bande annonce</p>
          <TrailerPlayer url={media.trailerUrl || ""} />
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-medium">Recommendations</p>
          <Suspense fallback="loading">
            <Recommendations mediaId={media.id} />
          </Suspense>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-medium">Collection</p>
          <Suspense fallback="loading">
            {media.collection?.media.map((item) => (
              <MediaHCard media={item} key={item.id} />
            ))}
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
