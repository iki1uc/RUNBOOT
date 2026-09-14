// masterboot.js · iki1uc · repariert

import { BOOT_GEO } from "./boot-geo.js";

const masterboot = {

  load: async function() {
    // BOOT.geo kommt lokal aus boot-geo.js
    return BOOT_GEO;
  },

  apply: function(geo) {
    OS.zone   = geo.zone;
    OS.pos    = geo.pos;
    OS.dir    = geo.dir;
    OS.val    = geo.val;
    OS.mov    = geo.mov;
    OS.memory = geo.memory || {};
  },

  start: async function() {

    // alte Netzprüfung entfernt → freeboote läuft offline
    let geo = await this.load();

    // Geo-Werte ins OS übernehmen
    this.apply(geo);

    // Roundwork initialisieren
    SCORE.write("masterboot.start");
    _243.sync();     // Takt
    SYN.tick();      // SYN lebt
  }
};

export { masterboot };
