# Turi erklärt KI · KI unter der Haube

**Wie denkt eigentlich ein Sprachmodell?** Dieses Repository enthält zwei interaktive Lernseiten, die erklären, wie
KI-Chats wie ChatGPT oder Claude funktionieren und wie man sie klug und sicher benutzt. Beide sind jeweils eine
einzelne HTML-Datei. Sie laufen in jedem aktuellen Browser, auf Computer, Tablet und Handy, ganz ohne Installation,
Anmeldung oder Internetverbindung.

**Direkt ausprobieren:** https://anotherkarsten.github.io/turi-explains-ai/ (Startseite mit beiden Lernseiten)

## Welche Fassung passt?

| | **Turi erklärt KI** | **KI unter der Haube** |
|---|---|---|
| Für wen | Kinder ab etwa 9 Jahren, Schulklassen, Familien | Jugendliche ab etwa 14 Jahren und Erwachsene, Fortbildungen, Teams |
| Ton | Spielerisch, mit dem Roboter Turi als Begleiter | Spielerisch, aber sachlich und genauer, mit Fachbegriffen zum Aufklappen |
| Inhalt | 11 Stationen mit Aufgaben, Quiz und Urkunde | 13 Experimente in zwei Teilen, Quiz und Spickzettel als PDF |
| Datei | [`turi-explains-ai.html`](turi-explains-ai.html) | [`ai-under-the-hood.html`](ai-under-the-hood.html) |

Beide Fassungen gibt es auf Deutsch, Englisch, Französisch, Italienisch, Spanisch und Niederländisch. Sie haben das
gleiche Aussehen und verweisen im Fußbereich aufeinander (Link auf die veröffentlichte Seite), sind aber unabhängig
voneinander nutzbar. Die Startseite [`index.html`](index.html) stellt beide vor und führt in der gewählten Sprache
zur passenden Fassung.

---

## Turi erklärt KI (für Kinder)

Turi, ein kleiner Roboter, nimmt Kinder mit auf eine Reise ins Innere einer KI. Statt Fachbegriffen gibt es Schnipsel,
Knöpfe, eine Landkarte der Wörter und einen Würfel. Und am Ende die wichtigste Frage: Wie benutze ich KI klug und sicher?
Turi ist nach Alan Turing benannt, einem der Väter der Informatik und Vordenker der künstlichen Intelligenz.

### Für wen ist Turi?

- **Kinder ab etwa 9 Jahren**, die wissen wollen, was hinter KI-Chats steckt. Die Texte sind kurz, die Sprache ist
  einfach, und überall darf ausprobiert werden.
- **Lehrkräfte** für Medienbildung, Informatik oder Projekttage: Je nach Tempo dauert ein Durchgang etwa eine
  Schulstunde; mit allen Aufgaben und Gesprächen in der Klasse auch länger.
- **Eltern**, die mit ihren Kindern über KI sprechen möchten, und **neugierige Erwachsene**, die einen anschaulichen
  Einstieg suchen.

### Was Turi erklärt

Die Kinder verfolgen eine Anfrage durch elf Stationen, so wie sie auch durch ein echtes Sprachmodell läuft:

| Station | Worum es geht |
|---|---|
| 1. Training | Ein Mini-Modell liest Sätze, deckt Wörter ab, rät und dreht seine „Knöpfe“, bis es besser wird. Danach geben Menschen den Feinschliff. |
| 2. Schnipsel | Die Kinder schneiden ihre Anfrage selbst mit der Schere in Tokens, in einer Werkstatt auch eigene Sätze. |
| 3. Zahlen | Jeder Schnipsel hat eine Nummer; für den Computer wird die Frage zur Zahlenreihe. |
| 4. Landkarte | Wörter wohnen auf einer Bedeutungs-Landkarte. Koordinaten, Nachbarn und ein „Steckbrief“ zeigen, warum ein Modell Tausende Zahlen pro Wort braucht. |
| 5. Aufmerksamkeit | Tokens schauen, welche anderen Wörter wichtig sind, und warum die Reihenfolge zählt („Hund beißt Mann“). |
| 6. Kontext | Ein Wort mit zwei Bedeutungen, Vorhersagen, die sich mit einem Wort ändern, und das Kontextfenster als Kurzzeit-Gedächtnis. |
| 7. Raten | Das nächste Wort wird gewürfelt; ein Kreativitäts-Regler (Temperatur) macht die KI vorsichtig oder wild. |
| 8. Wort für Wort | Die Antwort entsteht Schritt für Schritt bis zum [ENDE]. |
| 9. Nachschlagen | Werkzeuge: Suchen statt raten, Taschenrechner statt Kopfrechnen, erst nachdenken, dann antworten. |
| 10. Clever mit KI | Wo überall KI drinsteckt (Sortierspiel: keine KI, KI, die erkennt, KI, die Neues macht), Stärken und Schwächen, Halluzinieren, Missbrauch wie Deepfakes, ein Ampel-Spiel mit Alltagssituationen und Turis Regeln. |
| 11. Geschafft! | Zusammenfassung, Quiz und eine Abschluss-Urkunde. |

Drei Beispiel-Anfragen („Der Himmel ist …“, „Was ist die Hauptstadt von Frankreich?“, „Hunde sind die besten …“)
zeigen jeweils andere Seiten des Modells. Alle Zahlen und Wahrscheinlichkeiten sind zur Veranschaulichung vereinfacht.

### So lernt man mit Turi

- **Mitmachen statt lesen:** An jeder Station gibt es Aufgaben, die mit Schildern („🎯 Aufgabe 1“) direkt an der
  passenden Stelle markiert sind. Ein Knopf in der unteren Leiste zeigt den Fortschritt und springt zur nächsten
  offenen Aufgabe; sie bleibt farbig markiert, bis sie erledigt ist.
- **Rückmeldung ohne Druck:** Wer weiterklickt, bevor alles erledigt ist, bekommt einen freundlichen Hinweis in der
  Bildmitte, darf aber trotzdem weiter.
- **Belohnung:** Sind alle Aufgaben aller Stationen geschafft, gibt es ein Abschluss-Fenster mit Auswertung.
- **Tablet-tauglich:** große Tippflächen, eindeutige Knöpfe, auf dem iPad im Hoch- und Querformat getestet.

### Tipps für Lehrkräfte und Eltern

- Kinder zu zweit arbeiten lassen und an jeder Station kurz erzählen lassen, was sie entdeckt haben.
- Die Station „Clever mit KI“ eignet sich gut als Gesprächsanlass: Wann würdet ihr einer KI vertrauen, wann nicht?
- Mit allen drei Beispiel-Anfragen arbeiten; sie zeigen unterschiedliche Effekte.
- In der Station „Clever mit KI“ steht ein Hilfetelefon für Kinder, passend zur Sprache: Nummer gegen Kummer 116 111 (Deutschland),
  Childline 0800 1111 (Vereinigtes Königreich) und 116 111 in vielen europäischen Ländern, 3018 und 119 (Frankreich),
  Telefono Azzurro 19696 (Italien), Fundación ANAR 900 20 20 10 (Spanien), De Kindertelefoon 0800-0432 (Niederlande).
  Stand der Prüfung: November 2026.

---

## KI unter der Haube (für Jugendliche und Erwachsene)

Die Fassung für Erwachsene zeigt in 13 Experimenten, was zwischen einer Frage und der Antwort passiert, und was das für
Alltag und Beruf bedeutet. Der Ton ist locker (Du-Form), die Inhalte gehen tiefer als bei Turi, und wer noch mehr wissen
will, klappt bei jeder Station „Unter der Haube“ auf.

### Für wen?

- **Jugendliche ab etwa 14 Jahren und Erwachsene**, die verstehen wollen, wie KI-Chats arbeiten, ohne Vorwissen.
- **Fortbildungen, Teams und Volkshochschulen:** Jede Station steht für sich und dauert etwa 3 bis 5 Minuten. Man kann
  die ganze Seite durcharbeiten (etwa 45 bis 60 Minuten) oder einzelne Stationen als Gesprächsanlass nehmen.
- **Lehrkräfte**, die sich selbst einarbeiten oder die Oberstufe unterrichten.

### Was erklärt wird

| Station | Leitfrage | Zum Ausprobieren |
|---|---|---|
| **Teil 1: So funktioniert ein Sprachmodell** | | |
| 1. Training | Wie lernt ein Sprachmodell aus Text? | Ein Mini-Modell liest Sätze und lernt, welches Wort folgt; das gezählte Wort ist in jedem gelesenen Satz markiert. |
| 2. Tokens | Warum zählt die KI in Tokens, und warum kostet Deutsch mehr? | Eigenen Text zerlegen; bei vier Satzpaaren schätzen, welche Sprache mehr Tokens braucht. |
| 3. Wortkarte | Wie kann eine Maschine mit Bedeutung rechnen? | Nachbarn auf einer Bedeutungskarte und zwei Analogie-Rätsel („Mann verhält sich zu Frau wie König zu …?“, „Hund verhält sich zu Welpe wie Katze zu …?“), gelöst mit Pfeilen auf der Karte; der Rechenweg lässt sich Schritt für Schritt aufklappen. |
| 4. Aufmerksamkeit | Woher weiß das Modell, worauf sich ein Wort bezieht? | Sehen, worauf „sie“ oder „er“ im Satz schaut, mit Gewichten in Prozent und einer Erklärung, wie das Modell sie verrechnet. |
| 5. Kontextfenster | Warum vergisst die KI, was am Anfang stand? | Das Fenster Schritt für Schritt verkleinern und zusehen, wie die Zusammenfassung des Chats immer mehr Erfundenes enthält. |
| 6. Zufall | Warum bekommt dieselbe Frage zwei Antworten? | Temperaturregler, zehn Fortsetzungen eines Betreffs würfeln, passende Einstellung wählen; dazu, wo du die Temperatur selbst beeinflussen kannst und wo nicht. |
| 7. Erfundene Antworten | Warum erfindet die KI Dinge und klingt dabei so sicher? | Bekannte, knifflige und Nischenfragen; die Wahrscheinlichkeiten im Inneren sind immer sichtbar. |
| 8. Nachschlagen | Wie wird eine KI verlässlicher? | Raten oder nachschlagen, rechnen, Schritt für Schritt denken. |
| **Teil 2: Klug damit arbeiten** | | |
| 9. Gut fragen | Wie fragt man so, dass etwas Brauchbares herauskommt? | Bausteine in beliebiger Reihenfolge ein- und ausschalten; jeder ändert die Antwort auf seine Weise. |
| 10. Vorurteile | Hat eine KI Vorurteile? | Welche Vornamen das Modell für einen Beruf erwartet, vor und nach dem Ausgleich, und warum Verzerrungen in der Praxis schaden. |
| 11. Energie | Wie viel Energie kostet eine Antwort? | Den eigenen KI-Alltag abschätzen: zuerst Wattstunden und Milliliter Wasser, danach Vergleiche mit Handy-Ladungen, LED-Lampe, Esslöffeln Wasser und Haushaltsstrom. |
| 12. Was in den Chat darf | Was darf in den Chat, und was nicht? | Ampel-Spiel mit acht Situationen aus dem Berufsalltag. |
| 13. KI-Agenten | Was ändert sich, wenn die KI handelt? | Entscheiden, welche Schritte ein Agent nur mit Freigabe tun darf; dazu Tipps und eine Prompt-Vorlage, damit die KI vorher fragt, und warum eine Anweisung im Prompt keine echte Sperre ist. |

Zum Schluss gibt es ein Quiz mit acht Fragen und einen **Spickzettel als PDF** (eine A4-Seite mit den wichtigsten
Regeln und einer Vorlage für gute Anfragen), den die Seite selbst erzeugt.

### So lernt man mit der Seite

- **Ausprobieren:** Jede Station hat ein Labor zum Anfassen, mit Rückmeldung zu jeder Entscheidung.
- **Tiefe nach Wahl:** „Unter der Haube“ erklärt die Fachbegriffe (zum Beispiel Embedding, Softmax, RAG,
  Prompt-Injection). Wer es eilig hat, lässt die Klappe zu.
- **Praxis:** Jede Station endet mit „Im Alltag heißt das“, zwei konkreten Regeln für Beruf und Privatleben.
- **Übersicht und freie Reihenfolge:** Die Startseite zeigt alle Stationen als Karten. Jede Station hat eine eigene
  Seite mit Nummernleiste, Zurück und Weiter; besuchte Stationen sind markiert. Quiz und Spickzettel stehen auf der
  Abschlussseite. Einzelne Stationen lassen sich direkt verlinken, zum Beispiel `ai-under-the-hood.html#energie`.

---

## Sprachen

Beide Seiten gibt es auf Deutsch, Englisch, Französisch, Italienisch, Spanisch und Niederländisch, jeweils mit eigenen
Beispielen. Die Sprache lässt sich oben auf der Seite umschalten, wird gemerkt und kann per Link vorgewählt werden,
zum Beispiel `turi-explains-ai.html?lang=fr` oder `ai-under-the-hood.html?lang=en`.

## Benutzen

- **Online:** https://anotherkarsten.github.io/turi-explains-ai/ im Browser öffnen (Safari, Chrome, Firefox, Edge) und die passende Fassung wählen. Der Link
  lässt sich einfach weitergeben, auch direkt auf eine Fassung, zum Beispiel `https://anotherkarsten.github.io/turi-explains-ai/ai-under-the-hood.html?lang=en`.
- **Offline:** Die neueste Fassung unter [Releases](https://github.com/AnotherKarsten/turi-explains-ai/releases/latest)
  herunterladen: `turi-explains-ai.html` für Kinder, `ai-under-the-hood.html` für Erwachsene, und die Datei mit einem
  Browser öffnen. Es wird nichts installiert und nichts nachgeladen.

Die Webseite wird mit GitHub Pages direkt aus dem Branch `main` veröffentlicht (`index.html` als Startseite,
`.nojekyll` schaltet die Umwandlung durch Jekyll ab).

Hinweis: In Vorschaufenstern, etwa aus einem Mailprogramm oder der Dateien-App auf dem iPad, läuft kein JavaScript.
Die Seiten zeigen dann eine Erklärung, wie man die Datei im richtigen Browser öffnet.

## Datenschutz

Beide Seiten laden nichts aus dem Internet (auch keine Schriften), setzen keine Cookies und haben kein Tracking. Im
Browser (`localStorage`) wird nur die gewählte Sprache gespeichert; diese Information verlässt das Gerät nicht. Der
Spickzettel wird im Browser erzeugt und nirgendwohin gesendet. Wer die Seiten auf einer eigenen Webseite veröffentlicht, braucht dort je nach Land trotzdem ein Impressum und eine Datenschutzerklärung
für den eigenen Webserver.

## Lizenz

© 2026 Karsten Leick

Die Lizenzen gelten für beide Seiten, `turi-explains-ai.html` und `ai-under-the-hood.html`, und für die Startseite `index.html`:

- **Programmcode** (HTML-Struktur, CSS, JavaScript): [MIT-Lizenz](LICENSE)
- **Inhalte** (Texte und Sprachpakete, Beispiele, Quizfragen, Spickzettel, die Figur Turi und die Grafiken):
  [CC BY-SA 4.0](LICENSES/CC-BY-SA-4.0.txt), https://creativecommons.org/licenses/by-sa/4.0/deed.de
- **Schriften** (eingebettet): SIL Open Font License 1.1, siehe [LICENSES/OFL-1.1.txt](LICENSES/OFL-1.1.txt)

Beide Seiten dürfen frei genutzt, weitergegeben und verändert werden, auch im Unterricht. Bitte „Karsten Leick“ als Urheber
nennen, auf dieses Repository verweisen und veränderte Inhalte unter CC BY-SA 4.0 weitergeben.

## Danksagung

- Schriften: [Fredoka](https://github.com/hafontia/Fredoka-One) (The Fredoka Project Authors),
  [Atkinson Hyperlegible](https://www.brailleinstitute.org/freefont/) (Braille Institute of America, besonders gut
  lesbar), [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono) (The JetBrains Mono Project Authors).
- Beide Seiten wurden mit Unterstützung von KI (Claude von Anthropic) erstellt. Inhalte und Funktion wurden von Karsten Leick
  geprüft und verantwortet.
- „ChatGPT“ und „Claude“ werden nur als Beispiele genannt; die Namen sind Marken ihrer jeweiligen Inhaber.

## Mitmachen

Jede Seite besteht aus einer einzigen Datei ohne Build-Schritt. Alle Texte stehen in Sprachpaketen getrennt vom
Programmcode (`TURI_LANG.de` usw. in `turi-explains-ai.html`, `HAUBE_LANG.de` usw. in `ai-under-the-hood.html`). Hinweise für Änderungen, Übersetzungen und Tests stehen in [CLAUDE.md](CLAUDE.md).
Neue Fassungen erscheinen als [Releases](https://github.com/AnotherKarsten/turi-explains-ai/releases)
mit Versionsnummer; der Ablauf dafür steht in `.github/workflows/release.yml`. Jeder Pull Request wird automatisch
geprüft (`.github/pruefung/pruefen.js`): beide Seiten, alle Sprachen und Stationen auf Computer, iPad und Handy, ohne
JavaScript-Fehler, ohne Anfragen ins Internet und ohne zu kleine Tippflächen.
