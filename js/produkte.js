// Norberts mobile Fußpflege — Shop (Katalog, Warenkorb-Seite, Kasse).
// ACHTUNG: Alle Artikel sind MUSTER-DATEN (nur zur Ansicht) — vor dem
// Livegang durch Norberts echte Produkte und Preise ersetzen!
// Warenkorb liegt in localStorage ('nf-warenkorb'); die Bestellung geht
// per WhatsApp oder E-Mail raus (kein Bezahlsystem auf der Seite).
(function () {
  'use strict';

  var KORB_KEY = 'nf-warenkorb';

  /* ===== Sprach-Unterstützung =====
     Die Sprachordner (en/tr/pl/ru/ar/zh) laden VOR diesem Skript eine Datei
     js/shop-<code>.js, die Übersetzungen und die Pfad-Basis bereitstellt:
       window.NF_BASIS        = '../'  (Bilder liegen eine Ebene höher)
       window.NF_TEXTE        = { artikel: '…', inDenKorb: '…', … }
       window.NF_KATEGORIEN   = { w: '…', c: '…', … }
       window.NF_UEBERSETZUNG = { w1: { name, info, inhalt }, … }
     Ohne diese Datei bleibt alles deutsch (Standard).
     WICHTIG: Der Bestelltext an Norbert nutzt IMMER die deutschen Namen. */
  var BASIS = window.NF_BASIS || '';
  var U = window.NF_UEBERSETZUNG || {};
  var KAT_U = window.NF_KATEGORIEN || {};
  var T = window.NF_TEXTE || {};
  function txt(schluessel, standard) { return T[schluessel] || standard; }
  function pName(p)   { var u = U[p.id]; return (u && u.name)   || p.name; }
  function pInfo(p)   { var u = U[p.id]; return (u && u.info)   || p.info; }
  function pInhalt(p) { var u = U[p.id]; return (u && u.inhalt) || p.inhalt; }
  function katTitel(kat) { return KAT_U[kat] || KATEGORIEN[kat].titel; }
  function badgeText(b) {
    if (b === 'Neu') return txt('badgeNeu', 'Neu');
    if (b === 'Bestseller') return txt('badgeBestseller', 'Bestseller');
    return b;
  }

  /* ================= Kategorien =================
     8 Bereiche — Hygiene & Desinfektion wurde in Werkzeuge & Instrumente
     zusammengelegt (Hasans Vorgabe, 07.07.); die d-Artikel tragen kat 'w'. */
  var KATEGORIEN = {
    w: { titel: 'Werkzeuge, Instrumente & Hygiene', farbe: 'lk-blau',   bild: 'bilder/kachel-werkzeuge.jpg' },
    c: { titel: 'Cremes & Balsame',                 farbe: 'lk-gruen',  bild: 'bilder/kachel-cremes.jpg' },
    e: { titel: 'Elektrische Geräte',               farbe: 'lk-gold',   bild: 'bilder/kachel-geraete.jpg' },
    b: { titel: 'Fußbäder & Zusätze',               farbe: 'lk-rot',    bild: 'bilder/kachel-fussbaeder.jpg' },
    n: { titel: 'Nagelpflege',                      farbe: 'lk-petrol', bild: 'bilder/kachel-nagelpflege.jpg' },
    h: { titel: 'Hornhaut & Peeling',               farbe: 'lk-orange', bild: 'bilder/kachel-hornhaut.jpg' },
    k: { titel: 'Komfort & Entlastung',             farbe: 'lk-blau',   bild: 'bilder/kachel-komfort.jpg' },
    g: { titel: 'Geschenke & Gutscheine',           farbe: 'lk-gold',   bild: 'bilder/kachel-geschenke.jpg' }
  };

  /* ================= Muster-Produkte (je Kategorie 10) ================= */
  var PRODUKTE = [
    /* --- Werkzeuge & Instrumente --- */
    { id: 'w1',  kat: 'w', name: 'Hornhautzange Edelstahl',        info: 'Rostfreier Edelstahl, präziser Schliff – für die schonende Abtragung.', inhalt: '1 Stück · 14 cm',  preis: 24.90, sterne: 4.8, stimmen: 41, lager: 'ok',    badge: 'Bestseller' },
    { id: 'w2',  kat: 'w', name: 'Nagelzange Profi',               info: 'Kraftvolle Übersetzung, sauberer Schnitt auch bei kräftigen Nägeln.',   inhalt: '1 Stück · 12 cm',  preis: 19.90, sterne: 4.7, stimmen: 33, lager: 'ok',    badge: '' },
    { id: 'w4',  kat: 'w', name: 'Instrumenten-Etui 3-teilig',     info: 'Zange, Feile und Schaber im Leder-Etui – ideal für unterwegs.',         inhalt: 'Set, 3-teilig',    preis: 34.90, sterne: 4.6, stimmen: 12, lager: 'wenig', badge: '' },
    { id: 'w5',  kat: 'w', name: 'Fußpflege-Schaber mit Klinge',   info: 'Sicherer Halt, austauschbare Klingen – nur für geübte Hände.',          inhalt: '1 Stück + 10 Klingen', preis: 14.90, sterne: 4.3, stimmen: 27, lager: 'ok', badge: '' },
    { id: 'w6',  kat: 'w', name: 'Zehen-Schere gebogen',           info: 'Gebogene Klinge folgt der Nagelform – sanft und genau.',                inhalt: '1 Stück · 10 cm',  preis: 12.90, sterne: 4.6, stimmen: 22, lager: 'ok',    badge: '' },
    { id: 'w7',  kat: 'w', name: 'Nagelhaut-Schieber Doppelkopf',  info: 'Schiebt und löst die Nagelhaut – zwei Arbeitsenden.',                   inhalt: '1 Stück',          preis: 8.90,  sterne: 4.4, stimmen: 16, lager: 'ok',    badge: '' },
    { id: 'w9',  kat: 'w', name: 'Instrumenten-Reinigungsbürste',  info: 'Feine Messingborsten – hält Feilen und Fräser sauber.',                 inhalt: '1 Stück',          preis: 5.90,  sterne: 4.2, stimmen: 11, lager: 'ok',    badge: '' },
    { id: 'w10', kat: 'w', name: 'Starter-Set Fußpflege',          info: 'Die 6 wichtigsten Werkzeuge im Etui – der ideale Einstieg.',            inhalt: 'Set, 6-teilig',    preis: 49.90, sterne: 4.9, stimmen: 54, lager: 'ok',    badge: 'Neu' },

    /* --- Cremes & Balsame --- */
    { id: 'c1',  kat: 'c', name: 'Fußcreme Urea 10 %',             info: 'Intensive Feuchtigkeit für trockene, beanspruchte Füße.',               inhalt: '100 ml',  grund: '8,90 € / 100 ml',   preis: 8.90,  sterne: 4.8, stimmen: 78, lager: 'ok',    badge: 'Bestseller' },
    { id: 'c2',  kat: 'c', name: 'Fußbalsam Ringelblume',          info: 'Beruhigt und pflegt – mit Calendula und Bienenwachs.',                  inhalt: '75 ml',   grund: '13,20 € / 100 ml',  preis: 9.90,  sterne: 4.7, stimmen: 45, lager: 'ok',    badge: '' },
    { id: 'c3',  kat: 'c', name: 'Schrunden-Salbe intensiv',       info: 'Reichhaltige Pflege für sehr trockene Fersen.',                         inhalt: '75 ml',   grund: '15,87 € / 100 ml',  preis: 11.90, sterne: 4.6, stimmen: 39, lager: 'ok',    badge: '' },
    { id: 'c4',  kat: 'c', name: 'Fußdeo-Spray frisch',            info: 'Langanhaltende Frische, dermatologisch getestet.',                      inhalt: '100 ml',  grund: '7,90 € / 100 ml',   preis: 7.90,  sterne: 4.4, stimmen: 31, lager: 'ok',    badge: '' },
    { id: 'c5',  kat: 'c', name: 'Fußbutter Sheabutter',           info: 'Zart schmelzende Pflege für die Nacht – mit Shea und Mandel.',          inhalt: '150 ml',  grund: '8,60 € / 100 ml',   preis: 12.90, sterne: 4.7, stimmen: 26, lager: 'wenig', badge: '' },
    { id: 'c6',  kat: 'c', name: 'Kühlendes Fußgel Minze',         info: 'Erfrischt müde Beine und Füße – zieht schnell ein.',                    inhalt: '100 ml',  grund: '6,90 € / 100 ml',   preis: 6.90,  sterne: 4.3, stimmen: 18, lager: 'ok',    badge: '' },
    { id: 'c7',  kat: 'c', name: 'Massageöl Rosmarin',             info: 'Wärmendes Öl für die Fußmassage zu Hause.',                             inhalt: '100 ml',  grund: '10,90 € / 100 ml',  preis: 10.90, sterne: 4.6, stimmen: 14, lager: 'ok',    badge: '' },
    { id: 'c8',  kat: 'c', name: 'Anti-Hornhaut-Creme',            info: 'Weicht Verhärtungen über Nacht sichtbar auf.',                          inhalt: '75 ml',   grund: '17,20 € / 100 ml',  preis: 12.90, sterne: 4.5, stimmen: 23, lager: 'ok',    badge: '' },
    { id: 'c9',  kat: 'c', name: 'Pflegeschaum Express',           info: 'Zieht in Sekunden ein – Pflege ohne Warten.',                           inhalt: '125 ml',  grund: '9,52 € / 100 ml',   preis: 11.90, sterne: 4.6, stimmen: 37, lager: 'ok',    badge: 'Neu' },
    { id: 'c10', kat: 'c', name: 'Winterpflege-Duo',               info: 'Fußcreme + Schrundensalbe im Vorteils-Set.',                            inhalt: 'Set, 2 × 75 ml',   preis: 18.90, sterne: 4.8, stimmen: 21, lager: 'ok',    badge: '' },
    { id: 'c11', kat: 'c', name: 'Fußcreme Urea 25 % intensiv',    info: 'Die starke Stufe für sehr trockene, rissige Haut.',                     inhalt: '75 ml',   grund: '18,53 € / 100 ml',  preis: 13.90, sterne: 4.7, stimmen: 34, lager: 'ok',    badge: '' },
    { id: 'c12', kat: 'c', name: 'Nachtkerzenöl-Balsam',           info: 'Beruhigt gereizte, empfindliche Haut über Nacht.',                      inhalt: '50 ml',   grund: '19,80 € / 100 ml',  preis: 9.90,  sterne: 4.5, stimmen: 12, lager: 'ok',    badge: '' },
    { id: 'c13', kat: 'c', name: 'Zink-Pflegecreme',               info: 'Unterstützt beanspruchte Haut – zieht schnell ein.',                    inhalt: '50 ml',   grund: '17,80 € / 100 ml',  preis: 8.90,  sterne: 4.4, stimmen: 16, lager: 'ok',    badge: '' },
    { id: 'c14', kat: 'c', name: 'Wärmender Fußbalsam Ingwer',     info: 'Angenehme Wärme für kalte Füße – ideal im Winter.',                     inhalt: '75 ml',   grund: '15,87 € / 100 ml',  preis: 11.90, sterne: 4.6, stimmen: 23, lager: 'ok',    badge: '' },
    { id: 'c15', kat: 'c', name: 'Sensitiv-Creme parfümfrei',      info: 'Ohne Duft- und Farbstoffe – für empfindliche Haut.',                    inhalt: '100 ml',  grund: '9,90 € / 100 ml',   preis: 9.90,  sterne: 4.5, stimmen: 18, lager: 'wenig', badge: '' },
    { id: 'c16', kat: 'c', name: 'Pflege-Trio Probiergrößen',      info: 'Creme, Balsam und Schaum zum Kennenlernen.',                            inhalt: 'Set, 3 × 30 ml',   preis: 14.90, sterne: 4.6, stimmen: 9,  lager: 'ok',    badge: 'Neu' },

    /* --- Elektrische Geräte --- */
    { id: 'e1',  kat: 'e', name: 'Elektrische Hornhaut-Feile',     info: 'Zwei Geschwindigkeiten, aufladbar – sanft glatte Fersen.',              inhalt: '1 Gerät + 2 Rollen', preis: 29.90, sterne: 4.6, stimmen: 63, lager: 'ok',    badge: 'Bestseller' },
    { id: 'e2',  kat: 'e', name: 'Nagelfräser-Set 10-teilig',      info: 'Leises Gerät mit 10 Aufsätzen für Nagel- und Hornhautpflege.',          inhalt: '1 Set',            preis: 49.90, sterne: 4.5, stimmen: 48, lager: 'ok',    badge: '' },
    { id: 'e3',  kat: 'e', name: 'Fußsprudelbad mit Wärme',        info: 'Sprudel, Vibration und Wärmefunktion – Wellness zu Hause.',             inhalt: '1 Gerät',          preis: 59.90, sterne: 4.4, stimmen: 52, lager: 'ok',    badge: '' },
    { id: 'e4',  kat: 'e', name: 'Ersatz-Schleifrollen (3er)',     info: 'Passend zur Hornhaut-Feile – Körnung mittel.',                          inhalt: '3 Stück',          preis: 9.90,  sterne: 4.7, stimmen: 29, lager: 'ok',    badge: '' },
    { id: 'e5',  kat: 'e', name: 'UV-Trockner für Pflegelack',     info: 'Trocknet Pflegelacke in 60 Sekunden.',                                  inhalt: '1 Gerät',          preis: 24.90, sterne: 4.2, stimmen: 13, lager: 'wenig', badge: '' },
    { id: 'e6',  kat: 'e', name: 'Elektrische Nagelfeile Stift',   info: 'Handlich wie ein Stift – für Form und Glanz.',                          inhalt: '1 Gerät + 4 Aufsätze', preis: 19.90, sterne: 4.3, stimmen: 17, lager: 'ok', badge: '' },
    { id: 'e7',  kat: 'e', name: 'Massagegerät Shiatsu Fuß',       info: 'Kreisende Massageköpfe mit Wärme – entspannt tief.',                    inhalt: '1 Gerät',          preis: 79.90, sterne: 4.6, stimmen: 34, lager: 'ok',    badge: '' },
    { id: 'e8',  kat: 'e', name: 'Ersatz-Fräser-Aufsätze (5er)',   info: 'Feine Diamant-Aufsätze für das Fräser-Set.',                            inhalt: '5 Stück',          preis: 14.90, sterne: 4.5, stimmen: 15, lager: 'ok',    badge: '' },
    { id: 'e9',  kat: 'e', name: 'Paraffinbad für Füße',           info: 'Warmes Paraffin für samtweiche Haut – inkl. 450 g Wachs.',              inhalt: '1 Gerät + Wachs',  preis: 44.90, sterne: 4.4, stimmen: 20, lager: 'ok',    badge: 'Neu' },
    { id: 'e10', kat: 'e', name: 'Reise-Etui für Geräte',          info: 'Gepolstertes Hardcase für Feile, Fräser und Zubehör.',                  inhalt: '1 Stück',          preis: 16.90, sterne: 4.3, stimmen: 8,  lager: 'ok',    badge: '' },
    { id: 'e11', kat: 'e', name: 'Akku-Nagelpolierer',             info: 'Polieren und versiegeln – kabellos, mit 3 Aufsätzen.',                  inhalt: '1 Gerät + 3 Aufsätze', preis: 22.90, sterne: 4.4, stimmen: 21, lager: 'ok',    badge: '' },
    { id: 'e12', kat: 'e', name: 'UV-Desinfektionsbox',            info: 'Desinfiziert Instrumente in 8 Minuten – ohne Chemie.',                  inhalt: '1 Gerät',          preis: 34.90, sterne: 4.5, stimmen: 17, lager: 'ok',    badge: '' },
    { id: 'e13', kat: 'e', name: 'Ersatz-Schleifrollen fein (3er)', info: 'Feine Körnung für das Finish nach der Hornhaut-Feile.',                inhalt: '3 Stück',          preis: 9.90,  sterne: 4.6, stimmen: 24, lager: 'ok',    badge: '' },
    { id: 'e14', kat: 'e', name: 'Mini-Fräser im Reiseformat',     info: 'Klein wie ein Kugelschreiber – volle Leistung unterwegs.',              inhalt: '1 Gerät + 2 Aufsätze', preis: 24.90, sterne: 4.3, stimmen: 13, lager: 'wenig', badge: '' },
    { id: 'e15', kat: 'e', name: 'Elektrischer Fußwärmer',         info: 'Kuscheliger Wärmeschuh mit 3 Stufen und Abschaltautomatik.',            inhalt: '1 Gerät',          preis: 39.90, sterne: 4.6, stimmen: 28, lager: 'ok',    badge: '' },
    { id: 'e16', kat: 'e', name: 'Luftkompressions-Massagegerät',  info: 'Sanfter Wechseldruck für Füße und Waden – 2 Manschetten.',              inhalt: '1 Gerät',          preis: 89.90, sterne: 4.5, stimmen: 11, lager: 'ok',    badge: 'Neu' },

    /* --- Fußbäder & Zusätze --- */
    { id: 'b1',  kat: 'b', name: 'Fußbad-Salz Totes Meer',         info: 'Mineralstoffreiches Salz – entspannt und pflegt.',                      inhalt: '500 g',  grund: '13,80 € / 1 kg',   preis: 6.90,  sterne: 4.7, stimmen: 44, lager: 'ok',    badge: 'Bestseller' },
    { id: 'b2',  kat: 'b', name: 'Fußbad-Zusatz Rosmarin',         info: 'Belebender Badezusatz für müde Füße.',                                  inhalt: '250 ml', grund: '3,96 € / 100 ml',  preis: 9.90,  sterne: 4.5, stimmen: 25, lager: 'ok',    badge: '' },
    { id: 'b3',  kat: 'b', name: 'Sprudel-Tabs Lavendel (8er)',    info: 'Ein Tab pro Fußbad – beruhigender Lavendelduft.',                       inhalt: '8 Tabs',           preis: 5.90,  sterne: 4.4, stimmen: 30, lager: 'ok',    badge: '' },
    { id: 'b4',  kat: 'b', name: 'Fußwanne klappbar',              info: 'Platzsparend faltbar, mit Anti-Rutsch-Boden.',                          inhalt: '1 Stück',          preis: 17.90, sterne: 4.6, stimmen: 38, lager: 'ok',    badge: '' },
    { id: 'b5',  kat: 'b', name: 'Milchbad für Füße',              info: 'Cremiger Badezusatz mit Milchproteinen.',                               inhalt: '400 ml', grund: '2,98 € / 100 ml',  preis: 11.90, sterne: 4.5, stimmen: 16, lager: 'ok',    badge: '' },
    { id: 'b6',  kat: 'b', name: 'Basisches Fußbad-Pulver',        info: 'Basischer pH-Wert für ein wohliges, langes Bad.',                       inhalt: '300 g',  grund: '33,00 € / 1 kg',   preis: 9.90,  sterne: 4.3, stimmen: 21, lager: 'wenig', badge: '' },
    { id: 'b7',  kat: 'b', name: 'Fußbad-Thermometer',             info: 'Zeigt die ideale Wassertemperatur auf einen Blick.',                    inhalt: '1 Stück',          preis: 7.90,  sterne: 4.2, stimmen: 9,  lager: 'ok',    badge: '' },
    { id: 'b8',  kat: 'b', name: 'Massage-Bürste für das Bad',     info: 'Weiche Noppen massieren die Sohle im Fußbad.',                          inhalt: '1 Stück',          preis: 6.90,  sterne: 4.4, stimmen: 12, lager: 'ok',    badge: '' },
    { id: 'b9',  kat: 'b', name: 'Eukalyptus-Badeöl',              info: 'Erfrischendes Öl – zwei Kappen pro Fußbad genügen.',                    inhalt: '200 ml', grund: '6,45 € / 100 ml',  preis: 12.90, sterne: 4.6, stimmen: 18, lager: 'ok',    badge: 'Neu' },
    { id: 'b10', kat: 'b', name: 'Fußbad-Set komplett',            info: 'Wanne, Salz, Bürste und Handtuch im Set.',                              inhalt: 'Set, 4-teilig',    preis: 29.90, sterne: 4.8, stimmen: 27, lager: 'ok',    badge: '' },
    { id: 'b11', kat: 'b', name: 'Fußbad-Salz Lavendel',           info: 'Beruhigender Lavendel für das Bad am Abend.',                           inhalt: '500 g',  grund: '15,80 € / 1 kg',   preis: 7.90,  sterne: 4.6, stimmen: 26, lager: 'ok',    badge: '' },
    { id: 'b12', kat: 'b', name: 'Sprudel-Tabs Minze (8er)',       info: 'Erfrischende Minze – ein Tab pro Fußbad.',                              inhalt: '8 Tabs',           preis: 5.90,  sterne: 4.3, stimmen: 14, lager: 'ok',    badge: '' },
    { id: 'b13', kat: 'b', name: 'Fußbad-Zusatz Kamille',          info: 'Milder Klassiker für empfindliche Haut.',                               inhalt: '250 ml', grund: '3,56 € / 100 ml',  preis: 8.90,  sterne: 4.5, stimmen: 19, lager: 'ok',    badge: '' },
    { id: 'b14', kat: 'b', name: 'Teebaumöl-Badezusatz',           info: 'Der frische Zusatz für beanspruchte Füße.',                             inhalt: '100 ml', grund: '9,90 € / 100 ml',  preis: 9.90,  sterne: 4.4, stimmen: 15, lager: 'ok',    badge: '' },
    { id: 'b15', kat: 'b', name: 'Fußwanne mit Massage-Noppen',    info: 'Noppenboden massiert die Sohle schon beim Baden.',                      inhalt: '1 Stück',          preis: 21.90, sterne: 4.5, stimmen: 22, lager: 'wenig', badge: '' },
    { id: 'b16', kat: 'b', name: 'Fußbad-Duo Salz & Öl',           info: 'Totes-Meer-Salz und Eukalyptus-Öl im Vorteils-Set.',                    inhalt: 'Set, 2-teilig',    preis: 16.90, sterne: 4.7, stimmen: 10, lager: 'ok',    badge: 'Neu' },

    /* --- Nagelpflege --- */
    { id: 'n1',  kat: 'n', name: 'Nagelöl mit Pipette',            info: 'Jojoba und Vitamin E – kräftigt Nagel und Nagelhaut.',                  inhalt: '10 ml',  grund: '129,00 € / 100 ml', preis: 12.90, sterne: 4.8, stimmen: 56, lager: 'ok',    badge: 'Bestseller' },
    { id: 'n2',  kat: 'n', name: 'Nagelknipser XL',                info: 'Extra große Auflage – auch für kräftige Zehennägel.',                   inhalt: '1 Stück',          preis: 9.90,  sterne: 4.6, stimmen: 42, lager: 'ok',    badge: '' },
    { id: 'n3',  kat: 'n', name: 'Glasfeile im Etui',              info: 'Versiegelt die Nagelkante – ein Leben lang scharf.',                    inhalt: '1 Stück',          preis: 8.90,  sterne: 4.7, stimmen: 35, lager: 'ok',    badge: '' },
    { id: 'n4',  kat: 'n', name: 'Nagelpflege-Stift 2 in 1',       info: 'Öl-Stift und Schieber in einem – für unterwegs.',                       inhalt: '1 Stück',          preis: 10.90, sterne: 4.4, stimmen: 19, lager: 'ok',    badge: '' },
    { id: 'n5',  kat: 'n', name: 'Pflegelack farblos',             info: 'Stärkender Unterlack mit seidigem Glanz.',                              inhalt: '10 ml',  grund: '99,00 € / 100 ml',  preis: 9.90,  sterne: 4.3, stimmen: 24, lager: 'ok',    badge: '' },
    { id: 'n6',  kat: 'n', name: 'Buffer-Block 4 Seiten',          info: 'Feilen, glätten, polieren, versiegeln – ein Block.',                    inhalt: '1 Stück',          preis: 4.90,  sterne: 4.2, stimmen: 15, lager: 'ok',    badge: '' },
    { id: 'n7',  kat: 'n', name: 'Nagelhaut-Entferner Gel',        info: 'Löst überschüssige Nagelhaut in 60 Sekunden.',                          inhalt: '30 ml',  grund: '29,67 € / 100 ml',  preis: 8.90,  sterne: 4.4, stimmen: 22, lager: 'wenig', badge: '' },
    { id: 'n8',  kat: 'n', name: 'Nagel-Reparatur-Serum',          info: 'Baut brüchige Nägel in 4 Wochen sichtbar auf.',                         inhalt: '15 ml',  grund: '99,33 € / 100 ml',  preis: 14.90, sterne: 4.5, stimmen: 17, lager: 'ok',    badge: 'Neu' },
    { id: 'n9',  kat: 'n', name: 'Feilen-Set Körnung mix (6er)',   info: 'Sechs Feilen von grob bis superfein.',                                  inhalt: '6 Stück',          preis: 7.90,  sterne: 4.3, stimmen: 13, lager: 'ok',    badge: '' },
    { id: 'n10', kat: 'n', name: 'Nagelpflege-Komplettset',        info: 'Öl, Knipser, Glasfeile und Stift im Geschenkkarton.',                   inhalt: 'Set, 4-teilig',    preis: 34.90, sterne: 4.9, stimmen: 31, lager: 'ok',    badge: '' },
    { id: 'n11', kat: 'n', name: 'Nagelhaut-Öl Rosenduft',         info: 'Pflegt die Nagelhaut – mit zartem Rosenduft.',                          inhalt: '10 ml',  grund: '119,00 € / 100 ml', preis: 11.90, sterne: 4.5, stimmen: 14, lager: 'ok',    badge: '' },
    { id: 'n12', kat: 'n', name: 'Nagelweiß-Stift',                info: 'Frischt den freien Nagelrand sichtbar auf.',                            inhalt: '1 Stück',          preis: 6.90,  sterne: 4.2, stimmen: 11, lager: 'ok',    badge: '' },
    { id: 'n13', kat: 'n', name: 'Nagelschere gerade',             info: 'Gerader Schnitt beugt eingewachsenen Ecken vor.',                       inhalt: '1 Stück · 10 cm',  preis: 10.90, sterne: 4.6, stimmen: 20, lager: 'ok',    badge: '' },
    { id: 'n14', kat: 'n', name: 'Sandblatt-Feilen (10er)',        info: 'Nachfüllpack für die tägliche Nagelpflege.',                            inhalt: '10 Stück',         preis: 5.90,  sterne: 4.3, stimmen: 9,  lager: 'ok',    badge: '' },
    { id: 'n15', kat: 'n', name: 'Nagelhärter-Lack',               info: 'Härtet weiche Nägel in 2 Wochen spürbar.',                              inhalt: '10 ml',  grund: '119,00 € / 100 ml', preis: 11.90, sterne: 4.4, stimmen: 16, lager: 'wenig', badge: '' },
    { id: 'n16', kat: 'n', name: 'Maniküre-Etui 7-teilig',         info: 'Alle Nagel-Werkzeuge im Reißverschluss-Etui.',                          inhalt: 'Set, 7-teilig',    preis: 29.90, sterne: 4.7, stimmen: 13, lager: 'ok',    badge: 'Neu' },

    /* --- Hornhaut & Peeling --- */
    { id: 'h1',  kat: 'h', name: 'Bimsstein Natur',                info: 'Echter Vulkan-Bims – der Klassiker für die Dusche.',                    inhalt: '1 Stück',          preis: 4.90,  sterne: 4.5, stimmen: 48, lager: 'ok',    badge: '' },
    { id: 'h2',  kat: 'h', name: 'Hornhaut-Raspel 2-seitig',       info: 'Grobe und feine Seite – für Ferse und Ballen.',                         inhalt: '1 Stück',          preis: 8.90,  sterne: 4.6, stimmen: 39, lager: 'ok',    badge: 'Bestseller' },
    { id: 'h3',  kat: 'h', name: 'Fuß-Peeling Meersalz',           info: 'Feines Salz-Peeling mit Mandelöl – samtige Haut.',                      inhalt: '150 ml', grund: '6,60 € / 100 ml',  preis: 9.90,  sterne: 4.7, stimmen: 28, lager: 'ok',    badge: '' },
    { id: 'h4',  kat: 'h', name: 'Hornhaut-Reduziercreme',         info: 'Tägliche Pflege, die neuer Hornhaut vorbeugt.',                         inhalt: '75 ml',  grund: '17,20 € / 100 ml',  preis: 12.90, sterne: 4.4, stimmen: 33, lager: 'ok',    badge: '' },
    { id: 'h5',  kat: 'h', name: 'Peeling-Socken (1 Paar)',        info: 'Einwirken, abziehen, staunen – Erneuerung in 7 Tagen.',                 inhalt: '1 Paar',           preis: 11.90, sterne: 4.2, stimmen: 51, lager: 'ok',    badge: '' },
    { id: 'h6',  kat: 'h', name: 'Zucker-Peeling Vanille',         info: 'Sanftes Peeling für empfindliche Haut.',                                inhalt: '200 ml', grund: '5,45 € / 100 ml',  preis: 10.90, sterne: 4.5, stimmen: 16, lager: 'ok',    badge: '' },
    { id: 'h7',  kat: 'h', name: 'Keramik-Hornhautstein',          info: 'Feiner als Bims – ideal fürs Finish.',                                  inhalt: '1 Stück',          preis: 6.90,  sterne: 4.3, stimmen: 14, lager: 'wenig', badge: '' },
    { id: 'h8',  kat: 'h', name: 'Peeling-Handschuh Sisal',        info: 'Naturfaser-Handschuh für Füße und Beine.',                              inhalt: '1 Stück',          preis: 5.90,  sterne: 4.2, stimmen: 10, lager: 'ok',    badge: '' },
    { id: 'h9',  kat: 'h', name: 'Urea-Maske für die Füße',        info: 'Intensivmaske mit 15 % Urea – über Nacht einwirken.',                   inhalt: '100 ml', grund: '13,90 € / 100 ml', preis: 13.90, sterne: 4.6, stimmen: 20, lager: 'ok',    badge: 'Neu' },
    { id: 'h10', kat: 'h', name: 'Glatte-Füße-Set',                info: 'Raspel, Peeling und Reduziercreme im Set.',                             inhalt: 'Set, 3-teilig',    preis: 24.90, sterne: 4.8, stimmen: 23, lager: 'ok',    badge: '' },
    { id: 'h11', kat: 'h', name: 'Hobel-Ersatzklingen (10er)',     info: 'Passend zum Fußpflege-Schaber – einzeln versiegelt.',                   inhalt: '10 Stück',         preis: 4.90,  sterne: 4.3, stimmen: 12, lager: 'ok',    badge: '' },
    { id: 'h12', kat: 'h', name: 'Fußbürste mit Bims-Rücken',      info: 'Borsten und Bimsstein in einem Griff.',                                 inhalt: '1 Stück',          preis: 7.90,  sterne: 4.4, stimmen: 17, lager: 'ok',    badge: '' },
    { id: 'h13', kat: 'h', name: 'Kaffee-Peeling belebend',        info: 'Gemahlener Kaffee und Kokosöl – weckt müde Füße.',                      inhalt: '200 ml', grund: '5,95 € / 100 ml',  preis: 11.90, sterne: 4.5, stimmen: 13, lager: 'ok',    badge: '' },
    { id: 'h14', kat: 'h', name: 'Hornhaut-Balsam Urea 10 %',      info: 'Tägliche Pflege nach Raspel oder Feile.',                               inhalt: '100 ml', grund: '10,90 € / 100 ml', preis: 10.90, sterne: 4.5, stimmen: 21, lager: 'ok',    badge: '' },
    { id: 'h15', kat: 'h', name: 'Peeling-Socken Doppelpack',      info: 'Zwei Anwendungen – für die Kur alle 3 Monate.',                         inhalt: '2 Paar',           preis: 19.90, sterne: 4.3, stimmen: 25, lager: 'ok',    badge: '' },
    { id: 'h16', kat: 'h', name: 'Ferse-glatt-Kur 7 Tage',         info: 'Maske, Balsam und Anleitung für eine Woche.',                           inhalt: 'Set, 2-teilig',    preis: 15.90, sterne: 4.6, stimmen: 8,  lager: 'wenig', badge: 'Neu' },

    /* --- Komfort & Entlastung --- */
    { id: 'k1',  kat: 'k', name: 'Zehenspreizer Gel (2er)',        info: 'Weiches Gel entlastet eng stehende Zehen.',                             inhalt: '2 Stück',          preis: 7.90,  sterne: 4.4, stimmen: 36, lager: 'ok',    badge: '' },
    { id: 'k2',  kat: 'k', name: 'Druckschutz-Ringe (6er)',        info: 'Selbstklebende Polster gegen Reibung im Schuh.',                        inhalt: '6 Stück',          preis: 6.90,  sterne: 4.3, stimmen: 29, lager: 'ok',    badge: '' },
    { id: 'k3',  kat: 'k', name: 'Gel-Fersenkissen (Paar)',        info: 'Dämpft jeden Schritt – zuschneidbar für jeden Schuh.',                  inhalt: '1 Paar',           preis: 11.90, sterne: 4.6, stimmen: 44, lager: 'ok',    badge: 'Bestseller' },
    { id: 'k4',  kat: 'k', name: 'Wellness-Socken kuschelig',      info: 'Flauschige Socken mit ABS-Sohle – nach der Pflege ein Traum.',          inhalt: '1 Paar, Gr. 36–42', preis: 9.90, sterne: 4.7, stimmen: 52, lager: 'ok',   badge: '' },
    { id: 'k5',  kat: 'k', name: 'Zehenschutz-Kappen Gel (4er)',   info: 'Schützen empfindliche Zehen in jedem Schuh.',                           inhalt: '4 Stück',          preis: 8.90,  sterne: 4.2, stimmen: 18, lager: 'ok',    badge: '' },
    { id: 'k6',  kat: 'k', name: 'Ballenpolster selbstklebend',    info: 'Entlastet den Vorfuß bei langem Stehen.',                               inhalt: '4 Stück',          preis: 7.90,  sterne: 4.3, stimmen: 15, lager: 'wenig', badge: '' },
    { id: 'k7',  kat: 'k', name: 'Massage-Roller aus Holz',        info: 'Rollen Sie Verspannungen einfach weg – Buchenholz.',                    inhalt: '1 Stück',          preis: 12.90, sterne: 4.5, stimmen: 26, lager: 'ok',    badge: '' },
    { id: 'k8',  kat: 'k', name: 'Igelball-Duo',                   info: 'Zwei Noppenbälle für die Aktiv-Massage zwischendurch.',                 inhalt: '2 Stück',          preis: 6.90,  sterne: 4.4, stimmen: 21, lager: 'ok',    badge: '' },
    { id: 'k9',  kat: 'k', name: 'Komfort-Einlegesohlen Gel',      info: 'Dämpfende Gel-Sohlen, zuschneidbar Gr. 36–46.',                         inhalt: '1 Paar',           preis: 14.90, sterne: 4.5, stimmen: 30, lager: 'ok',    badge: 'Neu' },
    { id: 'k10', kat: 'k', name: 'Fußgymnastik-Set',               info: 'Ball, Band und Übungsanleitung für starke Füße.',                       inhalt: 'Set, 3-teilig',    preis: 16.90, sterne: 4.6, stimmen: 12, lager: 'ok',    badge: '' },
    { id: 'k11', kat: 'k', name: 'Stütz-Socken leicht (Paar)',     info: 'Sanfte Kompression für lange Tage auf den Beinen.',                     inhalt: '1 Paar, Gr. 36–46', preis: 12.90, sterne: 4.4, stimmen: 19, lager: 'ok',   badge: '' },
    { id: 'k12', kat: 'k', name: 'Fersen-Kissen (Paar)',           info: 'Weiches Polster entlastet die Ferse bei jedem Schritt.',                inhalt: '1 Paar',           preis: 13.90, sterne: 4.5, stimmen: 23, lager: 'ok',    badge: '' },
    { id: 'k13', kat: 'k', name: 'Zehen-Yoga-Spreizer (Paar)',     info: 'Dehnt die Zehen nach einem langen Schuh-Tag.',                          inhalt: '1 Paar',           preis: 9.90,  sterne: 4.3, stimmen: 15, lager: 'ok',    badge: '' },
    { id: 'k14', kat: 'k', name: 'Akupressur-Matte für Füße',      info: 'Noppenfeld für die Fußmassage im Stehen.',                              inhalt: '1 Stück · 35 × 35 cm', preis: 19.90, sterne: 4.4, stimmen: 18, lager: 'ok', badge: '' },
    { id: 'k15', kat: 'k', name: 'Fuß-Wärmflasche Übergröße',      info: 'Extra breit – wärmt beide Füße gleichzeitig.',                          inhalt: '1 Stück · 2 l',    preis: 16.90, sterne: 4.6, stimmen: 14, lager: 'wenig', badge: '' },
    { id: 'k16', kat: 'k', name: 'Anti-Rutsch-Socken (2 Paar)',    info: 'Sicherer Halt auf glatten Böden – waschbar bei 60 °C.',                 inhalt: '2 Paar, Gr. 36–46', preis: 11.90, sterne: 4.5, stimmen: 12, lager: 'ok',   badge: 'Neu' },

    /* --- Hygiene & Desinfektion --- */
    { id: 'd1',  kat: 'w', name: 'Hand-Desinfektionsgel',          info: 'Hautschonend mit Aloe – für unterwegs.',                                inhalt: '100 ml', grund: '4,90 € / 100 ml',  preis: 4.90,  sterne: 4.5, stimmen: 40, lager: 'ok',    badge: '' },
    { id: 'd2',  kat: 'w', name: 'Flächen-Desinfektionsspray',     info: 'Schnell wirksam – für Geräte und Arbeitsflächen.',                      inhalt: '250 ml', grund: '3,16 € / 100 ml',  preis: 7.90,  sterne: 4.6, stimmen: 27, lager: 'ok',    badge: '' },
    { id: 'd3',  kat: 'w', name: 'Einmalhandschuhe Nitril (100)',  info: 'Puderfrei, reißfest – Größe S bis XL.',                                 inhalt: '100 Stück',        preis: 12.90, sterne: 4.7, stimmen: 61, lager: 'ok',    badge: 'Bestseller' },
    { id: 'd4',  kat: 'w', name: 'Fußspray antibakteriell',        info: 'Erfrischt und schützt – ideal nach dem Sport.',                         inhalt: '150 ml', grund: '5,93 € / 100 ml',  preis: 8.90,  sterne: 4.4, stimmen: 25, lager: 'ok',    badge: '' },
    { id: 'd5',  kat: 'w', name: 'Instrumenten-Desinfektionsbad',  info: 'Wanne mit Sieb-Einsatz für die Instrumenten-Pflege.',                   inhalt: '1 Stück · 1 l',    preis: 16.90, sterne: 4.5, stimmen: 14, lager: 'ok',    badge: '' },
    { id: 'd6',  kat: 'w', name: 'Desinfektions-Konzentrat',       info: 'Ergibt bis zu 25 l gebrauchsfertige Lösung.',                           inhalt: '500 ml', grund: '25,80 € / 1 l',    preis: 12.90, sterne: 4.6, stimmen: 19, lager: 'wenig', badge: '' },
    { id: 'd7',  kat: 'w', name: 'Einweg-Unterlagen (50er)',       info: 'Saugstark und hygienisch – 40 × 60 cm.',                                inhalt: '50 Stück',         preis: 11.90, sterne: 4.3, stimmen: 16, lager: 'ok',    badge: '' },
    { id: 'd9',  kat: 'w', name: 'Hygiene-Reise-Set',              info: 'Gel, Spray und Tücher in der Kulturtasche.',                            inhalt: 'Set, 3-teilig',    preis: 14.90, sterne: 4.5, stimmen: 11, lager: 'ok',    badge: 'Neu' },

    /* --- Geschenke & Gutscheine --- */
    { id: 'g1',  kat: 'g', name: 'Gutschein Fachfußpflege',        info: 'Der Klassiker zum Verschenken – die komplette Pflege als Hausbesuch.',  inhalt: '1 Gutschein',      preis: 48.00, sterne: 5.0, stimmen: 24, lager: 'ok',    badge: 'Bestseller' },
    { id: 'g2',  kat: 'g', name: 'Gutschein Fußmassage',           info: 'Entspannung schenken – wohltuende Massage zu Hause.',                   inhalt: '1 Gutschein',      preis: 30.00, sterne: 5.0, stimmen: 15, lager: 'ok',    badge: '' },
    { id: 'g3',  kat: 'g', name: 'Gutschein Reflexzonen-Massage',  info: 'Die ausgiebigste Anwendung als Geschenk.',                              inhalt: '1 Gutschein',      preis: 57.00, sterne: 5.0, stimmen: 12, lager: 'ok',    badge: '' },
    { id: 'g4',  kat: 'g', name: 'Wert-Gutschein 25 €',            info: 'Frei einlösbar für Leistungen und Produkte.',                           inhalt: '1 Gutschein',      preis: 25.00, sterne: 4.9, stimmen: 9,  lager: 'ok',    badge: '' },
    { id: 'g5',  kat: 'g', name: 'Verwöhn-Set „Füße gut"',         info: 'Fußbad-Salz, Creme und Wellness-Socken in der Geschenkbox.',            inhalt: 'Set, 3-teilig',    preis: 24.90, sterne: 4.8, stimmen: 19, lager: 'ok',    badge: '' },
    { id: 'g6',  kat: 'g', name: 'Geschenkbox „Erste Hilfe Füße"', info: 'Peeling, Balsam und Nagelöl – schön verpackt.',                         inhalt: 'Set, 3-teilig',    preis: 29.90, sterne: 4.7, stimmen: 13, lager: 'ok',    badge: '' },
    { id: 'g7',  kat: 'g', name: 'Männer-Set „Fuß-Werk"',          info: 'Raspel, Creme und Frische-Spray für Ihn.',                              inhalt: 'Set, 3-teilig',    preis: 26.90, sterne: 4.6, stimmen: 10, lager: 'wenig', badge: '' },
    { id: 'g8',  kat: 'g', name: 'Grußkarte mit Umschlag',         info: 'Passend zum Gutschein – „Für Dich".',                                   inhalt: '1 Stück',          preis: 2.90,  sterne: 4.5, stimmen: 7,  lager: 'ok',    badge: '' },
    { id: 'g9',  kat: 'g', name: 'Geschenk-Verpackung premium',    info: 'Box, Seidenpapier und Schleife – fertig verpackt.',                     inhalt: '1 Stück',          preis: 4.90,  sterne: 4.6, stimmen: 8,  lager: 'ok',    badge: '' },
    { id: 'g10', kat: 'g', name: 'Jahres-Paket „4 × Pflege"',      info: 'Vier Fachfußpflege-Termine im Voraus – ein Termin geschenkt.',          inhalt: '4 Gutscheine',     preis: 144.00, sterne: 5.0, stimmen: 6, lager: 'ok',    badge: 'Neu' },
    { id: 'g11', kat: 'g', name: 'Wert-Gutschein 50 €',            info: 'Frei einlösbar für Leistungen und Produkte.',                           inhalt: '1 Gutschein',      preis: 50.00, sterne: 4.9, stimmen: 11, lager: 'ok',    badge: '' },
    { id: 'g12', kat: 'g', name: 'Wert-Gutschein 100 €',           info: 'Das große Geschenk – frei einlösbar.',                                  inhalt: '1 Gutschein',      preis: 100.00, sterne: 5.0, stimmen: 7, lager: 'ok',    badge: '' },
    { id: 'g13', kat: 'g', name: 'Duo-Gutschein „Zu zweit"',       info: 'Zwei Fachfußpflege-Termine – z. B. für Paare.',                         inhalt: '2 Gutscheine',     preis: 90.00, sterne: 5.0, stimmen: 5,  lager: 'ok',    badge: '' },
    { id: 'g14', kat: 'g', name: 'Geschenkset „Winterfüße"',       info: 'Wärmender Balsam, Kuschelsocken und Badesalz.',                         inhalt: 'Set, 3-teilig',    preis: 27.90, sterne: 4.7, stimmen: 9,  lager: 'ok',    badge: '' },
    { id: 'g15', kat: 'g', name: 'Kleine Freude',                  info: 'Handliche Fußcreme mit Grußkarte – die Aufmerksamkeit.',                inhalt: 'Set, 2-teilig',    preis: 14.90, sterne: 4.6, stimmen: 8,  lager: 'ok',    badge: '' },
    { id: 'g16', kat: 'g', name: 'Gutschein per E-Mail',           info: 'Sofort verschickt – ideal für Kurzentschlossene.',                      inhalt: '1 Gutschein (PDF)', preis: 25.00, sterne: 4.8, stimmen: 10, lager: 'ok',   badge: 'Neu' },
  ];

  /* ================= Hilfen ================= */
  function euro(betrag) { return betrag.toFixed(2).replace('.', ',') + ' €'; }
  function sterneHtml(wert) {
    var voll = Math.round(wert);
    return '<span class="p-sterne" aria-label="' + wert.toFixed(1).replace('.', ',') + ' ' + txt('vonSternen', 'von 5 Sternen') + '">' +
      '★★★★★'.slice(0, voll) + '<span class="stern-leer">' + '★★★★★'.slice(voll) + '</span></span>';
  }
  function korbLaden() {
    try { return JSON.parse(localStorage.getItem(KORB_KEY)) || {}; } catch (e) { return {}; }
  }
  function korbSpeichern(korb) {
    try { localStorage.setItem(KORB_KEY, JSON.stringify(korb)); } catch (e) {}
    if (window.nfKorbBadge) window.nfKorbBadge();
  }
  function produkt(id) {
    return PRODUKTE.filter(function (p) { return p.id === id; })[0];
  }
  function korbSummen(korb) {
    var summe = 0;
    Object.keys(korb).forEach(function (id) {
      var p = produkt(id);
      if (p && korb[id] > 0) summe += p.preis * korb[id];
    });
    return { summe: summe };
  }
  function positionenText(korb) {
    var zeilen = [];
    Object.keys(korb).forEach(function (id) {
      var p = produkt(id);
      if (!p || korb[id] < 1) return;
      zeilen.push(korb[id] + ' × ' + p.name + ' (' + p.inhalt + ') — ' + euro(p.preis * korb[id]));
    });
    return zeilen.join('\n');
  }

  /* Produkt-Foto: eigenes Bild je Artikel, Bereichs-Bild als Rückfall */
  function produktBild(p) {
    return BASIS + 'bilder/produkte/' + p.id + '.jpg" onerror="this.onerror=null;this.src=\'' +
      BASIS + KATEGORIEN[p.kat].bild + '\'';
  }

  /* Gemeinsame Korb-Zeilen (Warenkorb-Seite + Kassen-Übersicht) */
  function korbZeilenHtml(korb, mitSteuerung) {
    return Object.keys(korb).filter(function (id) { return korb[id] > 0 && produkt(id); })
      .map(function (id) {
        var p = produkt(id);
        return '<div class="korb-zeile' + (mitSteuerung ? '' : ' korb-zeile-schlicht') + '" data-id="' + id + '">' +
          '<img src="' + produktBild(p) + '" alt="">' +
          '<div class="korb-name"><strong>' + pName(p) + '</strong><span>' + euro(p.preis) + ' · ' + pInhalt(p) + '</span></div>' +
          (mitSteuerung
            ? '<span class="menge" data-id="' + id + '">' +
                '<button type="button" class="menge-minus" aria-label="' + txt('mengeMinus', 'Menge verringern') + '">−</button>' +
                '<span class="menge-zahl">' + korb[id] + '</span>' +
                '<button type="button" class="menge-plus" aria-label="' + txt('mengePlus', 'Menge erhöhen') + '">+</button>' +
              '</span>'
            : '<span class="korb-anzahl">' + korb[id] + ' ×</span>') +
          '<span class="korb-zeilensumme">' + euro(p.preis * korb[id]) + '</span>' +
          (mitSteuerung
            ? '<button type="button" class="korb-entfernen" aria-label="' + pName(p) + ' ' + txt('entfernen', 'entfernen') + '">' +
              '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M9 7V5h6v2m-8 0 1 13h8l1-13"/></svg></button>'
            : '') +
        '</div>';
      }).join('');
  }

  document.addEventListener('DOMContentLoaded', function () {

    /* ============================================================
       1a) Bereichs-Übersicht (produkte.html): Artikel-Zahlen füllen
       ============================================================ */
    document.querySelectorAll('.kachel-zahl[data-kat]').forEach(function (z) {
      var kat = z.getAttribute('data-kat');
      var zahl = PRODUKTE.filter(function (p) { return p.kat === kat; }).length;
      z.textContent = zahl + ' ' + txt('artikel', 'Artikel');
    });

    /* ============================================================
       1b) Bereichs-Seite (produkt-bereich.html?bereich=<kat>)
       ============================================================ */
    var liste = document.getElementById('produkt-liste');
    if (liste) {
      var listeTitel = document.getElementById('liste-titel');
      var listeInfo = document.getElementById('liste-info');
      var sortierung = document.getElementById('sortierung');
      var kat = new URLSearchParams(location.search).get('bereich');
      if (!KATEGORIEN[kat]) kat = 'w';
      listeTitel.textContent = katTitel(kat);
      document.title = katTitel(kat) + txt('titelZusatz', ' – Norberts mobile Fußpflege Stuttgart');

      var zeigeListe = function () {
        var daten = PRODUKTE.filter(function (p) { return p.kat === kat; });
        var art = sortierung ? sortierung.value : 'beliebt';
        daten.sort(function (a, b) {
          if (art === 'preis-auf') return a.preis - b.preis;
          if (art === 'preis-ab') return b.preis - a.preis;
          if (art === 'name') return pName(a).localeCompare(pName(b), document.documentElement.lang || 'de');
          return (b.sterne * 100 + b.stimmen) - (a.sterne * 100 + a.stimmen);
        });
        listeInfo.textContent = daten.length + ' ' + txt('artikel', 'Artikel');
        /* Höhe kurz festhalten, damit die Seite beim Austausch nicht springt */
        liste.style.minHeight = liste.offsetHeight + 'px';
        liste.innerHTML = daten.map(function (p) {
          return '<article class="produkt ' + KATEGORIEN[p.kat].farbe + '">' +
            (p.badge ? '<span class="p-badge">' + badgeText(p.badge) + '</span>' : '') +
            '<img class="p-bild" src="' + produktBild(p) + '" alt="" loading="lazy">' +
            '<div class="p-inhalt">' +
              '<h3>' + pName(p) + '</h3>' +
              '<div class="p-bewertung">' + sterneHtml(p.sterne) + ' <span>' + p.sterne.toFixed(1).replace('.', ',') + ' (' + p.stimmen + ')</span></div>' +
              '<p class="p-info">' + pInfo(p) + '</p>' +
              '<p class="p-meta">' + pInhalt(p) + (p.grund ? ' · ' + p.grund : '') + '</p>' +
              '<p class="p-lager ' + (p.lager === 'ok' ? 'auf-lager' : 'wenig') + '">' +
                (p.lager === 'ok' ? txt('aufLager', '● Auf Lager') : txt('wenig', '● Nur noch wenige')) + '</p>' +
              '<div class="p-fuss">' +
                '<span class="p-preis">' + euro(p.preis) + '</span>' +
                '<span class="menge" data-id="' + p.id + '">' +
                  '<button type="button" class="menge-minus" aria-label="' + txt('mengeMinus', 'Menge verringern') + '">−</button>' +
                  '<span class="menge-zahl">1</span>' +
                  '<button type="button" class="menge-plus" aria-label="' + txt('mengePlus', 'Menge erhöhen') + '">+</button>' +
                '</span>' +
                '<button type="button" class="knopf knopf-voll p-korb" data-id="' + p.id + '">' + txt('inDenKorb', 'In den Warenkorb') + '</button>' +
                '<button type="button" class="knopf knopf-rand p-kauf" data-id="' + p.id + '">' + txt('jetztKaufen', 'Jetzt kaufen') + '</button>' +
              '</div>' +
            '</div>' +
          '</article>';
        }).join('');
        requestAnimationFrame(function () { liste.style.minHeight = ''; });
      };

      if (sortierung) sortierung.addEventListener('change', zeigeListe);

      liste.addEventListener('click', function (e) {
        var minus = e.target.closest('.menge-minus');
        var plus = e.target.closest('.menge-plus');
        var korbKnopf = e.target.closest('.p-korb');
        var kaufKnopf = e.target.closest('.p-kauf');
        if (minus || plus) {
          var stepper = (minus || plus).closest('.menge');
          var zahl = stepper.querySelector('.menge-zahl');
          zahl.textContent = Math.max(1, Math.min(99, parseInt(zahl.textContent, 10) + (plus ? 1 : -1)));
        }
        var id = (korbKnopf || kaufKnopf) && (korbKnopf || kaufKnopf).getAttribute('data-id');
        if (id) {
          var mengeEl = liste.querySelector('.menge[data-id="' + id + '"] .menge-zahl');
          var korb = korbLaden();
          korb[id] = (korb[id] || 0) + parseInt(mengeEl.textContent, 10);
          korbSpeichern(korb);
        }
        if (korbKnopf) {
          korbKnopf.textContent = txt('imKorb', '✓ Im Warenkorb');
          setTimeout(function () { korbKnopf.textContent = txt('inDenKorb', 'In den Warenkorb'); }, 1400);
        }
        if (kaufKnopf) location.href = 'kasse.html';
      });

      zeigeListe();
    }

    /* ============================================================
       2) Warenkorb-Seite (warenkorb.html)
       ============================================================ */
    var korbListe = document.getElementById('korb-liste');
    if (korbListe) {
      var korbRendern = function () {
        var korb = korbLaden();
        korbListe.innerHTML = korbZeilenHtml(korb, true);
        var s = korbSummen(korb);
        document.getElementById('korb-zwischensumme').textContent = euro(s.summe);
        document.getElementById('korb-summe').textContent = euro(s.summe);
        var leer = s.summe === 0;
        document.getElementById('korb-leer').hidden = !leer;
        document.getElementById('korb-leer-knopf').hidden = !leer;
        document.getElementById('korb-tabelle').hidden = leer;
      };
      korbListe.addEventListener('click', function (e) {
        var zeile = e.target.closest('.korb-zeile');
        if (!zeile) return;
        var id = zeile.getAttribute('data-id');
        var korb = korbLaden();
        if (e.target.closest('.menge-plus')) korb[id] = Math.min(99, (korb[id] || 0) + 1);
        if (e.target.closest('.menge-minus')) korb[id] = Math.max(0, (korb[id] || 0) - 1);
        if (e.target.closest('.korb-entfernen')) korb[id] = 0;
        if (korb[id] === 0) delete korb[id];
        korbSpeichern(korb);
        korbRendern();
      });
      document.getElementById('korb-leeren').addEventListener('click', function () {
        korbSpeichern({});
        korbRendern();
      });
      korbRendern();
    }

    /* ============================================================
       3) Kasse (kasse.html)
       ============================================================ */
    var kasse = document.getElementById('kasse-formular');
    if (kasse) {
      var kasseListe = document.getElementById('kasse-liste');
      var korb = korbLaden();
      if (korbSummen(korb).summe === 0) {
        document.getElementById('kasse-leer').hidden = false;
        document.getElementById('kasse-bereich').hidden = true;
      } else {
        kasseListe.innerHTML = korbZeilenHtml(korb, false);
      }

      var feld = function (id) { return document.getElementById(id).value.trim(); };
      var radio = function (name) {
        var r = kasse.querySelector('input[name="' + name + '"]:checked');
        return r ? r.value : '';
      };
      /* Versandkosten der gewählten Lieferart (data-versand am Radio) */
      var versand = function () {
        var r = kasse.querySelector('input[name="lieferung"]:checked');
        return r ? parseFloat(r.getAttribute('data-versand') || '0') : 0;
      };
      /* Bestell-Übersicht rechts: Gesamt inkl. Versand (§ 19 UStG, keine USt.) */
      var summenZeigen = function () {
        var sm = korbSummen(korbLaden());
        var v = versand();
        var g = sm.summe + v;
        document.getElementById('kasse-zwischensumme').textContent = euro(sm.summe);
        document.getElementById('kasse-lieferkosten').textContent = euro(v);
        document.getElementById('kasse-summe').textContent = euro(g);
      };
      /* PayPal gewählt? Dann läuft die Bestellung über PayPal statt WhatsApp/E-Mail */
      var zahlartZeigen = function () {
        var pp = radio('zahlart') === 'PayPal';
        document.getElementById('kasse-whatsapp').hidden = pp;
        document.getElementById('kasse-mail-knopf').hidden = pp;
        document.getElementById('kasse-paypal').hidden = !pp;
        document.getElementById('kasse-hinweis-standard').hidden = pp;
        document.getElementById('kasse-hinweis-paypal').hidden = !pp;
      };
      kasse.querySelectorAll('input[name="lieferung"]').forEach(function (r) {
        r.addEventListener('change', summenZeigen);
      });
      kasse.querySelectorAll('input[name="zahlart"]').forEach(function (r) {
        r.addEventListener('change', zahlartZeigen);
      });
      summenZeigen();
      zahlartZeigen();

      var bestellTextKasse = function () {
        var k = korbLaden();
        var sm = korbSummen(k);
        var v = versand();
        var g = sm.summe + v;
        return 'Verbindliche Bestellung – Norberts mobile Fußpflege\n\n' +
          positionenText(k) + '\n' +
          'Zwischensumme: ' + euro(sm.summe) + '\n' +
          'Lieferung / Versand: ' + euro(v) + ' (' + radio('lieferung') + ')\n' +
          'Gesamt: ' + euro(g) + ' (umsatzsteuerfrei nach § 19 UStG)\n\n' +
          'Name: ' + feld('ka-name') + '\n' +
          'Telefon: ' + feld('ka-telefon') + '\n' +
          (feld('ka-mail') ? 'E-Mail: ' + feld('ka-mail') + '\n' : '') +
          'Adresse: ' + feld('ka-strasse') + ', ' + feld('ka-plz') + ' ' + feld('ka-ort') + '\n' +
          'Lieferung: ' + radio('lieferung') + '\n' +
          (feld('ka-termin') ? 'Wunschtermin: ' + feld('ka-termin') + '\n' : '') +
          'Zahlart: ' + radio('zahlart') + '\n' +
          (feld('ka-bemerkung') ? 'Bemerkung: ' + feld('ka-bemerkung') + '\n' : '') +
          '\nWiderrufsbelehrung und AGB wurden akzeptiert.';
      };
      var fertig = function () {
        korbSpeichern({});
        document.getElementById('kasse-bereich').hidden = true;
        document.getElementById('kasse-fertig').hidden = false;
        window.scrollTo({ top: 0 });
      };
      var absenden = function (weg) {
        if (!kasse.reportValidity()) return;
        var text = bestellTextKasse();
        if (weg === 'whatsapp') {
          if (window.nfWhatsApp) { window.nfWhatsApp('491735904496', text); }
          else { window.open('https://wa.me/491735904496?text=' + encodeURIComponent(text), '_blank', 'noopener'); }
        } else {
          location.href = 'mailto:norbertsmobilefusspflege@gmx.de' +
            '?subject=' + encodeURIComponent('Bestellung') +
            '&body=' + encodeURIComponent(text);
        }
        fertig();
      };
      document.getElementById('kasse-whatsapp').addEventListener('click', function () { absenden('whatsapp'); });
      document.getElementById('kasse-mail-knopf').addEventListener('click', function () { absenden('mail'); });
      document.getElementById('kasse-paypal').addEventListener('click', function () {
        if (!kasse.reportValidity()) return;
        /* Bestell-Daten in die Zwischenablage – bei PayPal als Nachricht einfügbar */
        var text = bestellTextKasse();
        try { if (navigator.clipboard) navigator.clipboard.writeText(text); } catch (e) {}
        var g = korbSummen(korbLaden()).summe + versand();
        /* Platzhalter-Konto – vor dem Livegang durch Norberts echten PayPal.Me-Namen ersetzen */
        window.open('https://www.paypal.me/NorbertsFusspflege/' + g.toFixed(2) + 'EUR', '_blank', 'noopener');
        fertig();
      });
    }
  });
})();
