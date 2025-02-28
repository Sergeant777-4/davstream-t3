import type { CategoryEnum } from "@prisma/client";
import {
  type Genre,
  type Keywords,
  TMDB,
  type Videos,
  type WatchProviders,
} from "tmdb-ts";
import { env } from "~/env";

class TmdbService {
  IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";
  tmdbts = new TMDB(env.TMDB_TOKEN);

  getMovieDetails = async (tmdbId: number) => {
    return this.tmdbts.movies.details(
      tmdbId,
      [
        "images",
        "videos",
        "watch/providers",
        "alternative_titles",
        "videos",
        "release_dates",
        "keywords",
        "credits",
        "recommendations",
        "similar",
      ],
      "fr-FR",
    );
  };

  getSerieDetails = async (tmdbId: number) => {
    return this.tmdbts.tvShows.details(
      tmdbId,
      [
        "images",
        "videos",
        "watch/providers",
        "alternative_titles",
        "videos",
        "keywords",
        "recommendations",
        "external_ids",
        "content_ratings",
        "credits",
      ],
      "fr-FR",
    );
  };

  getTrailerUrl = (videosData: Omit<Videos, "id">) => {
    const videos = videosData.results;

    // Filter videos
    const filterByType = videos.filter((i) => /trailer/i.exec(i.type));
    const filterBySite = filterByType.filter((i) => /youtube/i.exec(i.site));

    // Get video key
    const videoKey = filterBySite?.[0]?.key;
    return videoKey && `https://www.youtube.com/watch?v=${videoKey}`;
  };

  getMediaCategory = (
    genres: Genre[],
    keywordsData: Omit<Keywords, "id">,
  ): CategoryEnum | undefined => {
    const keywords = keywordsData.keywords;

    // Declare genres' ids
    const animationTmdbId = 16;
    const documentaryId = 99;
    const dramaId = 18;

    // Declare keywords' ids
    const animeKeyword = 210024;
    const kdramaKeyword = 318386;

    const genreIds = genres.map((item) => item.id);
    const keywordIds = keywords.map((item) => item.id);

    const isDocumentary = genreIds.includes(documentaryId);
    const isAnimation = genreIds.includes(animationTmdbId);
    const isAnime = keywordIds.includes(animeKeyword);
    const isDrama =
      genreIds.includes(dramaId) && keywordIds.includes(kdramaKeyword);

    if (isDrama) return "KDRAMA";
    if (isDocumentary) return "DOCUMENTARY";
    if (isAnimation) {
      if (isAnime) return "ANIME";
      return "CARTOON";
    }
  };

  getMovieLogo = async (tmdbId: number) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${tmdbId}/images?include_image_language=en%2Cfr&language=fr`,
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5Yjc2MTEzMGRkNDI4YWNhMTgxNmRhZWIwYjMwNjUxOSIsIm5iZiI6MTY0Nzk5MjgyMi44NzgsInN1YiI6IjYyM2E1ZmY2ZTk0MmJlMDA1YzgzZjcwYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.wLfcu17_p7A6pQFAkfbxDBTrmGbTRhF_4lyhMbHZSp4",
          accept: "application/json",
        },
      },
    );
    const data = (await response.json()) as ITmdbImagesResponse;
    const logos = data.logos;

    const filteredLogos = logos.filter(
      (i) => i.iso_639_1 === "fr" || i.iso_639_1 === "en",
    );
    const logoPath = filteredLogos?.[0]?.file_path;

    if (!logoPath) return null;
    return this.IMAGE_BASE_URL + logoPath;
  };

  getWatchProviders = (watchProvidersData: Omit<WatchProviders, "id">) => {
    const watchProviders = watchProvidersData.results;
    const flatrates = [
      ...(watchProviders?.FR?.flatrate || []),
      ...(watchProviders?.CA?.flatrate || []),
      ...(watchProviders?.US?.flatrate || []),
    ];
    return flatrates;
  };

  getCollection = async (id?: number) => {
    if (!id) return null;
    return await this.tmdbts.collections.details(id, { language: "fr-FR" });
  };
}

const tmdbService = new TmdbService();
export default tmdbService;
