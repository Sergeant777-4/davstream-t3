import MediaCarousel from "~/components/MediaCarousel";
import { getByCategory, getPopular } from "~/server/media/media_actions";

const Home = async () => {
  const popularData = await getPopular();
  const animeData = await getByCategory({ category: "ANIME" });
  const cartoonData = await getByCategory({ category: "CARTOON" });

  return (
    <main className="container flex flex-col gap-4 py-4">
      <div className="space-y-2">
        <p className="text-lg font-bold">Films Tendance</p>
        <MediaCarousel media={popularData.results} />
      </div>

      <div className="space-y-2">
        <p className="text-lg font-bold">Films Animes</p>
        <MediaCarousel media={animeData.results} />
      </div>

      <div className="space-y-2">
        <p className="text-lg font-bold">Films Dessins Animes</p>
        <MediaCarousel media={cartoonData.results} />
      </div>
      {/* <div className="cartoon-grid">
        {data.results.map((item) => (
          <MediaCard key={item.id} data={item} />
        ))}
      </div> */}
    </main>
  );
};

export default Home;
