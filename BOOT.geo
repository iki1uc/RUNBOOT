# BOOT.geo
OS-Boot-Raum · Masterboot-Übernahme

## 1 · BOOT-Raum
Der BOOT-Raum ist die erste Zone, die beim Start geladen wird.
Er enthält:
- Grundposition
- Grundrichtung
- Grundwert
- Grundbewegung

## 2 · Masterboot-Link
masterboot → lädt BOOT.geo als erste Raumdefinition

## 3 · Geo-Felder
geo = {
  zone: "BOOT",
  pos: [0,0,0],
  dir: "N",
  val: 0,
  mov: "none"
}

## 4 · Geo-Definitionen
Zonen:
- N (Norden)
- O (Osten)
- S (Süden)
- W (Westen)
- C (Zentrum)

Bewegungen:
- move(N)
- move(O)
- move(S)
- move(W)
- move(C)

## 5 · Geo-Regeln
- Jede Bewegung ist legal.
- Jede Zone ist neutral.
- Keine Drift.
- Keine Fremdlogik.
- Nur OS-Werte.

## 6 · Mind-Link (optional)
Wenn OS.mind.js aktiv ist:
- geo.dir = OS.mind.kompass(OU)
- geo.val = OS.mind.stats(OU)
- geo.mov = OS.mind.verhalten(OU)

## 7 · Masterboot-Übernahme
masterboot übernimmt:
- geo.zone
- geo.pos
- geo.dir
- geo.mov
- geo.val

Damit ist BOOT.geo vollständig OS-kompatibel.
