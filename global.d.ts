type IExtractedLink = {
  type: "embed" | "hls" | "direct";
  url: string;
  host: string;
  referer?: string;
};

type IFrembedMovieItem = {
  title: string;
  tmdb: string;
  imdb: string;
  year: string;
  quality: string;
  version: string;
  poster: string;
  link: string;
};

type IFrembedPopularMovieResponse = {
  status: number;
  result: {
    page: number;
    totalPages: number;
    "movies per page": number;
    "total movies": string;
    items: IFrembedMovieItem[];
  };
};

type ITmdbImagesResponse = {
  id: number;
  backdrops: {
    aspect_ratio: number;
    height: number;
    iso_639_1: string;
    file_path: string;
    vote_average: number;
    vote_count: number;
    width: number;
  }[];
  logos: {
    aspect_ratio: number;
    height: number;
    iso_639_1: string;
    file_path: string;
    vote_average: number;
    vote_count: number;
    width: number;
  }[];
  posters: {
    aspect_ratio: number;
    height: number;
    iso_639_1: string;
    file_path: string;
    vote_average: number;
    vote_count: number;
    width: number;
  }[];
};

type ExtractedLink = {
  type: "hls" | "direct" | "iframe";
  url: string;
  ref: string;
};
