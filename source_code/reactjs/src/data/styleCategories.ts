export interface StyleCategory {
  name: string;
  fonts: string[];
}

// Style categories reference fonts by displayName. Names are matched after
// stripping whitespace so "Noto Sans" and "NotoSans" compare equal. This is the
// ONE place that normalization lives — used by both the sidebar counts and the
// main content filter.
export const normalizeFontName = (name: string): string => name.replace(/\s+/g, "");

// The set of normalized font names allowed by a style category.
// Returns null for "all", an unknown name, or empty input = "no restriction".
export const getStyleAllowedNames = (
  styleCategoryName: string | undefined,
): Set<string> | null => {
  if (!styleCategoryName || styleCategoryName === "all") return null;
  const styleCat = fontStyleCategories.find((c) => c.name === styleCategoryName);
  if (!styleCat) return null;
  return new Set(styleCat.fonts.map(normalizeFontName));
};

export const fontStyleCategories: StyleCategory[] = [
  {
    name: "Handwritten / Script",
    fonts: [
      "ThitSarShweSi",
      "MasterpieceLakwel",
      "MasterpieceUniHand",
      "MasterpieceYayChanZin",
      "Aka05-Regular",
      "Aka09-Regular",
    ],
  },
  {
    name: "Sans-Serif / Clean UI",
    fonts: [
      "MyanmarAngoun",
      "MyanmarGantgaw",
      "MyanmarNayone",
      "MyanmarNjaun",
      "MyanmarPauklay",
      "MyanmarPhetsot",
      "MyanmarSabae",
      "MyanmarSagar",
      "MyanmarSanpya",
      "MyanmarTagu",
      "MyanmarThuriya",
      "MyanmarWaso",
      "MyanmarYinmar",
      "MyanmarSansPro",
      "Myanmar3",
      "NotoSanMyanmar",
      "NotoSansMyanmarUI",
      "NotoZawDecode",
      "Pyidaungsu",
      "Ours-Unicode",
      "Yunghkio",
      "MyMyanmarUniversal",
      "Mon3",
      "NamKhoneUnicode",
      "NKSSmart2",
      "NKSSmart3",
      "NKSSmart4",
      "CherryUnicode",
      "Kamjing",
      "Yangon",
      "Aka01-Bold",
      "Aka01-Medium",
      "Aka01-Regular",
      "Aka011-Bold",
      "Aka011-Light",
      "Aka011-Regular",
    ],
  },
  {
    name: "Serif / Traditional",
    fonts: ["MasterpieceTawWin", "MasterpieceUniSerif", "NotoSerifMyanmar"],
  },
  {
    name: "Rounded",
    fonts: ["MasterpieceUniRound", "MasterpieceDaungRound", "Aka10-Light"],
  },
  {
    name: "Square / Blocky",
    fonts: [
      "MyanmarChatu",
      "MyanmarChatuLight",
      "MyanmarKhyay",
      "MyanmarKuttar",
      "MyanmarPonenyet",
      "MyanmarSquare",
      "MyanmarSquareLight",
      "Aka06-Regular",
    ],
  },
  {
    name: "Typewriter / Monospaced",
    fonts: ["MasterpieceUniType"],
  },
  {
    name: "Display / Decorative",
    fonts: [
      "MasterpieceCTL",
      "MasterpieceSpringRev",
      "MasterpieceStadium",
      "MasterpieceDaung",
      "MyanmarPhiksel",
      "MyanmarBlack",
      "MyanmarHeadOne",
      "YoeYar-One",
      "OneTypeChiangMai",
      "OneTypeMMDot",
      "Aka02-Regular",
      "Aka03-Regular",
      "Aka08-Regular",
    ],
  },
];
