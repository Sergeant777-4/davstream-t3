import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "~/components/ui/carousel";
import type { MediaSelectType } from "~/server/media/media_service";
import MediaCard from "./MediaCard";

type Props = {
  media: MediaSelectType[];
};

const MediaCarousel = ({ media }: Props) => {
  return (
    <Carousel opts={{ slidesToScroll: "auto" }}>
      <CarouselContent className="-ml-4">
        {media.map((item) => (
          <CarouselItem
            key={item.id}
            className="basis-[42%] pl-4 sm:basis-[24%] md:basis-[22%] lg:basis-[13%]"
          >
            <MediaCard data={item} />
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* <CarouselPrevious /> */}
      {/* <CarouselNext /> */}
    </Carousel>
  );
};

export default MediaCarousel;
