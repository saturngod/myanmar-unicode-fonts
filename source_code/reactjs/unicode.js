/**
 * Myanmar Font Language Detector — Node.js (opentype.js)
 *
 * Detects which Myanmar languages a given font file (.ttf/.otf) supports by
 * checking the font's real glyph coverage (cmap table) for the
 * language-specific Unicode codepoints of each script.
 *
 * Usage (CLI):
 *   node unicode.js ./MyanmarAngoun.ttf
 *
 * Usage (module):
 *   const { detectMyanmarFontSupport, printReport } = require("./unicode.js");
 *   const report = detectMyanmarFontSupport("./MyanmarAngoun.ttf");
 *   printReport(report);
 */

const fs = require("fs");
const opentype = require("opentype.js");

// ─── Language Definitions ────────────────────────────────────────────────────
// Each language lists key Unicode codepoints that are unique to that script.
// A font must render these differently from the fallback font to "support" them.

const MYANMAR_LANGUAGES = [
  {
    id: "burmese",
    name: "Burmese (Bamar)",
    block: "Myanmar U+1000–U+109F",
    chars: [
      "\u1000", "\u1001", "\u1002", "\u1003", "\u1004", // က ခ ဂ ဃ င
      "\u1005", "\u1006", "\u1007", "\u1008", "\u100A", // စ ဆ ဇ ဈ ည
      "\u100F", "\u1010", "\u1011", "\u1012", "\u1013", // ဏ တ ထ ဒ ဓ
      "\u1014", "\u1015", "\u1016", "\u1017", "\u1018", // န ပ ဖ ဗ ဘ
      "\u1019", "\u101A", "\u101B", "\u101C", "\u101D", // မ ယ ရ လ ဝ
      "\u101E", "\u101F", "\u1020", "\u1021",           // သ ဟ ဠ အ
    ],
    note: "Core Myanmar block used by all Burmese-script languages.",
  },
  {
    id: "mon",
    name: "Mon",
    block: "Myanmar U+105A–U+1060",
    chars: [
      "\u105A", "\u105B", "\u105C", "\u105D", // ၚ ၛ ၜ ၝ  Mon letters: NGA JHA BBA BBE
      "\u105E", "\u105F", "\u1060",            // ၞ ၟ ၠ  Mon medials: NA MA LA
    ],
    note: "Mon-specific letters/medials (U+105A–U+1060). U+1061–U+1070 are Karen, not Mon.",
  },
  {
    id: "shan",
    name: "Shan",
    block: "Myanmar Extended-A U+AA60–U+AA6F",
    chars: [
      "\uAA60", "\uAA61", "\uAA62", "\uAA63", "\uAA64", // ꩠ ꩡ ꩢ ꩣ ꩤ
      "\uAA65", "\uAA66", "\uAA67", "\uAA68", "\uAA69", // ꩥ ꩦ ꩧ ꩨ ꩩ
      "\uAA6A", "\uAA6B", "\uAA6C", "\uAA6D", "\uAA6E", // ꩪ ꩫ ꩬ ꩭ ꩮ
      "\uAA6F",                                          // ꩯ
    ],
    note: "Myanmar Extended-A block. Requires extended font coverage.",
  },
  {
    id: "rakhine",
    name: "Rakhine (Arakanese)",
    block: "Myanmar U+1090–U+109F",
    chars: [
      "\u1090", "\u1091", "\u1092", "\u1093", "\u1094", // ႐ ႑ ႒ ႓ ႔
      "\u1095", "\u1096", "\u1097", "\u1098", "\u1099", // ႕ ႖ ႗ ႘ ႙
    ],
    note: "Uses Myanmar digit alternates (U+1090–U+109F) distinct from core digits.",
  },
  {
    id: "karen",
    name: "Karen (S'gaw/Pwo)",
    block: "Myanmar U+108B–U+108F",
    chars: [
      "\u108B", "\u108C", "\u108D", "\u108E", "\u108F", // ႋ ႌ ႍ ႎ ႏ
      "\u1080", "\u1081", "\u1082", "\u1083", "\u1084", // က ခ ဂ ဃ  (subset)
    ],
    note: "Uses specific combining marks and consonants in U+108x range.",
  },
  {
    id: "pao",
    name: "Pao (Pa'O)",
    block: "Myanmar Extended-A U+AA70–U+AA7A",
    chars: [
      "\uAA70", "\uAA71", "\uAA72", "\uAA73", "\uAA74", // ꩰ ꩱ ꩲ ꩳ ꩴ
      "\uAA75", "\uAA76", "\uAA7A",                      // ꩵ ꩶ ꩺ
    ],
    note: "Upper section of Myanmar Extended-A block.",
  },
  {
    id: "tailaing",
    name: "Tai Laing",
    block: "Myanmar Extended-B U+A9E0–U+A9FE",
    chars: [
      "\uA9E0", "\uA9E1", "\uA9E2", "\uA9E3", "\uA9E4", // ꧠ ꧡ ꧢ ꧣ ꧤ
      "\uA9E5", "\uA9E6", "\uA9E7", "\uA9E8", "\uA9E9", // ꧥ ꧦ ꧧ ꧨ ꧩ
      "\uA9EA", "\uA9EB", "\uA9EC", "\uA9ED", "\uA9EE", // ꧪ ꧫ ꧬ ꧭ ꧮ
    ],
    note: "Myanmar Extended-B block. Few fonts support this.",
  },
  {
    id: "kayahli",
    name: "Kayah Li",
    block: "Kayah Li U+A90A–U+A92D",
    chars: [
      "\uA90A", "\uA90B", "\uA90C", "\uA90D", "\uA90E", // ꤊ ꤋ ꤌ ꤍ ꤎ
      "\uA90F", "\uA910", "\uA911", "\uA912", "\uA913", // ꤏ ꤐ ꤑ ꤒ ꤓ
      "\uA914", "\uA915", "\uA916", "\uA917", "\uA918", // ꤔ ꤕ ꤖ ꤗ ꤘ
    ],
    note: "Separate Kayah Li Unicode block (not Myanmar proper).",
  },
  {
    id: "khamti",
    name: "Khamti (Tai Khamti)",
    block: "Myanmar Extended-A U+AA60+",
    chars: [
      "\uAA60", "\uAA61", "\uAA62", "\uAA63", "\uAA64",
      "\uAA6B", "\uAA6C", "\uAA6D", "\uAA6E", "\uAA6F",
    ],
    note: "Shares Myanmar Extended-A block with Shan; distinct usage patterns.",
  },
];

// ─── Thresholds ───────────────────────────────────────────────────────────────
const THRESHOLD = {
  SUPPORTED: 0.75,  // ≥75% of chars render differently → "supported"
  PARTIAL: 0.35,  // ≥35% → "partial"
  // below 35% → "unsupported"
};

// ─── Core Detection (opentype.js) ─────────────────────────────────────────────

/**
 * Loads a font file and returns a glyph tester backed by the font's cmap.
 * @param {string} fontPath - path to a .ttf/.otf file
 * @returns {{ font: opentype.Font, hasGlyph: (char: string) => boolean }}
 */
function createGlyphTester(fontPath) {
  const buf = fs.readFileSync(fontPath);
  const font = opentype.parse(
    buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
  );

  // The font's .notdef (glyph 0) outline — the canonical "missing glyph" box.
  let notdefFingerprint = null;
  try {
    notdefFingerprint = font.glyphs.get(0).getPath(0, 0, 100).toPathData(1);
  } catch {
    /* some fonts have an empty .notdef */
  }

  return {
    font,
    notdefFingerprint,
    /**
     * Returns true if the font actually contains a glyph for this character.
     * charToGlyphIndex returns 0 (.notdef) when the codepoint is unmapped.
     */
    hasGlyph(char) {
      return font.charToGlyphIndex(char) !== 0;
    },
    /**
     * Returns the glyph's outline as a stable fingerprint string, so we can tell
     * a real letter from a reused "tofu" placeholder box. `empty` is true when the
     * glyph has no contours (e.g. space or a blank stand-in).
     */
    glyphInfo(char) {
      const index = font.charToGlyphIndex(char);
      if (index === 0) return { index, fingerprint: null, empty: true };
      try {
        const path = font.charToGlyph(char).getPath(0, 0, 100);
        return { index, fingerprint: path.toPathData(1), empty: path.commands.length === 0 };
      } catch {
        return { index, fingerprint: null, empty: true };
      }
    },
  };
}

// ─── Main API ────────────────────────────────────────────────────────────────

/**
 * Detects Myanmar language support for a given font file.
 *
 * @param {string} fontPath  - path to a .ttf/.otf file
 * @param {Object} [options]
 * @param {string[]} [options.only]  - Limit to specific language IDs
 * @returns {MyanmarFontReport}
 */
function detectMyanmarFontSupport(fontPath, options = {}) {
  const tester = createGlyphTester(fontPath);
  const names = tester.font.names || {};
  const nameRecord =
    (names.unicode && names.unicode.fullName) ||
    (names.macintosh && names.macintosh.fullName) ||
    (names.windows && names.windows.fullName) ||
    names.fullName ||
    {};
  const fontName = nameRecord.en || Object.values(nameRecord)[0] || fontPath;
  const languages = options.only
    ? MYANMAR_LANGUAGES.filter((l) => options.only.includes(l.id))
    : MYANMAR_LANGUAGES;

  // First pass: fingerprint every tested codepoint across ALL languages so we can
  // detect "tofu" fonts. Such fonts map unsupported scripts to a placeholder box
  // glyph that has real contours (so a plain cmap check is fooled). We flag any
  // outline that is the .notdef box or is reused across several distinct
  // codepoints, and treat those codepoints as unsupported.
  const PLACEHOLDER_REUSE = 3; // same outline on ≥3 distinct codepoints = placeholder
  const infoByChar = new Map();
  const fingerprintCounts = new Map();
  for (const lang of MYANMAR_LANGUAGES) {
    for (const char of lang.chars) {
      if (infoByChar.has(char)) continue; // count each codepoint once
      const info = tester.glyphInfo(char);
      infoByChar.set(char, info);
      if (info.fingerprint) {
        fingerprintCounts.set(info.fingerprint, (fingerprintCounts.get(info.fingerprint) || 0) + 1);
      }
    }
  }
  const isPlaceholder = (fp) =>
    !fp || fp === tester.notdefFingerprint || (fingerprintCounts.get(fp) || 0) >= PLACEHOLDER_REUSE;
  const isCharSupported = (char) => {
    const info = infoByChar.get(char);
    return info.index !== 0 && !info.empty && !isPlaceholder(info.fingerprint);
  };

  const languageResults = languages.map((lang) => {
    const charResults = lang.chars.map((char) => ({
      char,
      codepoint: `U+${char.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")}`,
      supported: isCharSupported(char),
    }));

    const supportedCount = charResults.filter((c) => c.supported).length;
    const coverage = supportedCount / charResults.length;
    const status =
      coverage >= THRESHOLD.SUPPORTED ? "supported" :
        coverage >= THRESHOLD.PARTIAL ? "partial" :
          "unsupported";

    return {
      id: lang.id,
      name: lang.name,
      block: lang.block,
      note: lang.note,
      status,
      coverage: Math.round(coverage * 100),
      supported: supportedCount,
      total: charResults.length,
      chars: charResults,
    };
  });

  const supported = languageResults.filter((l) => l.status === "supported");
  const partial = languageResults.filter((l) => l.status === "partial");
  const unsupported = languageResults.filter((l) => l.status === "unsupported");

  return {
    font: fontName,
    testedAt: new Date().toISOString(),
    summary: {
      supported: supported.length,
      partial: partial.length,
      unsupported: unsupported.length,
      total: languageResults.length,
    },
    languages: languageResults,
  };
}

/**
 * Prints a readable report to the console.
 * @param {MyanmarFontReport} report
 */
function printReport(report) {
  const icon = { supported: "✅", partial: "🟡", unsupported: "❌" };
  console.log(`\n━━━ Myanmar Font Support: "${report.font}" ━━━`);
  console.log(`Tested: ${report.testedAt}`);
  console.log(
    `Summary: ${report.summary.supported} supported | ` +
    `${report.summary.partial} partial | ` +
    `${report.summary.unsupported} unsupported\n`
  );
  for (const lang of report.languages) {
    console.log(
      `${icon[lang.status]} ${lang.name.padEnd(22)} ` +
      `[${lang.block}]  ` +
      `${lang.coverage}% (${lang.supported}/${lang.total} chars)`
    );
  }
  console.log("");
}

// ─── CLI ──────────────────────────────────────────────────────────────────────

function main() {
  const fontPath = process.argv[2];
  if (!fontPath) {
    console.error("Usage: node unicode.js <path-to-font.ttf>");
    process.exit(1);
  }
  try {
    const report = detectMyanmarFontSupport(fontPath);
    printReport(report);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

// Run only when invoked directly (node unicode.js ...), not when require()'d.
if (require.main === module) {
  main();
}

// Export for module use
module.exports = { detectMyanmarFontSupport, printReport, MYANMAR_LANGUAGES };