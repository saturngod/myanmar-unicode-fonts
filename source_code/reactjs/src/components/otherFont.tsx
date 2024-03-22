import React from "react";
import { HeaderFontPreview } from "./headerFont";
import { FontList } from "./fontList";
import {FontPreviewProps} from "./fontPreviewProps";

export const OtherFont= ({}) => {

    const fonts = [
        "Mon3",
        "Myanmar3",
        "MyanmarSansPro",
        "NotoSanMyanmar",
        "NotoSansMyanmarUI",
        "NotoSerifMyanmar",
        "Ours-Unicode",
        "Pyidaungsu",
        "Yunghkio",
        "MyMyanmarUniversal",
        "NotoZawDecode"
    ];

    return (
        <FontList title="Other Font Preview" data={fonts} />
    );
};
