export type FontCategoryKey =
  | 'khmer'
  | 'masterpiece'
  | 'phoenix-digital-art'
  | 'unknown'
  | 'other';

interface BaseFontDefinition {
  displayName: string;
  category: FontCategoryKey;
  filePath: string;
}

export interface FontDefinition extends BaseFontDefinition {
  id: string;
  cssFamily: string;
  previewFamily: string;
  downloadFileName: string;
}

export interface FontCategory {
  key: FontCategoryKey;
  title: string;
  description: string;
  fonts: FontDefinition[];
}

const CDN_BASE_URL = 'https://cdn.jsdelivr.net/gh/saturngod/myanmar-unicode-fonts@master/docs';

const CATEGORY_CSS_SUFFIX: Record<FontCategoryKey, string> = {
  khmer: 'KhmerType',
  masterpiece: 'Masterpiece',
  'phoenix-digital-art': 'PhoenixDigitalArt',
  unknown: 'UnknownAuthor',
  other: 'Other'
};

const BASE_CATEGORY_DATA: Array<Omit<FontCategory, 'fonts'> & { fonts: BaseFontDefinition[] }> = [
  {
    key: 'khmer',
    title: 'Khmer Type',
    description: 'Modern and legacy Unicode fonts from KhmerType collection.',
    fonts: [
      { displayName: 'MyanmarAngoun', category: 'khmer', filePath: '/KhmerType/MyanmarAngoun.ttf' },
      { displayName: 'MyanmarChatu', category: 'khmer', filePath: '/KhmerType/MyanmarChatu.ttf' },
      { displayName: 'MyanmarChatuLight', category: 'khmer', filePath: '/KhmerType/MyanmarChatuLight.ttf' },
      { displayName: 'MyanmarGantgaw', category: 'khmer', filePath: '/KhmerType/MyanmarGantgaw.ttf' },
      { displayName: 'MyanmarKhyay', category: 'khmer', filePath: '/KhmerType/MyanmarKhyay.ttf' },
      { displayName: 'MyanmarKuttar', category: 'khmer', filePath: '/KhmerType/MyanmarKuttar.ttf' },
      { displayName: 'MyanmarNayone', category: 'khmer', filePath: '/KhmerType/MyanmarNayone.ttf' },
      { displayName: 'MyanmarNjaun', category: 'khmer', filePath: '/KhmerType/MyanmarNjaun.ttf' },
      { displayName: 'MyanmarPauklay', category: 'khmer', filePath: '/KhmerType/MyanmarPauklay.ttf' },
      { displayName: 'MyanmarPhetsot', category: 'khmer', filePath: '/KhmerType/MyanmarPhetsot.ttf' },
      { displayName: 'MyanmarPhiksel', category: 'khmer', filePath: '/KhmerType/MyanmarPhiksel.ttf' },
      { displayName: 'MyanmarPhikselSmooth', category: 'khmer', filePath: '/KhmerType/MyanmarPhikselSmooth.ttf' },
      { displayName: 'MyanmarPonenyet', category: 'khmer', filePath: '/KhmerType/MyanmarPonenyet.ttf' },
      { displayName: 'MyanmarSabae', category: 'khmer', filePath: '/KhmerType/MyanmarSabae.ttf' },
      { displayName: 'MyanmarSagar', category: 'khmer', filePath: '/KhmerType/MyanmarSagar.ttf' },
      { displayName: 'MyanmarSanpya', category: 'khmer', filePath: '/KhmerType/MyanmarSanpya.ttf' },
      { displayName: 'MyanmarTagu', category: 'khmer', filePath: '/KhmerType/MyanmarTagu.ttf' },
      { displayName: 'MyanmarThuriya', category: 'khmer', filePath: '/KhmerType/MyanmarThuriya.ttf' },
      { displayName: 'MyanmarWaso', category: 'khmer', filePath: '/KhmerType/MyanmarWaso.ttf' },
      { displayName: 'MyanmarYinmar', category: 'khmer', filePath: '/KhmerType/MyanmarYinmar.ttf' }
    ]
  },
  {
    key: 'masterpiece',
    title: 'Masterpiece',
    description: 'Masterpiece Unicode fonts for display and body text.',
    fonts: [
      { displayName: 'MasterpieceCTL', category: 'masterpiece', filePath: '/masterpiece/MasterpieceCTL.ttf' },
      { displayName: 'MasterpieceLakwel', category: 'masterpiece', filePath: '/masterpiece/MasterpieceLakwel.ttf' },
      { displayName: 'MasterpieceSpringRev', category: 'masterpiece', filePath: '/masterpiece/MasterpieceSpringRev.ttf' },
      { displayName: 'MasterpieceStadium', category: 'masterpiece', filePath: '/masterpiece/MasterpieceStadium.ttf' },
      { displayName: 'MasterpieceTawWin', category: 'masterpiece', filePath: '/masterpiece/MasterpieceTawWin.ttf' },
      { displayName: 'MasterpieceUniHand', category: 'masterpiece', filePath: '/masterpiece/MasterpieceUniHand.ttf' },
      { displayName: 'MasterpieceUniRound', category: 'masterpiece', filePath: '/masterpiece/MasterpieceUniRound.ttf' },
      { displayName: 'MasterpieceUniSerif', category: 'masterpiece', filePath: '/masterpiece/MasterpieceUniSerif.ttf' },
      { displayName: 'MasterpieceUniType', category: 'masterpiece', filePath: '/masterpiece/MasterpieceUniType.ttf' },
      { displayName: 'MasterpieceYayChanZin', category: 'masterpiece', filePath: '/masterpiece/MasterpieceYayChanZin.ttf' },
      { displayName: 'MasterpieceDaung', category: 'masterpiece', filePath: '/masterpiece/MasterpieceDaung.ttf' },
      { displayName: 'MasterpieceDaungRound', category: 'masterpiece', filePath: '/masterpiece/MasterpieceDaungRound.ttf' }
    ]
  },
  {
    key: 'phoenix-digital-art',
    title: 'Phoenix Digital Art',
    description: 'Special purpose font releases from Phoenix Digital Art.',
    fonts: [
      { displayName: 'ThitSarShweSi', category: 'phoenix-digital-art', filePath: '/PhoenixDigitalArt/ThitSarShweSi.ttf' }
    ]
  },
  {
    key: 'unknown',
    title: 'Unknown Author',
    description: 'Community fonts with unknown or mixed attribution.',
    fonts: [
      { displayName: 'CherryUnicode', category: 'unknown', filePath: '/unknown/CherryUnicode.ttf' },
      { displayName: 'Kamjing', category: 'unknown', filePath: '/unknown/Kamjing.ttf' },
      { displayName: 'MyanmarBlack', category: 'unknown', filePath: '/unknown/MyanmarBlack.ttf' },
      { displayName: 'MyanmarHeadOne', category: 'unknown', filePath: '/unknown/MyanmarHeadOne.ttf' },
      { displayName: 'MyanmarSquare', category: 'unknown', filePath: '/unknown/MyanmarSquare.ttf' },
      { displayName: 'MyanmarSquareLight', category: 'unknown', filePath: '/unknown/MyanmarSquareLight.ttf' },
      { displayName: 'NKSSmart2', category: 'unknown', filePath: '/unknown/NKSSmart2.ttf' },
      { displayName: 'NKSSmart3', category: 'unknown', filePath: '/unknown/NKSSmart3.ttf' },
      { displayName: 'NKSSmart4', category: 'unknown', filePath: '/unknown/NKSSmart4.ttf' },
      { displayName: 'NamKhoneUnicode', category: 'unknown', filePath: '/unknown/NamKhoneUnicode.ttf' },
      { displayName: 'Yangon', category: 'unknown', filePath: '/unknown/Yangon.ttf' },
      { displayName: 'YoeYar-One', category: 'unknown', filePath: '/unknown/YoeYar-One.ttf' },
      { displayName: 'MyanmarAngoun', category: 'unknown', filePath: '/unknown/MyanmarAngoun.ttf' },
      { displayName: 'MyanmarSabae', category: 'unknown', filePath: '/unknown/MyanmarSabae.ttf' },
      { displayName: 'MyanmarSansPro', category: 'unknown', filePath: '/unknown/MyanmarSansPro.ttf' }
    ]
  },
  {
    key: 'other',
    title: 'Other Fonts',
    description: 'Additional Myanmar Unicode families from multiple sources.',
    fonts: [
      { displayName: 'Mon3', category: 'other', filePath: '/other/Mon3.ttf' },
      { displayName: 'Myanmar3', category: 'other', filePath: '/other/Myanmar3.TTF' },
      { displayName: 'MyanmarSansPro', category: 'other', filePath: '/other/MyanmarSansPro.ttf' },
      { displayName: 'NotoSanMyanmar', category: 'other', filePath: '/other/NotoSanMyanmar.ttf' },
      { displayName: 'NotoSansMyanmarUI', category: 'other', filePath: '/other/NotoSansMyanmarUI.ttf' },
      { displayName: 'NotoZawDecode', category: 'other', filePath: '/other/NotoSansMyanmarUI-Regular-ZawDecode.ttf' },
      { displayName: 'NotoSerifMyanmar', category: 'other', filePath: '/other/NotoSerifMyanmar.ttf' },
      { displayName: 'Ours-Unicode', category: 'other', filePath: '/other/Ours-Unicode.ttf' },
      { displayName: 'Pyidaungsu', category: 'other', filePath: '/other/Pyidaungsu.ttf' },
      { displayName: 'Yunghkio', category: 'other', filePath: '/other/Yunghkio.ttf' },
      { displayName: 'MyMyanmarUniversal', category: 'other', filePath: '/other/MyMyanmarUniversal.ttf' }
    ]
  }
];

const normalizeForFamily = (value: string): string =>
  value
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const fileNameFromPath = (filePath: string): string => {
  const parts = filePath.split('/');
  return parts[parts.length - 1] || 'font.ttf';
};

const allBaseFonts = BASE_CATEGORY_DATA.flatMap(category => category.fonts);
const duplicateNameSet = new Set(
  Object.entries(
    allBaseFonts.reduce<Record<string, number>>((acc, font) => {
      acc[font.displayName] = (acc[font.displayName] || 0) + 1;
      return acc;
    }, {})
  )
    .filter(([, count]) => count > 1)
    .map(([name]) => name)
);

const enrichFont = (font: BaseFontDefinition): FontDefinition => {
  const suffix = CATEGORY_CSS_SUFFIX[font.category];
  const cssFamily = duplicateNameSet.has(font.displayName)
    ? `${font.displayName}-${suffix}`
    : font.displayName;

  return {
    ...font,
    id: `${font.category}:${font.displayName}`,
    cssFamily,
    previewFamily: `MMFont-${normalizeForFamily(cssFamily)}`,
    downloadFileName: fileNameFromPath(font.filePath)
  };
};

export const fontCatalog: FontCategory[] = BASE_CATEGORY_DATA.map(category => ({
  key: category.key,
  title: category.title,
  description: category.description,
  fonts: category.fonts.map(enrichFont)
}));

export const allFonts: FontDefinition[] = fontCatalog.flatMap(category => category.fonts);

export const getFontsByCategory = (categoryKey: FontCategoryKey): FontDefinition[] =>
  fontCatalog.find(category => category.key === categoryKey)?.fonts ?? [];

export const getCdnFontUrl = (filePath: string): string => {
  const normalizedPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
  return `${CDN_BASE_URL}${normalizedPath}`;
};

export const getPublicFontUrl = (filePath: string): string => {
  const normalizedPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
  const basePath = process.env.PUBLIC_URL || '';
  return `${basePath}${normalizedPath}`;
};
