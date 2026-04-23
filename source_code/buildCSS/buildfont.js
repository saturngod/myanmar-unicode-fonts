var fs = require("fs");

var cssFile = "mmfonts.css";
if (fs.existsSync(cssFile)) {
  fs.unlinkSync(cssFile);
}

function readFontFamily(filePath) {
  var buf = fs.readFileSync(filePath);
  var numTables = buf.readUInt16BE(4);
  for (var i = 0; i < numTables; i++) {
    var tag = buf.toString("ascii", 12 + i * 16, 16 + i * 16);
    if (tag === "name") {
      var tableOffset = buf.readUInt32BE(20 + i * 16);
      var count = buf.readUInt16BE(tableOffset + 2);
      var stringOffset = buf.readUInt16BE(tableOffset + 4);
      var preferred = null;
      var family = null;
      for (var j = 0; j < count; j++) {
        var rec = tableOffset + 6 + j * 12;
        var platformID = buf.readUInt16BE(rec);
        var encodingID = buf.readUInt16BE(rec + 2);
        var nameID = buf.readUInt16BE(rec + 6);
        var length = buf.readUInt16BE(rec + 8);
        var offset = buf.readUInt16BE(rec + 10);
        var strStart = tableOffset + stringOffset + offset;
        var strEnd = strStart + length;
        var swapped = Buffer.alloc(length);
        for (var k = 0; k < length - 1; k += 2) {
          swapped[k] = buf[strStart + k + 1];
          swapped[k + 1] = buf[strStart + k];
        }
        var val = swapped.toString("utf16le");
        if (nameID === 16 && platformID === 3 && encodingID === 1 && !preferred) {
          preferred = val;
        }
        if (nameID === 1 && platformID === 3 && encodingID === 1 && !family) {
          family = val;
        }
      }
      return preferred || family;
    }
  }
  return null;
}

function typesCSS(path) {
  var fonts = fs.readdirSync(path);

  var text = "";

  for (var i = 0; i < fonts.length; i++) {
    var fontFile = fonts[i];
    var font = fontFile.substr(0, fontFile.length - 4);
    var ext = fontFile.substr(-4);
    if (ext != ".ttf") {
      continue;
    }

    var embeddedName = readFontFamily(path + "/" + fontFile);
    var localCss = embeddedName || font;

    text =
      text +
      `
@font-face {
    font-family:"${font}";
    src:local('${localCss}'),url('./${path}/${font}.ttf') format('truetype');
}
.${font} {
    font-family: "${font}";
}
        `;
  }

  return text;
}
var text =
  typesCSS("KhmerType") +
  "\n" +
  typesCSS("unknown") +
  "\n" +
  typesCSS("masterpiece") +
  "\n" +
  typesCSS("PhoenixDigitalArt") +
  "\n" +
  typesCSS("OneType") +
  "\n" +
  typesCSS("other");
fs.writeFileSync(cssFile, text);
