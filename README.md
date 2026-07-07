# Norberts mobile Fußpflege — Kunden-Website

![Live](https://img.shields.io/badge/Staging-GitHub%20Pages-2f8fc0)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Sprachen](https://img.shields.io/badge/Sprachen-7_(inkl._RTL)-a8823c)
![Build](https://img.shields.io/badge/Build-none-success)
![Dependencies](https://img.shields.io/badge/Runtime--Dependencies-1_(Leaflet,_self--hosted)-success)

Website von **Norberts mobile Fußpflege** — kosmetische Fußpflege als Hausbesuch
in Stuttgart und Umgebung (bis 50 km). Ziel-Domain: **norberts-mobile-fusspflege.de**

> Handgeschriebene, **7-sprachige** Multi-Page-Website in **Vanilla HTML5, CSS3
> und JavaScript** — ohne Build-Pipeline, ohne Framework, ohne Server-Backend.

> **Status: Staging.** Shop-Artikel und Kundenstimmen sind gekennzeichnete
> Muster-Daten; Suchmaschinen sind bis zum Livegang per `robots.txt` gesperrt.

---

## Überblick

Die Website ist bewusst als **statische Site** umgesetzt: Alle Seiten werden als
vorgefertigte HTML-Dokumente ausgeliefert, sämtliche Interaktivität läuft
**client-seitig** in Vanilla JavaScript. Das Ergebnis ist eine schnelle,
wartungsarme und angriffsarme Präsenz — ohne CMS, ohne Datenbank, ohne externe
Laufzeit-Abhängigkeiten.

Besonderheit ist die **vollständige Mehrsprachigkeit**: 7 Sprachen (Deutsch,
Türkisch, Englisch, Polnisch, Russisch, Arabisch, Chinesisch) inklusive
**RTL-Layout** für Arabisch — umgesetzt ohne Framework, allein über
Sprachordner, `hreflang`-Verweise und eine schlanke Übersetzungs-Schnittstelle
für den produktgetriebenen Shop.

## Merkmale

- **Zero-Build & framework-frei** — kein npm, kein Bundler; direkt auslieferbar.
- **7 Sprachen** — je Sprache ein Ordner (`/tr/ /en/ /pl/ /ru/ /ar/ /zh/`) mit
  vollständig übersetzten Seiten; Arabisch mit `dir="rtl"` (logische
  CSS-Eigenschaften machen das Layout spiegelbar), Chinesisch mit
  System-Schrift-Override; Sprachwahl mit Flaggen-Menü in der Kopfleiste.
- **Mehrsprachiger Shop** — 8 Bereiche × 16 Artikel; ein Datenmodell
  (`js/produkte.js`), pro Sprache eine Übersetzungs-Datei (`js/shop-<code>.js`)
  mit eingebautem Rückfall aufs Deutsche; Bestell-Anfragen erreichen den
  Betreiber immer auf Deutsch.
- **Design-Tokens** — Theming über CSS Custom Properties, hell/dunkel
  umschaltbar, persistiert in `localStorage`, ohne Flash of Unstyled Content.
- **Datenschutz als Architektur** — keine Cookies, kein Tracking, keine
  CDN-/Font-Fremdabrufe; interaktive Karte (Leaflet, self-hosted) lädt
  OpenStreetMap-Kacheln erst nach ausdrücklicher Einwilligung
  (**Zwei-Klick-Lösung**).
- **WhatsApp-Direktstart** — Kontakt-, Bewertungs- und Bestell-Wege öffnen die
  WhatsApp-App per `whatsapp://`-Protokoll; `wa.me` dient nur als Rückfall im
  neuen Tab, die Seite geht nie verloren.
- **Barrierefreiheit** — Zielgruppe 45+: Fließtext ≥ 18 px, Klickflächen
  ≥ 44 px, ARIA-Attribute, Tastatur-Bedienung, `prefers-reduced-motion`
  (Hintergrund-Video wird dann zum Standbild).
- **SEO-ready** — `hreflang`-Matrix über alle 65 Seiten, Open Graph & Twitter
  Cards mit eigenem Vorschaubild (1200 × 630), `sitemap.xml` mit
  Sprach-Alternativen, versionierte Assets (`?v=N`).

## Tech-Stack

| Ebene | Umsetzung |
|---|---|
| **Markup** | HTML5, semantisch, ein Dokument je Seite und Sprache |
| **Styling** | CSS3 — Custom Properties, Grid, Flexbox, `clamp()`-Fluid-Typografie, logische Eigenschaften (RTL-fähig) |
| **Interaktion** | Vanilla JavaScript — Warenkorb in `localStorage`, native `<dialog>`-Masken, `IntersectionObserver` (Scroll-Reveal), `MutationObserver` (themenabhängiges Hintergrund-Video) |
| **Karte** | Leaflet 1.9.4 (self-hosted) — OpenStreetMap + Satellit, erst nach Einwilligung |
| **Schriften** | Lora + Source Sans 3, lokal als WOFF2 (DSGVO: keine Font-CDNs) |
| **Bestell-/Kontaktwege** | WhatsApp-Protokoll + `mailto:` — kein Backend, Versand erfolgt bewusst erst in der jeweiligen App |
| **Hosting / CI-CD** | GitHub Pages, Auslieferung aus dem Repo-Root |

## Projektstruktur

```text
norberts-mobile-fusspflege/
├── index.html              Startseite — Hero, Vertrauens-Tafeln, Ablauf in 4 Schritten
├── leistungen.html         Leistungen + Preise, Detail-Masken, kosmetisch/podologisch-Abgrenzung
├── produkte.html           Shop: 8 Bereichs-Kacheln
├── produkt-bereich.html    Shop: Artikel-Liste je Bereich (?bereich=…), Sortierung
├── warenkorb.html          Warenkorb (localStorage)
├── kasse.html              Kasse — Lieferarten, Zahlarten, Bestell-Versand
├── ueber-mich.html         Werdegang, Stationen
├── kundenstimmen.html      Bewertungs-Band + FAQ-Masken + Bewertung abgeben
├── kontakt.html            Kontaktwege, Formular, Online-Terminbuchung, Einzugsgebiets-Karte
├── impressum.html          Impressum (§ 5 DDG, § 19 UStG)
├── datenschutz.html        Datenschutzerklärung (DSGVO, Zwei-Klick-Karte)
├── tr/ en/ pl/ ru/ ar/ zh/ vollständige Sprachversionen (je 9 Seiten)
├── style.css               gesamtes Design — Tokens, Komponenten, hell/dunkel
├── js/
│   ├── thema.js            Themen-Wahl vor dem Rendern (kein FOUC)
│   ├── main.js             Navigation, Masken, Formulare, Karte, WhatsApp-Start
│   ├── produkte.js         Shop-Motor + Datenmodell (Sprach-Schnittstelle)
│   ├── shop-<code>.js      Übersetzungen je Sprache (Texte, Kategorien, Artikel)
│   └── extern/             Leaflet (self-hosted)
├── bilder/                 Fotos, Kacheln, Hintergrund-Videos, OG-Bild, Icons
├── schriften/              Lora + Source Sans 3 (WOFF2)
├── sitemap.xml             65 URLs mit hreflang-Alternativen
└── robots.txt              Staging-Sperre (bis zum Livegang)
```

## Architektur

Es gibt **kein Templating**: Kopf- und Fußleiste sind bewusst je Seite
dupliziert — der klassische Trade-off statischer Sites zugunsten von
Einfachheit. Die **Mehrsprachigkeit** folgt demselben Prinzip: Jede Sprachseite
ist ein eigenständiges, vollständig übersetztes Dokument mit korrekten
`lang`-/`dir`-Attributen und wechselseitigen `hreflang`-Verweisen.

Der **Shop** trennt Daten und Darstellung: `js/produkte.js` hält das deutsche
Datenmodell und rendert Katalog, Warenkorb und Kasse; Sprachseiten laden davor
eine kleine Übersetzungs-Datei, die Oberflächentexte, Kategorie-Titel und
Artikel-Übersetzungen als globale Objekte bereitstellt. Fehlt ein Eintrag,
greift automatisch das deutsche Original — die Bestell-Nachricht an den
Betreiber wird grundsätzlich aus den deutschen Bezeichnungen erzeugt.

Die **Einzugsgebiets-Karte** ist die einzige Stelle mit Fremdabruf: Ein lokal
gespeichertes Vorschaubild steht stellvertretend, erst der Klick
„Karte aktivieren" (Einwilligung, in `localStorage` gemerkt) lädt
OpenStreetMap-/Satellit-Kacheln in das self-hosted Leaflet.

## Design-System — „Petrol & Gold"

- Farbwelt als CSS Custom Properties; helles Thema als Standard (warmes
  Papierweiß), dunkles Grün-Anthrazit als Alternative.
- Kennfarben-System (`--lk`) für Tafeln, Knöpfe und Bereiche — eine Klasse
  färbt Oberlinie, Symbol und Titel konsistent.
- Typografie: Lora (Titel) + Source Sans 3 (Text), fluide Skalierung über
  `clamp()`; Layout-Grundsatz: Symmetrie, bündige Kanten, gleich große Kacheln.
- Themenabhängige **Video-Hintergründe** (nahtlose Palindrom-Schleifen, lokal)
  mit Farbschleier; bei `prefers-reduced-motion` nur ein Standbild.

## Rechtlicher Rahmen

Der Betreiber ist **kosmetischer** Fußpfleger: Wortwahl und Inhalte sind in
allen 7 Sprachen strikt vom geschützten Berufsbild der Podologie abgegrenzt
(Podologengesetz). Eine eigene Gegenüberstellung auf der Leistungs-Seite
erklärt die Grenze; medizinische Fälle werden ausdrücklich an staatlich
ausgebildete Podologinnen und Podologen verwiesen. Kleinunternehmer-Regelung
nach § 19 UStG — es wird keine Umsatzsteuer ausgewiesen.

## Lokale Entwicklung

Kein Toolchain-Setup nötig:

```bash
git clone https://github.com/Cehha79/norberts-mobile-fusspflege.git
# index.html im Browser öffnen — fertig.
```

Design zentral in `style.css`, Shop-Daten in `js/produkte.js`. Nach Änderungen
an CSS/JS wird die Versionsnummer im Query-String (`?v=N`) in **allen** Seiten
gemeinsam erhöht (Cache-Busting). Text-Änderungen werden in allen
Sprachordnern nachgezogen.

## Deployment

```
Commit  →  push origin main  →  pages-build-deployment  →  GitHub Pages
```

Beim Livegang wird die Domain `norberts-mobile-fusspflege.de` per `CNAME`
aufgeschaltet und die Staging-Sperre in `robots.txt` entfernt.

---

<sub>Gestaltungsprinzip: Symmetrie, Struktur, schlicht und professionell. · Konzeption & Entwicklung: [MikaTec](https://www.mika-tec.com) — **Hasan Tepegöz** · © Norberts mobile Fußpflege</sub>
