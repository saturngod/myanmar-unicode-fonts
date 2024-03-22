import React from "react";
import { FontList } from "./fontList";

export const KhmerFont = ({}) => {

    const fonts = [
        "MyanmarAngoun",
        "MyanmarChatu",
        "MyanmarChatuLight",
        "MyanmarGantgaw",
        "MyanmarKhyay",
        "MyanmarKuttar",
        "MyanmarNayone",
        "MyanmarNjaun",
        "MyanmarPauklay",
        "MyanmarPhetsot",
        "MyanmarPhiksel",
        "MyanmarPhikselSmooth",
        "MyanmarPonenyet",
        "MyanmarSabae",
        "MyanmarSagar",
        "MyanmarSanpya",
        "MyanmarTagu",
        "MyanmarThuriya",
        "MyanmarWaso",
        "MyanmarYinmar"];

    return (
        <FontList title="Khmer Font Preview" data={fonts}/>
    );
};
