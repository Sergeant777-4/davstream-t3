import { db } from "../db";

class WatchProviderService {
  getAll = async ({ take }: { take: number }) => {
    const providers = await db.watchProvider.findMany({
      orderBy: { priority: "asc" },
      take,
    });
    return providers;
  };

  getDetails = async (id: number) => {
    return await db.watchProvider.findUnique({
      include: {
        media: { take: 27 },
      },
      where: { id },
    });
  };
}

const watchProviderService = new WatchProviderService();
export default watchProviderService;
