// boot.js · iki1uc · Timing-Schicht

export function boot() {

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

    // Boot-Timing endet hier.
    // Runtime übernimmt in start.js
}
