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
        console.log("QUANDT LOW → safe shutdown");
        SCORE.write("shutdown");
        AXIOM.jump(OS.ENTRY);
        return false;
    }

    // SYN prüfen
    if (!SYN.alive) {
        console.log("SYN LOST → safe shutdown");
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

    //
