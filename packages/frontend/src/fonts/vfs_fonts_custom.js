// src/fonts/vfs_fonts_custom.js
import pdfMake from "pdfmake/build/pdfmake";

pdfMake.vfs = {
  "Assistant-Regular.ttf": "AAEAAA...<כאן הולך ה-base64 של הפונט>..."
};

pdfMake.fonts = {
  Assistant: {
    normal: "Assistant-Regular.ttf",
    bold: "Assistant-Regular.ttf",
    italics: "Assistant-Regular.ttf",
    bolditalics: "Assistant-Regular.ttf",
  }
};
