import React from "react";
import { HeaderFontPreview } from "./headerFont";
import { FontList } from "./fontList";
import {FontPreviewProps} from "./fontPreviewProps";

export const UnknwonFont  = ({}) => {

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
        <FontList title="Unknown Author Font Preview" data={fonts}/>
    );
};
