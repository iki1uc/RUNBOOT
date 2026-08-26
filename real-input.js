// ============================================================
// REAL_INPUT → echte Werte (aus deiner realwert.md uebernommen)
// Kein ES-Modul, damit es auch per Doppelklick (file://) laedt.
//
// Hinweis aus deiner Datei:
// "Wir notieren nichts. Wir verfolgen nichts. Wir speichern nichts."
// → alle Werte bleiben nur im Browser-Speicher (RAM), nichts wird
//   irgendwohin geschickt oder gespeichert.
// ============================================================
const REAL_INPUT = {
    name: "",
    jahr: 0,
    ram: 0,
    gpu: 0,
    cpu: 0,
    rom: 0,
    farbe16: [
        "000000", "FFFFFF", "FF0000", "00FF00",
        "0000FF", "FFFF00", "FF00FF", "00FFFF",
        "808080", "800000", "008000", "000080",
        "808000", "800080", "008080", "C0C0C0"
    ],
    raster: {
        small: "230x240",
        medium: "320x240"
    },
    // tmp-Wert: wird gesetzt, wenn jemand auf eine Farbe klickt,
    // statt einen Wert einzutippen
    tmp16: null
};
