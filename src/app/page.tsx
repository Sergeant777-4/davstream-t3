import MediaCarousel from "~/components/MediaCarousel";
import WatchProviderCarousel from "~/components/WatchProviderCarousel";
import { getByCategory, getPopular } from "~/server/media/media_actions";
import { getAllWatchProviders } from "~/server/watchProvider/watchProvider_actions";

const Home = async () => {
  const popularData = await getPopular();
  const animeData = await getByCategory({ category: "ANIME" });
  const cartoonData = await getByCategory({ category: "CARTOON" });
  const watchProviders = await getAllWatchProviders();

  return (
    <main className="container flex flex-1 flex-col gap-4 py-4">
      <div className="space-y-2">
        <p className="text-lg font-bold">Plateformes</p>
        <WatchProviderCarousel watchProviders={watchProviders} />
      </div>

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
    </main>
  );
};

export default Home;
