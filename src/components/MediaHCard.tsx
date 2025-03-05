import Image from "next/image";
import Link from "next/link";
import type { MediaSelectType } from "~/server/media/media_service";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, Star } from "lucide-react";

type Props = {
  media: MediaSelectType;
};

const MediaHCard = ({ media }: Props) => {
  return (
    <Link key={media.id} href={`/watch?id=${media.id}&type=${media.type}`}>
      <Card className="flex h-32 overflow-hidden">
        <figure className="aspect-[3/4.5] h-full">
          <Image
            alt=""
            src={media.posterPath || ""}
            width={500}
            height={500}
            unoptimized
            className="object-cover object-center"
          />
        </figure>

        <div
          className="flex flex-col justify-center gap-1 bg-cover bg-center p-3"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,1), rgba(0,0,0,0.9), rgba(0,0,0,.7)), url(${media.backdropPath})`,
          }}
        >
          <p className="line-clamp-1 text-sm font-medium">{media.title}</p>
          <p className="line-clamp-2 text-xs">{media.overview}</p>

          <div className="mt-1 flex flex-wrap gap-1">
            <Badge variant={"outline"}>
              <Calendar className="mr-1 size-2.5 stroke-primary" />
              {media.releaseDate.getFullYear()}
            </Badge>

            <Badge variant={"outline"}>
              <Star className="mr-1 size-2.5 fill-primary stroke-primary" />
              {media.tmdbRating.toFixed(0)}
            </Badge>

            <Badge variant={"outline"}>{media.type}</Badge>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default MediaHCard;
