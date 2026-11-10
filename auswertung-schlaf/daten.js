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
const ROHDATEN = `
"Zeitstempel","Wie alt bist du? ","Um wie viel Uhr schläfst du unter der Woche ungefähr ein? ","Um wie viel Uhr wachst du unter der Woche ungefähr auf? ","Wie viele Minuten nutzt du unter der Woche ungefähr dein Handy, nachdem du dich ins Bett gelegt hast? Schätze ungefähr. Wenn du es gar nicht nutzt, trage 0 ein. ","Wie müde bist du unter der Woche normalerweise am Vormittag? ","Um wie viel Uhr schläfst du am Wochenende ungefähr ein, wenn du am nächsten Tag ausschlafen kannst? "
"2026/11/04 7:43:38 AM MEZ","16","00:45","06:00","100","5","01:00"
"2026/11/04 7:44:08 AM MEZ","16","23:15","07:00","120","6","00:30"
"2026/11/04 7:44:47 AM MEZ","16","00:15","07:00","25","5","02:30"
"2026/11/04 7:45:12 AM MEZ","16","22:00","06:00","2","5","23:00"
"2026/11/04 7:45:17 AM MEZ","16","22:45","06:45","15","5","23:30"
"2026/11/04 7:45:17 AM MEZ","55","01:00","08:00","20","2","02:15"
"2026/11/04 7:45:26 AM MEZ","16","21:45","06:30","15","3","23:00"
"2026/11/04 7:45:27 AM MEZ","16","22:45","06:15","50","2","00:30"
"2026/11/04 7:45:32 AM MEZ","16","21:30","06:30","30","4","22:00"
"2026/11/04 7:45:37 AM MEZ","16","21:30","06:15","50","8","23:30"
"2026/11/04 7:45:37 AM MEZ","16","23:00","06:30","30","3","02:30"
"2026/11/04 7:45:39 AM MEZ","16","23:00","06:30","0","5","23:30"
"2026/11/04 7:45:40 AM MEZ","16","23:00","06:00","30","6","01:30"
"2026/11/04 7:45:46 AM MEZ","16","23:00","06:30","20","5","23:45"
"2026/11/04 7:45:46 AM MEZ","16","22:00","06:00","10","4","23:00"
"2026/11/04 7:45:46 AM MEZ","15","22:45","06:30","10","3","23:15"
"2026/11/04 7:45:49 AM MEZ","16","23:15","06:15","3","3","00:45"
"2026/11/04 7:46:12 AM MEZ","17","22:00","06:00","0","3","22:30"
"2026/11/04 7:46:14 AM MEZ","16","23:00","06:00","20","6","00:00"
"2026/11/04 7:46:48 AM MEZ","16","23:45","06:30","60","3","02:00"
"2026/11/04 7:46:49 AM MEZ","16","23:45","06:15","30","5","02:15"
"2026/11/04 7:47:00 AM MEZ","16","22:45","06:15","25","4","23:15"
"2026/11/04 9:24:17 AM MEZ","24","00:00","06:15","30","6","00:00"
"2026/11/04 9:24:52 AM MEZ","25","23:00","06:00","0","3","01:00"
"2026/11/04 3:17:04 PM MEZ","16","22:00","05:45","0","3","22:30"
"2026/11/08 6:45:02 PM MEZ","17","22:30","06:45","0","5","23:30"
"2026/11/08 6:49:09 PM MEZ","16","22:30","06:15","0","5","23:30"
"2026/11/08 7:21:05 PM MEZ","17","22:00","06:45","150","3","23:30"
"2026/11/09 4:34:32 PM MEZ","18","22:15","07:00","10","7","22:30"
"2026/11/09 5:19:50 PM MEZ","16","22:00","06:15","0","4","23:30"
`;

// 2) ÜBERSETZUNG – wird geschrieben, sobald das Format der
//    Rohdaten bekannt ist. Muss das Standardformat zurückgeben.
//    Format des Google-Forms-Exports (Stand 10.11.2026):
//    Spalte 0 Zeitstempel "2026/11/04 7:43:38 AM MEZ", danach in
//    dieser Reihenfolge: Alter, Einschlafen Woche, Aufwachen Woche,
//    Minuten, Müdigkeit, Einschlafen Wochenende. Alles als Text.
function uebersetze(roh) {
  const zeilen = csvZeilen(roh).slice(1);               // Kopfzeile weg
  const zahl = s => { s = String(s ?? "").trim().replace(",", "."); return s === "" || !isFinite(Number(s)) ? null : Number(s); };
  const uhr = s => { const m = String(s ?? "").trim().match(/^(\d{1,2}):(\d{2})/); return m ? m[1].padStart(2, "0") + ":" + m[2] : null; };
  const ganz = s => { const v = zahl(s); return Number.isInteger(v) ? v : null; };
  const eingang = s => {
    const m = String(s).match(/(\d{4})\/(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM)?/i);
    if (!m) return null;
    let h = +m[4]; const ap = (m[7] || "").toUpperCase();
    if (ap === "PM" && h < 12) h += 12; if (ap === "AM" && h === 12) h = 0;
    const p = n => String(n).padStart(2, "0");
    return `${p(m[3])}.${p(m[2])}.${m[1]} ${p(h)}:${m[5]}:${m[6]}`;
  };
  const antworten = zeilen.map((z, i) => ({
    id: "a" + String(i + 1).padStart(2, "0"),
    eingang: eingang(z[0]),
    alter: zahl(z[1]),
    einschlafen: uhr(z[2]),
    aufwachen: uhr(z[3]),
    minuten: zahl(z[4]),
    muede: ganz(z[5]),
    wochenende: uhr(z[6]),
  }));
  return { quelle: "umfrage", stand: "10.11.2026", antworten };
}

// CSV in Zeilen und Felder zerlegen (Anführungszeichen werden beachtet)
function csvZeilen(t) {
  const rows = []; let row = [], f = "", q = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) { if (c === '"') { if (t[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === ",") { row.push(f); f = ""; }
    else if (c === "\n") { row.push(f); rows.push(row); row = []; f = ""; }
    else if (c !== "\r") f += c;
  }
  if (f !== "" || row.length) { row.push(f); rows.push(row); }
  return rows.filter(r => r.some(x => x.trim() !== ""));
}

// 3) AUSGABE – nicht verändern.
window.DATENSATZ = ROHDATEN.trim() ? uebersetze(ROHDATEN) : window.TESTDATEN;
