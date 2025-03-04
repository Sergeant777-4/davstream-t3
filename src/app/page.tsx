import MediaCard from "~/components/MediaCard";
import { getPopular } from "~/server/media/media_actions";

const Home = async () => {
  const data = await getPopular();

  return (
    <main className="container py-4">
      <div className="cartoon-grid">
        {data.results.map((item) => (
          <MediaCard key={item.id} data={item} />
        ))}
      </div>
    </main>
  );
};

export default Home;
