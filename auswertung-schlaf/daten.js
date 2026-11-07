/* ============================================================
   BINDEGLIED – übersetzt die Umfragedaten ins Standardformat
   ------------------------------------------------------------
   Das Datenboard (index.html) liest NUR window.DATENSATZ im
   folgenden Standardformat. Diese Datei ist die einzige Stelle,
   die an das echte Datenformat angepasst werden muss.

   STANDARDFORMAT
   window.DATENSATZ = {
     quelle: "umfrage" | "test",      // "test" zeigt den Hinweis „Beispieldaten“
     stand:  "TT.MM.JJJJ",            // wird oben auf der Seite angezeigt
     antworten: [                     // eine Zeile pro abgeschickter Umfrage
       {
         id:          "a01",          // Text, eindeutig
         eingang:     "TT.MM.JJJJ HH:MM:SS" oder null,
         alter:       Zahl (Jahre) oder null,
         einschlafen: "HH:MM" oder null,   // unter der Woche
         aufwachen:   "HH:MM" oder null,   // unter der Woche
         minuten:     Zahl oder null,      // Handy im Bett, unter der Woche
         muede:       ganze Zahl 1–9 oder null,
         wochenende:  "HH:MM" oder null,   // Einschlafen am Wochenende
       },
     ],
   };

   - Fehlende Angaben immer als null (nicht "", nicht 0).
   - Unplausible Werte (z. B. Alter 99) NICHT hier entfernen –
     das Bereinigen machen die Schülerinnen und Schüler im Board.
   - Schlafdauer und Verschiebung berechnet das Board selbst.
   ============================================================ */

// 1) ROHDATEN – hier kommt der Export der Umfrage hinein.
//    Solange das leer ist, verwendet das Board die Testdaten.
const ROHDATEN = ``;

// 2) ÜBERSETZUNG – wird geschrieben, sobald das Format der
//    Rohdaten bekannt ist. Muss das Standardformat zurückgeben.
function uebersetze(roh) {
  throw new Error("Übersetzung für das Rohdatenformat ist noch nicht geschrieben.");
}

// 3) AUSGABE – nicht verändern.
window.DATENSATZ = ROHDATEN.trim() ? uebersetze(ROHDATEN) : window.TESTDATEN;
