"use client";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";

import React from "react";

type Props = { url?: string };

const Player = ({ url }: Props) => {
  return (
    <MediaPlayer title="Player" src={url}>
      <MediaProvider />
      <DefaultVideoLayout icons={defaultLayoutIcons} />
    </MediaPlayer>
  );
};

export default Player;
