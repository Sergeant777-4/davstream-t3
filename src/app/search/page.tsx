import React from "react";
import MediaCard from "~/components/MediaCard";
import { Input } from "~/components/ui/input";
import { searchMedia } from "~/server/media/media_actions";

type Props = {
  searchParams: Promise<{
    query?: string;
  }>;
};

const SearchPage = async ({ searchParams }: Props) => {
  const query = (await searchParams).query;
  const data = query && (await searchMedia({ query }));

  return (
    <main className="container flex flex-col gap-2 py-2">
      <form action="#">
        <Input
          placeholder="Recherche"
          name="query"
          required
          min={1}
          minLength={1}
        />
      </form>

      <div className="cartoon-grid">
        {data &&
          data.results.map((item) => <MediaCard key={item.id} data={item} />)}
      </div>
    </main>
  );
};

export default SearchPage;
