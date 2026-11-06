# turi-explains-ai

Zwei eigenständige HTML-Lernseiten, die erklären, wie ein Sprachmodell funktioniert:
„Turi erklärt KI“ (`turi-explains-ai.html`, für Kinder ab etwa 9) und „KI unter der Haube“ (`ai-under-the-hood.html`, für
Jugendliche und Erwachsene, Du-Form), dazu die Startseite `index.html`, die beide vorstellt. Veröffentlicht wird mit
GitHub Pages aus `main` (https://anotherkarsten.github.io/turi-explains-ai/). Das Maskottchen heißt Turi (nach Alan
Turing). Die Regeln unten gelten für alle Seiten, sofern nicht anders angegeben.
Kein Build, keine Abhängigkeiten. CSS, JavaScript und die Schriften (Base64, SIL OFL 1.1) stehen inline in der Datei.
Die Seiten laden nichts aus dem Internet; keine externen Ressourcen (CDNs, Webfonts, Bilder, Tracking) hinzufügen.
Sprache der Seite, der Commits und der Pull Requests: Deutsch.

## Aufbau

- Im Repository liegen nur die aktuell nötigen Dateien: `turi-explains-ai.html` (Turi), `ai-under-the-hood.html` (KI unter der Haube),
  `index.html` (Startseite für GitHub Pages), `.nojekyll`, `README.md`, `CLAUDE.md`, `LICENSE`, `LICENSES/` und `.github/` (Prüf- und Release-Ablauf). Keine Kopien alter
  Versionen ablegen; die Historie steht in Git.
- „KI unter der Haube“: 13 Stationen in zwei Teilen (`parts`), je Station Text, ein Labor (`lab.type`: train, tokens,
  map, attention, window, temperature, confidence, lookup, prompt, bias, cost, ampel, agent), die Klappe „Unter der
  Haube“ (`hood`, Fachbegriffe) und „Im Alltag heißt das“ (`everyday`). Am Ende Quiz und Spickzettel; das PDF erzeugt die
  Seite selbst (A4, Helvetica, WinAnsi-Zeichensatz: nur Zeichen verwenden, die es dort gibt). Gleiche Farben, Schriften
  und Tasten wie Turi, aber ohne Maskottchen.
- KI unter der Haube ist in Ansichten derselben Datei aufgeteilt (Hash-Adressen): `#uebersicht` (Startseite mit Karten),
  `#<Stations-id>` (eine Station je Ansicht, mit Nummernleiste und Zurück/Weiter) und `#abschluss` (Quiz und
  Spickzettel; `#quiz` und `#spickzettel` führen dorthin). Stations-ids sind sprachunabhängig und bleiben stabil, damit
  Links funktionieren. `pruefen.js` geht alle Ansichten durch.
- Startseite `index.html`: deutscher Text steht fest im HTML (funktioniert ohne JavaScript), die anderen Sprachen in
  `INDEX_LANG` (gleiche Schlüssel wie `.de`; Elemente mit `data-k` werden ersetzt). Die Knöpfe führen mit `?lang=` zur
  gewählten Sprache. Neue oder umbenannte Seiten dort mit aufnehmen. Die Seiten verlinken sich gegenseitig über die
  Pages-Adresse.
- `README.md` beschreibt Zielgruppe, Inhalte und Benutzung beider Seiten, keine Versionshistorie. Bei neuen oder
  geänderten Stationen die Beschreibung dort anpassen.

## Lizenz

- © 2026 Karsten Leick. Programmcode: MIT (`LICENSE`), Inhalte: CC BY-SA 4.0 (`LICENSES/CC-BY-SA-4.0.txt`),
  Schriften: SIL OFL 1.1 (`LICENSES/OFL-1.1.txt`). Die Lizenzdateien nennen im Kopf beide Seiten; bei neuen oder
  umbenannten Seiten dort und im Release-Titel (`release.yml`) anpassen. Dateinamen der Seiten sind englisch. Der Lizenzkommentar steht direkt nach `<meta charset>` in der Seite.
- Die Credits-Zeile im Fußbereich (`ui.credits`) gibt es in allen sechs Sprachen; bei Änderungen alle anpassen.
- Neue Schriften, Bilder oder Bibliotheken nur mit verträglicher Lizenz einbetten und in `README.md` und `LICENSES/` nennen.

## Sprachen

- Beide Seiten gibt es auf Deutsch, Englisch, Französisch, Italienisch, Spanisch und Niederländisch. Alle Texte und alle
  sprachabhängigen Daten (Beispielsätze, Wortkarte, Lernstapel, Tokenizer-Regeln, Wahrscheinlichkeiten) stehen in
  den Blöcken `TURI_LANG.de`, `.en`, `.fr`, `.it`, `.es`, `.nl` (Turi) bzw. `HAUBE_LANG.de` usw. (KI unter der Haube).
  Der Programmcode im letzten `<script>` enthält keine Texte.
- KI unter der Haube: Wortkarten-Koordinaten so wählen, dass sich die Wörter auch auf dem iPhone SE nicht überlappen
  (prüft `pruefen.js`), und die Rechnung `calc` muss auf ein Wort der Karte führen. Wahrscheinlichkeiten in den Laboren
  `confidence` und `bias` ergeben je 100 %. Im Labor `tokens` vergleicht jede Sprache mit einer anderen (`other`).
- Jede Text- oder Inhaltsänderung in allen sechs Sprachen machen. Alle Pakete haben dieselben Schlüssel und gleich
  lange Listen (Fortschritt wird über Listenpositionen gespeichert und bleibt beim Sprachwechsel erhalten).
- Gewichte in `attw` und `bank[].w` beziehen sich auf die Tokens, die der Tokenizer der Sprache wirklich erzeugt.
  Das Doppelbedeutungs-Wort (`amb`) muss das letzte Token der `bank`-Sätze sein.
- Notrufnummern in `ui.help` sind länderspezifisch; bei Änderungen die Nummer prüfen.
- Französisch: vor ? ! : ; und innerhalb von « » ein geschütztes Leerzeichen (U+00A0) verwenden.
- Ausnahme: Der Hinweis für Vorschaufenster ohne JavaScript (`#nojs`, direkt am Anfang der Seite) steht fest im HTML,
  in allen sechs Sprachen untereinander. Er wird beim Programmstart entfernt. Ohne JavaScript ist nur er sichtbar.

## Änderungen einpflegen

- Änderungen direkt in `turi-explains-ai.html` bzw. `ai-under-the-hood.html` vornehmen; ein Commit pro zusammengehöriger Änderung mit aussagekräftiger
  Beschreibung auf Deutsch.
- Kommt eine Fassung aus einem Claude-Artefakt, die beim Veröffentlichen ergänzte Hülle entfernen (erste Zeile
  `<!doctype html><html><head>…<body>` und das abschließende `</body></html>`). Die Datei beginnt dann mit
  `<meta charset="utf-8">` und endet mit `</script>`.

## Prüfen

Vor jedem Push alle geänderten Seiten mit Playwright (vorinstalliert, `require('playwright')`) öffnen, durch alle
Stationen klicken und auf JavaScript-Fehler (`pageerror`) prüfen. Dabei prüfen, dass keine Anfrage ins Internet geht.
Die Seite muss auf dem iPad gut bedienbar sein: zusätzlich mit iPad-Emulation (`devices['iPad (gen 7)']` hoch,
`devices['iPad Pro 11 landscape']` quer) prüfen, dass nichts horizontal überläuft und Tippflächen mindestens 44 px hoch sind.
Hover-Effekte nur in `@media (hover:hover)`, Touch-Anpassungen in `@media (pointer:coarse)`.
Alle Sprachen prüfen: die Seite mit `?lang=de`, `?lang=en`, `?lang=fr`, `?lang=it`, `?lang=es`, `?lang=nl` öffnen und auf
Fehler, Überlauf und deutsche Textreste prüfen. Außerdem einmal mit `javaScriptEnabled:false` öffnen: Dann muss der
Hinweis `#nojs` sichtbar und die eigentliche Seite ausgeblendet sein.

Diese Prüfungen macht das Skript `.github/pruefung/pruefen.js` für alle Seiten einschließlich der Startseite (`node .github/pruefung/pruefen.js`,
Exit-Code 1 bei Problemen; `TURI_SPRACHEN=de,fr` und `TURI_SEITEN=turi`, `haube` oder `start` für schnelle Proben). Bei KI unter
der Haube prüft es zusätzlich den PDF-Spickzettel und die Wortkarte. Die Prüfungen laufen gleichzeitig in so vielen Browser-Fenstern,
wie der Rechner Prozessorkerne hat (`TURI_PARALLEL=1` prüft nacheinander). Es prüft außerdem die Sprachpakete gegeneinander (Schlüssel,
Listenlängen, Gewichte, `amb`). Vor jedem Push ausführen; auf GitHub läuft es bei jedem Pull Request als Check
„Seite prüfen“ (`.github/workflows/pruefung.yml`). Neue Stationen oder Regeln dort mit aufnehmen. Was das Skript nicht
sieht (Aussehen, Verständlichkeit, Aufgaben-Ablauf), zusätzlich von Hand bzw. mit Screenshots prüfen.

## Releases

- Releases legt der Ablauf `.github/workflows/release.yml` an („Release erstellen“, `workflow_dispatch` mit dem Input
  `version` im Format `X.Y.Z`). Er setzt den Tag `vX.Y.Z` und hängt `turi-explains-ai.html` und
  `ai-under-the-hood.html` an; die Dateien heißen im Repository und im Release gleich. Ein Release enthält immer beide Seiten.
- Ablauf: `.github/release-notes.md` für die neue Version anpassen (Deutsch und Englisch, was ist neu), per Pull Request
  mergen, dann den Ablauf mit `mcp__github__actions_run_trigger` (`run_workflow`, `workflow_id: release.yml`,
  `ref: main`) starten und das Ergebnis mit `mcp__github__get_release_by_tag` prüfen.
- Versionsnummern: neue Stationen oder größere Inhalte → mittlere Stelle (1.1.0), Korrekturen → letzte Stelle (1.0.1).
- Nur auf ausdrücklichen Wunsch einen Release erstellen.

## Git-Ablauf

- Nach jedem Push automatisch einen Pull Request in `main` erstellen, ohne nachzufragen.
- Den Pull Request prüfen (Checks, Review-Kommentare, Mergebarkeit) und Fehler beheben. Gemergt wird nur, wenn der
  Check „Seite prüfen“ grün ist.
- Rulesets auf GitHub: `main` nur per Pull Request und nur mit Merge-Commit änderbar, kein Löschen, kein Force-Push
  („RulesetMain“); Release-Tags `v*` können nicht verschoben oder gelöscht werden („RulesetTag“).
- Ist alles in Ordnung, den Pull Request automatisch in `main` mergen (Merge-Commit, kein Squash).
- Keine Force-Pushes, keine umgeschriebene Historie auf GitHub.
- Nach dem Merge den Branch löschen (`git push origin --delete <branch>`), ohne nachzufragen. Lehnt die Sitzung das
  ab (HTTP 403), übernimmt das die GitHub-Einstellung „Automatically delete head branches“ des Repositorys.
- Nach dem Merge die veröffentlichten Claude-Artefakte auf den neuesten Stand bringen (Artifact-Tool, `url` angeben,
  damit der Link gleich bleibt): „Turi erklärt KI“ (https://claude.ai/artifact/1guaZGeT4azJK99MLM2iwU) mit `turi-explains-ai.html`,
  „KI unter der Haube“ (https://claude.ai/artifact/WZK9aGHNrd51eBWr6Qpdki) mit `ai-under-the-hood.html`.
