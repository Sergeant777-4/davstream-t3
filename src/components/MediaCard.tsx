import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";

type Props = { data: Media };
const MediaCard = ({ data }: Props) => {
  return (
    <Link
      prefetch={false}
      className="group flex flex-col gap-1 rounded-md outline-none ring-ring focus-visible:ring-1"
      href={`/watch?id=${data.id}&type=${data.type}`}
    >
      <figure className="aspect-[3/4.5] w-full overflow-hidden rounded-md transition-all group-hover:-translate-y-1 group-focus:-translate-y-1">
        <Image
          className="size-full object-cover object-center"
          src={data.posterPath || "/poster.png"}
          title={data.title}
          alt={data.title}
          height={500}
          width={500}
          unoptimized
        />
      </figure>

      <div className="rounded-md bg-muted/25 px-2 py-1 text-xs">
        <p className="line-clamp-1 font-medium">{data.title}</p>
      </div>

      <div className="flex items-center gap-1">
        <Badge variant={"outline"}>
          <Star className="mr-1 size-2.5 fill-white stroke-white" />
          {data.tmdbRating.toFixed(0)}
        </Badge>

        <Badge variant={"outline"}>
          {data.type === "MOVIE" ? "Film" : "Serie"}
        </Badge>

        <Badge variant={"outline"}>
          {new Date(data.releaseDate).getFullYear()}
        </Badge>
      </div>
    </Link>
  );
};

export default MediaCard;
