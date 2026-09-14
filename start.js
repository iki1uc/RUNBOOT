// start.js · iki1uc · Runtime-Schicht
// SYN + QUANDT + Roundwork + Boot-Pipeline

import { 
  DOOR, DOO, SLIDE, WETTE, RESPO,
  _243, OS, NC_engine, SCORE, AXIOM
} from "./boot.js";

import { BOOT_GEO } from "./boot-geo.js";
import { REAL_INPUT } from "./real-input.js";

// SYN-Takt
const SYN = {
  alive: true,
  tick() { this.alive = true; }
};

// QUANDT-Energie
const QUANDT = REAL_INPUT.quandt;

// Energie + Takt Wächter
function energyWatch() {

    // Energie prüfen
    if (QUANDT.cap <= 20) {
        SCORE.write("shutdown");
        AXIOM.jump(OS.ENTRY);
        return false;
    }

    // SYN prüfen
    if (!SYN.alive) {
        SCORE.write("shutdown");
        AXIOM.jump(OS.ENTRY);
        return false;
    }

    // Reset für nächsten Zyklus
    SYN.alive = false;

    // Roundwork val++
    BOOT_GEO.val++;

    return true;
}

// Haupt-Start
export function start() {

    // 1. DOOR
    DOOR.open();

    // 2. DOO
    DOO.readSector();

    // 3. SLIDE
    SLIDE.relocate(OS.entry);

    // 4. WETTE
    if (!WETTE.verify(OS.kernel)) {
        return WETTE.fail();
    }

    // 5. RESPO
    RESPO.check();

    // 6. 243.sync (Takt)
    _243.sync();
    SYN.tick();

    // 7. SYN + QUANDT Wächter
    if (!energyWatch()) return;

    // 8. OS.sysview
    OS.sysview.display();

    // 9. NC.engine
    NC_engine.run();

    // 10. SCORE
    SCORE.write("runtime");

    // 11. AXIOM.jump
    AXIOM.jump(OS.ENTRY);
}
