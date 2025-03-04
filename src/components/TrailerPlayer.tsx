"use client";
import ReactPlayer from "react-player";
import { Card } from "./ui/card";

type Props = {
  url: string;
};

const TrailerPlayer = ({ url }: Props) => {
  return (
    <Card className="aspect-video w-full overflow-hidden">
      <ReactPlayer width="100%" height="100%" url={url} />
    </Card>
  );
};

export default TrailerPlayer;
