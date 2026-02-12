import React from "react";
import { FontList } from "./fontList";

export const MasterPieceFont = () => {
  const fonts = [
    "MasterpieceCTL",
    "MasterpieceLakwel",
    "MasterpieceSpringRev",
    "MasterpieceStadium",
    "MasterpieceTawWin",
    "MasterpieceUniHand",
    "MasterpieceUniRound",
    "MasterpieceUniSerif",
    "MasterpieceUniType",
    "MasterpieceYayChanZin",
    "MasterpieceDaung",
    "MasterpieceDaungRound",
  ];

  return <FontList title="Masterpieces Font Preview" data={fonts} categoryKey="masterpiece" />;
};
