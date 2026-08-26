function boot() {
  RESPO.log("BOOT START");

  NC_engine.disk();
  NC_engine.video();

  if (!WETTE.verify(OS.kernel)) {
    return WETTE.fail();
  }

  DOO.readSector();
  SLIDE.relocate(OS.entry);

  SCORE.trace && writeTrace("Kernel loaded");

  DOOR.action();
  OS.handoff();

  RESPO.ok("BOOT COMPLETE");
}
