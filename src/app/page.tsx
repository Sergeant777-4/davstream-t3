import MediaCard from "~/components/MediaCard";
import { getPopular } from "~/server/media/media_actions";

const Home = async () => {
  const popular = await getPopular({ limit: 25, page: 1 });
  return (
    <main className="container py-4">
      <div className="cartoon-grid">
        {popular.map((item) => (
          <MediaCard key={item.id} data={item} />
        ))}
      </div>
    </main>
  );
};

export default Home;
