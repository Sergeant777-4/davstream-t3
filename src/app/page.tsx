import mediaAction from "~/server/media/media_actions";
import MediaCard from "~/components/MediaCard";

const Home = async () => {
  const popular = await mediaAction.getPopular({ limit: 25, page: 1 });
  return (
    <div className="cartoon-grid p-4">
      {popular.map((item) => (
        <MediaCard key={item.id} data={item} />
      ))}
    </div>
  );
};

export default Home;
