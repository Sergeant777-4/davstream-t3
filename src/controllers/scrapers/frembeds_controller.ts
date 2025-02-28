import mediaService from "#services/database/media_service";
import frembed from "#services/utils/frembed_service";
import tmdbService from "#services/utils/tmdb_service";
import { Prisma } from "@prisma/client";
import _ from "lodash";

export default class FrembedsController {
  scrapeMovies = async () => {
    const results = [];
    const totalPages = 109;

    for (let page = 1; page < totalPages; page++) {
      console.log(`Page ${page}/${totalPages}`);
      const movies = await frembed.getMovies(page);

      const newMoviesPromise = movies.map(async (movie) => {
        const tmdbId = Number(movie.tmdb);
        const tmdbData = await tmdbService.getMovieDetails(tmdbId);

        // Extract movie data
        const alternativeTitles = tmdbData.alternative_titles.titles
          .map((i) => i.title)
          .join(",");
        const category = tmdbService.getMediaCategory(
          tmdbData.genres,
          tmdbData.keywords,
        );
        const trailerUrl = tmdbService.getTrailerUrl(tmdbData.videos);
        const logoPath = await tmdbService.getMovieLogo(tmdbData.id);
        const collection = await tmdbService.getCollection(
          tmdbData.belongs_to_collection?.id,
        );
        const recommendationsIds = tmdbData.recommendations.results
          .filter((item) => item.id !== tmdbId)
          .map((item) => item.id);
        const similarIds = tmdbData.similar.results
          .filter((item) => item.id !== tmdbId)
          .map((item) => item.id);
        const flatrate = tmdbService.getWatchProviders(
          tmdbData["watch/providers"],
        );

        // Upsert media
        const mediaData = {
          releaseDate: new Date(tmdbData.release_date),
          originalTitle: tmdbData.original_title,
          tmdbRating: tmdbData.vote_average,
          popularity: tmdbData.popularity,
          overview: tmdbData.overview,
          duration: tmdbData.runtime,
          tagline: tmdbData.tagline,
          imdbId: tmdbData.imdb_id,
          isAdult: tmdbData.adult,
          title: tmdbData.title,
          genres: {
            connectOrCreate: tmdbData.genres.map((genre) => ({
              create: {
                slug: _.kebabCase(genre.name),
                name: genre.name,
                tmdbId: genre.id,
              },
              where: { slug: _.kebabCase(genre.name) },
            })),
          },
          ...(collection && {
            collection: {
              connectOrCreate: {
                where: {
                  tmdbId: collection.id,
                },
                create: {
                  backdropPath:
                    tmdbService.IMAGE_BASE_URL + collection.backdrop_path,
                  posterPath:
                    tmdbService.IMAGE_BASE_URL + collection.poster_path,
                  name: collection.name,
                  tmdbId: collection.id,
                  overview: collection.overview,
                },
              },
            },
          }),
          recommendations: { set: recommendationsIds },
          similars: { set: similarIds },
          players: {
            connectOrCreate: movie.embedLinks.map((player) => ({
              where: { url: player.url },
              create: {
                url: player.url,
                host: new URL(player.url).hostname,
                language: player.language,
              },
            })),
          },
          watchProviders: {
            connectOrCreate: flatrate.map((item) => ({
              where: { slug: _.kebabCase(item.provider_name) },
              create: {
                name: item.provider_name,
                slug: _.kebabCase(item.provider_name),
                tmdbId: item.provider_id,
                priority: item.display_priority,
                logoPath: tmdbService.IMAGE_BASE_URL + item.logo_path,
              },
            })),
          },
          alternativeTitles,
          posterPath:
            tmdbData.poster_path &&
            tmdbService.IMAGE_BASE_URL + tmdbData.poster_path,
          backdropPath:
            tmdbData.backdrop_path &&
            tmdbService.IMAGE_BASE_URL + tmdbData.backdrop_path,
          status: "ENDED",
          type: "MOVIE",
          trailerUrl,
          logoPath,
          category,
          tmdbId,
        } satisfies Prisma.MediaCreateInput;
        const newMovie = await mediaService.upsert(mediaData);
        if (!newMovie) throw new Error(`Media not upserted ${mediaData}`);

        return { newMovie };
      });

      const result = await Promise.all(newMoviesPromise);
      results.push(...result);
    }

    return results;
  };
}
