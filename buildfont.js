
var fs = require('fs');

cssFile = "mmfonts.css"
if (fs.existsSync(cssFile)) {
    fs.unlinkSync(cssFile)
}

function typesCSS(path) {

    fonts = fs.readdirSync(path)
    

    var text = ""
   
    for (i = 0; i < fonts.length; i++) { 
        fontFile = fonts[i]
        var font = fontFile.substr(0,fontFile.length - 4)
        var ext = fontFile.substr(-4)
        if (ext != ".ttf") {
            continue
        }

        text = text + `
@font-face {
    font-family:"${font}";
    src:local('${font}'),url('./${path}/${font}.ttf') format('truetype');
}
.${font} {
    font-family: "${font}";
}
        `
        
        
    }
    
    return text
    
    
}
var text = typesCSS("KhmerType") + "\n" + typesCSS("unknown") + "\n" + typesCSS("other")
fs.writeFileSync(cssFile,text)




