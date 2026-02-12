import React from "react";
import { FontList } from "./fontList";

export const OtherFont: React.FC = () => {

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
        <FontList title="Other Font Preview" data={fonts} categoryKey="other" />
    );
};
