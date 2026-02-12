import React from "react";
import { HeaderFontPreview } from "./headerFont";
import { FontList } from "./fontList";
import { FontPreviewProps } from "./fontPreviewProps";

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

  return <FontList title="Masterpieces Font Preview" data={fonts} />;
};
