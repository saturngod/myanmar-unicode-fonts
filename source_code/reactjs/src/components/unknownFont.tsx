import React from "react";
import { FontList } from "./fontList";

export const UnknwonFont: React.FC = () => {

    const fonts = [
        "CherryUnicode",
            "Kamjing",
            "MyanmarBlack",
            "MyanmarHeadOne",
            "MyanmarSquare",
            "MyanmarSquareLight",
            "NKSSmart2",
            "NKSSmart3",
            "Yangon",
            "YoeYar-One",
            "MyanmarAngoun",
            "MyanmarSabae",
            "MyanmarSansPro"
    ];

    return (
        <FontList title="Unknown Author Font Preview" data={fonts} categoryKey="unknown" />
    );
};
