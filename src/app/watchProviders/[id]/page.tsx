import { notFound } from "next/navigation";
import { z } from "zod";
import MediaCard from "~/components/MediaCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { getMediaByWatchProviders } from "~/server/media/media_actions";

const searchParamsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
});

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<z.infer<typeof searchParamsSchema>>;
};

const WatchProvidersMovies = async ({ params, searchParams }: Props) => {
  const valid = searchParamsSchema.safeParse(await searchParams);
  if (!valid.success) notFound();

  const id = Number((await params).id);
  const data = await getMediaByWatchProviders({ id, page: valid.data.page });

  return (
    <div className="container flex flex-1 flex-col gap-4 py-4">
      <p className="text-2xl font-bold">
        Tout le catalogue de {data.watchProvider?.name}
      </p>

      <div className="cartoon-grid">
        {data?.results.map((item) => <MediaCard key={item.id} data={item} />)}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={valid.data.page > 1 ? `?page=${valid.data.page - 1}` : "#"}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">{valid.data.page}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href={
                valid.data.page < data.totalPages
                  ? `?page=${valid.data.page + 1}`
                  : "#"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default WatchProvidersMovies;
