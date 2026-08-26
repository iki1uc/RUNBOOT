/*
  Eingabe-Bereich (REAL_INPUT)
  Hinweis:
  Wir notieren nichts.
  Wir verfolgen nichts.
  Wir speichern nichts.
  Wir freuen uns anonym,
  wenn jemand seine tmp.txt teilt.
*/

REAL_INPUT = {

  // optionaler Name
  name: "",

  // vier Zahlen
  jahr: 0000,
  ram: 0000,
  gpu: 0000,
  cpu: 0000,
  rom: 0000,

  // 16-Farben-Palette
  farbe16: [
    "000000","FFFFFF","FF0000","00FF00",
    "0000FF","FFFF00","FF00FF","00FFFF",
    "808080","800000","008000","000080",
    "808000","800080","008080","C0C0C0"
  ],

  // Rastergrößen
  raster: {
    small:  "230x240",
    medium: "320x240"
  },

  // tmp-Wert, wenn jemand klickt statt schreibt
  tmp16: null
}
