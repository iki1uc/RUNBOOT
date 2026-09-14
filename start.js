// SYN + QUANDT Wächter
function energyWatch() {

    // Energie prüfen
    if (REAL_INPUT.quandt.cap <= 20) {
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
