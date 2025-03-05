import type { WatchProvider } from "@prisma/client";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "~/components/ui/carousel";
import { Card } from "./ui/card";

type Props = {
  watchProviders: WatchProvider[];
};

const WatchProviderCarousel = ({ watchProviders }: Props) => {
  return (
    <Carousel opts={{ slidesToScroll: "auto" }}>
      <CarouselContent className="-ml-4">
        {watchProviders.map((item) => (
          <CarouselItem
            key={item.id}
            className="w-full basis-[42%] pl-4 sm:basis-[24%] md:basis-[22%] lg:basis-[14%]"
          >
            <Link href={`/watchProviders/${item.id}`}>
              <Card className="flex aspect-video h-24 w-full items-center justify-center text-balance bg-muted/50 p-4 text-center font-bold">
                {item.name}
              </Card>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* <CarouselPrevious /> */}
      {/* <CarouselNext /> */}
    </Carousel>
  );
};

export default WatchProviderCarousel;
