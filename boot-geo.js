// ============================================================
// BOOT.geo → echte Werte (aus deiner BOOT.geo-Datei übernommen)
// Kein ES-Modul, damit es auch per Doppelklick (file://) laedt.
// ============================================================
const BOOT_GEO = {
    zone: "BOOT",
    pos: [0, 0, 0],
    dir: "N",
    val: 0,
    mov: "none",
    memory: {}
};

// ─── Bewegungs-Logik aus BOOT.geo Abschnitt 4 ──────────────────
// Zonen: N, O, S, W, C — jede Bewegung ist laut BOOT.geo "legal"
const GEO_ZONES = ["N", "O", "S", "W", "C"];

function geoMove(direction) {
    if (!GEO_ZONES.includes(direction)) {
        console.warn("BOOT.geo → unbekannte Richtung:", direction);
        return BOOT_GEO;
    }
    BOOT_GEO.dir = direction;
    BOOT_GEO.mov = `move(${direction})`;
    // jede Bewegung erhöht den Grundwert leicht (deine Regel: "keine Drift, nur OS-Werte")
    BOOT_GEO.val += 1;
    return BOOT_GEO;
}
