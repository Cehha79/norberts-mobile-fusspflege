// Norberts mobile Fußpflege — gemeinsames Skript aller Seiten.
// Vanilla JS, keine Abhängigkeiten. Bewegung nur, wenn der Nutzer sie zulässt.
(function () {
  'use strict';

  var ruhig = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- WhatsApp direkt öffnen ----------
     whatsapp:// startet die installierte App sofort, die Website bleibt
     offen. Öffnet sich nichts (keine App), nach kurzer Wartezeit wa.me
     als Rückfall im NEUEN Tab — die Seite geht dabei nie verloren. */
  window.nfWhatsApp = function (nummer, text) {
    var anhang = text ? '?text=' + encodeURIComponent(text) : '';
    var timer = setTimeout(function () {
      window.open('https://wa.me/' + nummer + anhang, '_blank', 'noopener');
    }, 1200);
    var stopp = function () {
      if (document.hidden) { clearTimeout(timer); }
    };
    document.addEventListener('visibilitychange', stopp, { once: true });
    window.addEventListener('blur', function () { clearTimeout(timer); }, { once: true });
    location.href = 'whatsapp://send?phone=' + nummer +
      (text ? '&text=' + encodeURIComponent(text) : '');
  };
  /* Alle wa.me-Verweise der Seite fangen und über die App öffnen */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="https://wa.me/"]');
    if (!a) return;
    e.preventDefault();
    var teile = a.href.split('wa.me/')[1].split('?text=');
    window.nfWhatsApp(teile[0], teile[1] ? decodeURIComponent(teile[1]) : '');
  });

  document.addEventListener('DOMContentLoaded', function () {

    /* ---------- Hell-/Dunkel-Umschalter ---------- */
    var KEY = 'nf-thema';
    var SONNE = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
    var MOND  = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';

    function istDunkel() {
      return document.documentElement.getAttribute('data-theme') === 'dunkel';
    }
    var themaKnopf = document.querySelector('.thema-knopf');
    if (themaKnopf) {
      themaKnopf.innerHTML = istDunkel() ? SONNE : MOND;
      themaKnopf.addEventListener('click', function () {
        var dunkel = !istDunkel();
        if (dunkel) document.documentElement.setAttribute('data-theme', 'dunkel');
        else document.documentElement.removeAttribute('data-theme');
        try { localStorage.setItem(KEY, dunkel ? 'dunkel' : 'hell'); } catch (e) {}
        themaKnopf.innerHTML = dunkel ? SONNE : MOND;
      });
    }

    /* Die Seiten-Hintergründe laufen seit 10.07. rein über CSS
       (.hintergrund-bild, Bild je Thema und Fenstergröße) — kein JS nötig. */

    /* ---------- Mobile Navigation ---------- */
    var navKnopf = document.querySelector('.nav-knopf');
    var nav = document.querySelector('.hauptnav');
    if (navKnopf && nav) {
      navKnopf.addEventListener('click', function () {
        var offen = nav.classList.toggle('offen');
        navKnopf.setAttribute('aria-expanded', offen ? 'true' : 'false');
      });
    }

    /* ---------- Sanftes Einblenden beim Scrollen ---------- */
    var ziele = document.querySelectorAll('.einblenden');
    if (ruhig || !('IntersectionObserver' in window)) {
      ziele.forEach(function (el) { el.classList.add('sichtbar'); });
    } else if (ziele.length) {
      var io = new IntersectionObserver(function (eintraege) {
        eintraege.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('sichtbar');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      ziele.forEach(function (el, i) {
        el.style.transitionDelay = (i % 3) * 80 + 'ms';
        io.observe(el);
      });
    }

    /* ---------- Zahlen hochzählen (einmalig beim Einscrollen) ---------- */
    var zahlen = document.querySelectorAll('[data-zaehle]');
    function zaehleHoch(el) {
      var ziel = parseInt(el.getAttribute('data-zaehle'), 10);
      if (isNaN(ziel)) return;
      var dauer = 1200, start = null;
      function schritt(zeit) {
        if (!start) start = zeit;
        var anteil = Math.min((zeit - start) / dauer, 1);
        el.textContent = Math.round(ziel * (1 - Math.pow(1 - anteil, 3)));
        if (anteil < 1) requestAnimationFrame(schritt);
      }
      requestAnimationFrame(schritt);
    }
    if (zahlen.length) {
      if (ruhig || !('IntersectionObserver' in window)) {
        zahlen.forEach(function (el) { el.textContent = el.getAttribute('data-zaehle'); });
      } else {
        var zio = new IntersectionObserver(function (eintraege) {
          eintraege.forEach(function (e) {
            if (e.isIntersecting) { zaehleHoch(e.target); zio.unobserve(e.target); }
          });
        }, { threshold: 0.5 });
        zahlen.forEach(function (el) { zio.observe(el); });
      }
    }

    /* ---------- Kundenstimmen: Pfeile rollen das Band seitlich ---------- */
    var rolle = document.querySelector('.stimmen-rolle');
    if (rolle) {
      var band = rolle.querySelector('.stimmen-raster');
      rolle.querySelectorAll('.rolle-pfeil').forEach(function (pfeil) {
        pfeil.addEventListener('click', function () {
          var richtung = pfeil.classList.contains('rolle-vor') ? 1 : -1;
          band.scrollBy({
            left: richtung * band.clientWidth,
            behavior: ruhig ? 'auto' : 'smooth'
          });
        });
      });
    }

    /* ---------- Bewertung absenden: öffnet WhatsApp bzw. E-Mail-Programm ---------- */
    var bewertung = document.getElementById('bewertung-formular');
    if (bewertung) {
      /* Sterne-Auswahl: Klick auf Stern n füllt die Sterne 1 bis n */
      var sterneWahl = bewertung.querySelector('.sterne-wahl');
      var sterneWert = document.getElementById('b-sterne');
      var sterneKnoepfe = bewertung.querySelectorAll('.stern');
      sterneKnoepfe.forEach(function (knopf) {
        knopf.addEventListener('click', function () {
          sterneWert.value = knopf.getAttribute('data-wert');
          sterneOk(true);
          sterneKnoepfe.forEach(function (k) {
            k.classList.toggle('gewaehlt',
              parseInt(k.getAttribute('data-wert'), 10) <= parseInt(sterneWert.value, 10));
          });
        });
      });
      /* Der rote Schatten allein genügt nicht: Farbe ist kein Informationsträger,
         und ein Screenreader bekommt ihn gar nicht mit. Darum ein Text mit
         role="alert", der beim Einblenden vorgelesen wird. */
      var sterneFehler = document.getElementById('sterne-fehler');
      var sterneOk = function (ok) {
        sterneWahl.classList.toggle('fehlt', !ok);
        sterneWahl.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (sterneFehler) sterneFehler.hidden = ok;
      };
      var eingabenOk = function () {
        if (!sterneWert.value) {
          sterneOk(false);
          sterneKnoepfe[0].focus();
          return false;
        }
        sterneOk(true);
        return bewertung.reportValidity();
      };
      var bewertungsText = function () {
        var name = document.getElementById('b-name').value.trim();
        var ort = document.getElementById('b-ort').value.trim();
        var text = document.getElementById('b-text').value.trim();
        return 'Meine Bewertung für Norberts mobile Fußpflege\n\n' +
          'Sterne: ' + sterneWert.value + ' von 5\n' +
          'Von: ' + name + (ort ? ', ' + ort : '') + '\n\n' +
          text + '\n\n' +
          'Mit der Veröffentlichung auf der Website bin ich einverstanden.';
      };
      document.getElementById('b-whatsapp').addEventListener('click', function () {
        if (!eingabenOk()) return;
        window.nfWhatsApp('4917686961032', bewertungsText());
      });
      document.getElementById('b-mail').addEventListener('click', function () {
        if (!eingabenOk()) return;
        location.href = 'mailto:norbertsmobilefusspflege@gmx.de' +
          '?subject=' + encodeURIComponent('Meine Bewertung') +
          '&body=' + encodeURIComponent(bewertungsText());
      });
    }

    /* ---------- Kundenstimmen: kompakte Zeile → volle Bewertung als Maske ----------
       Unter 840 px zeigen die Karten nur Name + Sterne (CSS); der Klick
       öffnet die komplette Bewertung in einem Dialog. */
    var stimmenRaster = document.querySelector('.stimmen-raster');
    if (stimmenRaster) {
      var stimmeMaske = null;
      stimmenRaster.addEventListener('click', function (e) {
        if (!window.matchMedia('(max-width: 839px)').matches) return;
        var fig = e.target.closest('.stimme');
        if (!fig) return;
        if (!stimmeMaske) {
          stimmeMaske = document.createElement('dialog');
          stimmeMaske.className = 'maske stimme-maske';
          document.body.appendChild(stimmeMaske);
          stimmeMaske.addEventListener('click', function (ev) {
            if (ev.target === stimmeMaske || ev.target.closest('.maske-schliessen')) stimmeMaske.close();
          });
        }
        stimmeMaske.innerHTML =
          '<button type="button" class="maske-schliessen" aria-label="Schließen">&times;</button>' +
          '<figure class="stimme">' + fig.innerHTML + '</figure>';
        if (stimmeMaske.showModal && !stimmeMaske.open) stimmeMaske.showModal();
      });
    }

    /* ---------- Kontakt-Formular: Anfrage per WhatsApp oder E-Mail ---------- */
    var kontakt = document.getElementById('kontakt-formular');
    if (kontakt) {
      var kFeld = function (id) { return document.getElementById(id).value.trim(); };
      var kText = function () {
        var anliegen = kontakt.querySelector('input[name="anliegen"]:checked');
        return 'Termin-Anfrage – Norberts mobile Fußpflege\n\n' +
          'Name: ' + kFeld('f-name') + '\n' +
          'Telefon: ' + kFeld('f-telefon') + '\n' +
          (kFeld('f-ort') ? 'Wohnort: ' + kFeld('f-ort') + '\n' : '') +
          (anliegen ? 'Anliegen: ' + anliegen.value + '\n' : '') +
          (kFeld('f-termin') ? 'Wunschtermin: ' + kFeld('f-termin') + '\n' : '') +
          (kFeld('f-nachricht') ? '\n' + kFeld('f-nachricht') + '\n' : '') +
          '\nEinwilligung zur Verarbeitung meiner Angaben liegt vor.';
      };
      document.getElementById('f-whatsapp').addEventListener('click', function () {
        if (!kontakt.reportValidity()) return;
        window.nfWhatsApp('4917686961032', kText());
      });
      document.getElementById('f-mail').addEventListener('click', function () {
        if (!kontakt.reportValidity()) return;
        location.href = 'mailto:norbertsmobilefusspflege@gmx.de' +
          '?subject=' + encodeURIComponent('Termin-Anfrage') +
          '&body=' + encodeURIComponent(kText());
      });
    }

    /* ---------- Einzugsgebiets-Karte (Leaflet, Zwei-Klick-Lösung) ----------
       Vor dem Klick: nur das lokale Vorschaubild. Erst „Karte aktivieren"
       lädt Kachel-Daten von OpenStreetMap/EOX (siehe Datenschutz Abschnitt 5). */
    var kartenFeld = document.getElementById('einzugskarte');
    if (kartenFeld && window.L) {
      var karteStarten = function () {
        kartenFeld.innerHTML = '';
        var mitte = [48.8129, 9.1013];   /* Stuttgart-Weilimdorf */
        var karte = L.map(kartenFeld, {
          center: mitte,
          zoom: 10,
          minZoom: 6,
          maxZoom: 18,
          scrollWheelZoom: false         /* sonst hängt das Seiten-Scrollen in der Karte fest */
        });
        var strassen = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          /* Lizenzhinweis gehört in die Karte (ODbL verlangt Namensnennung). */
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>-Mitwirkende (ODbL)'
        });
        var satellit = L.tileLayer('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/g/{z}/{y}/{x}.jpg', {
          maxNativeZoom: 14, maxZoom: 18,
          attribution: 'Sentinel-2 cloudless &copy; <a href="https://s2maps.eu" target="_blank" rel="noopener">EOX IT Services GmbH</a> (CC BY 4.0)'
        });
        strassen.addTo(karte);
        L.control.layers({ 'Karte': strassen, 'Satellit': satellit }, null, { collapsed: false }).addTo(karte);
        L.circle(mitte, {
          radius: 50000,
          color: '#205a7d', weight: 3,
          fillColor: '#205a7d', fillOpacity: 0.1
        }).addTo(karte);
        L.circleMarker(mitte, {
          radius: 8, color: '#fff', weight: 3,
          fillColor: '#205a7d', fillOpacity: 1
        }).addTo(karte).bindPopup('<strong>Norberts mobile Fußpflege</strong><br>Mittenfeldstraße 39<br>70499 Stuttgart-Weilimdorf');
      };
      var einwilligung = false;
      try { einwilligung = localStorage.getItem('nf-karte') === 'ja'; } catch (e) {}
      var ladeKnopf = document.getElementById('karte-laden');
      if (einwilligung) {
        karteStarten();
      } else if (ladeKnopf) {
        ladeKnopf.addEventListener('click', function () {
          try { localStorage.setItem('nf-karte', 'ja'); } catch (e) {}
          karteStarten();
        });
      }
    }

    /* ---------- Sprachauswahl: Klick daneben schließt sie ---------- */
    var sprache = document.querySelector('.sprache');
    if (sprache) {
      document.addEventListener('click', function (e) {
        if (sprache.open && !sprache.contains(e.target)) sprache.open = false;
      });
    }

    /* ---------- Leistungs-Masken (Detail-Fenster) ---------- */
    document.querySelectorAll('[data-maske]').forEach(function (tafel) {
      var maske = document.getElementById(tafel.getAttribute('data-maske'));
      if (!maske || typeof maske.showModal !== 'function') return;
      function oeffnen() { if (!maske.open) maske.showModal(); }
      tafel.addEventListener('click', oeffnen);
      tafel.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); oeffnen(); }
      });
    });
    document.querySelectorAll('dialog.maske').forEach(function (maske) {
      var zu = maske.querySelector('.maske-schliessen');
      if (zu) zu.addEventListener('click', function () { maske.close(); });
      maske.addEventListener('click', function (e) {
        if (e.target === maske) maske.close();   /* Klick auf den abgedunkelten Rand */
      });
    });

    /* ---------- Bild-Maske: jedes Inhaltsbild öffnet per Klick groß ----------
       Ein gemeinsames <dialog> für alle Seiten; per Delegation, damit auch
       nachträglich gerenderte Bilder (Produkt-Karten) funktionieren. */
    if (window.HTMLDialogElement) {
      var bildMaske = document.createElement('dialog');
      bildMaske.className = 'maske bild-maske';
      bildMaske.innerHTML =
        '<button type="button" class="maske-schliessen" aria-label="Schließen">&times;</button>' +
        '<img alt="">';
      document.body.appendChild(bildMaske);
      var maskenBild = bildMaske.querySelector('img');
      bildMaske.querySelector('.maske-schliessen').addEventListener('click', function () { bildMaske.close(); });
      bildMaske.addEventListener('click', function (e) {
        if (e.target === bildMaske) bildMaske.close();
      });
      document.addEventListener('click', function (e) {
        var bild = e.target.closest('main img');
        if (!bild) return;
        if (bild.closest('a') ||                      /* verlinkte Bilder behalten ihr Ziel */
            bild.closest('.leaflet-container') ||     /* Karte */
            bild.closest('.bild-maske')) return;      /* die Maske selbst */
        bildMaske.classList.remove('logo-maske');
        maskenBild.src = bild.currentSrc || bild.src;
        maskenBild.alt = bild.alt || '';
        if (!bildMaske.open) bildMaske.showModal();
      });

      /* Das Logo in der Kopfleiste zeigt sich groß in derselben Maske. Ohne
         JavaScript bleibt es der Link zur Startseite — deshalb steht das href
         weiter im HTML und wird hier nur abgefangen. In der Maske erscheint
         `logo.png` (800 px, mit Kachel-Grund), nicht das freigestellte
         `logo-frei.png`, das nur auf schwarzem Grund trägt. */
      var markeLink = document.querySelector('.kopf .marke');
      var markeBild = markeLink && markeLink.querySelector('img');
      if (markeBild) {
        markeLink.title = markeBild.alt || 'Logo';
        markeLink.addEventListener('click', function (e) {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
          e.preventDefault();
          bildMaske.classList.add('logo-maske');
          maskenBild.src = (markeBild.getAttribute('src') || '').replace('logo-frei.png', 'logo.png');
          maskenBild.alt = markeBild.alt || '';
          if (!bildMaske.open) bildMaske.showModal();
        });
      }
    }

    /* ---------- Warenkorb-Zähler in der Kopfleiste ---------- */
    window.nfKorbBadge = function () {
      var zahl = document.querySelector('.korb-zahl');
      if (!zahl) return;
      var korb = {};
      try { korb = JSON.parse(localStorage.getItem('nf-warenkorb')) || {}; } catch (e) {}
      var summe = 0;
      Object.keys(korb).forEach(function (k) { summe += korb[k]; });
      zahl.textContent = summe;
      zahl.hidden = summe === 0;
    };
    window.nfKorbBadge();

    /* ---------- Impressum & Datenschutz als Maske ----------
       Die Rechtsseiten bleiben echte Seiten: der Link behält sein href, die
       Seiten sind direkt aufrufbar und funktionieren ohne JavaScript. Das ist
       Pflicht (§ 5 DDG: unmittelbar erreichbar). Hier wird der Klick nur
       abgefangen und der Text aus derselben Datei in eine Maske geladen.
       Schlägt der Abruf fehl (z. B. Aufruf über file://), führt der Link
       ganz normal auf die Seite. */
    var rechtsMaske = null;

    function rechtsMaskeBauen() {
      var m = document.createElement('dialog');
      m.className = 'maske rechts-maske';
      m.innerHTML =
        '<div class="rechts-kopf">' +
          '<h2 class="rechts-titel"></h2>' +
          '<button type="button" class="maske-schliessen" aria-label="Schließen">&times;</button>' +
        '</div>' +
        '<div class="rechts-koerper"><div class="rechtstext"></div></div>';
      m.querySelector('.maske-schliessen').addEventListener('click', function () { m.close(); });
      m.addEventListener('click', function (e) { if (e.target === m) m.close(); });
      document.body.appendChild(m);
      return m;
    }

    function rechtsOeffnen(adresse) {
      return fetch(adresse, { credentials: 'same-origin' })
        .then(function (a) { if (!a.ok) throw new Error(a.status); return a.text(); })
        .then(function (html) {
          var doc = new DOMParser().parseFromString(html, 'text/html');
          var titel = doc.querySelector('main h1');
          var text  = doc.querySelector('.rechtstext');
          if (!text) throw new Error('kein Rechtstext');

          /* Links in der Maske sollen die Maske nicht hinterrücks verlassen */
          text.querySelectorAll('a[href^="http"]').forEach(function (a) {
            a.setAttribute('target', '_blank');
            a.setAttribute('rel', 'noopener');
          });

          if (!rechtsMaske) rechtsMaske = rechtsMaskeBauen();
          rechtsMaske.querySelector('.rechts-titel').textContent = titel ? titel.textContent : '';
          rechtsMaske.querySelector('.rechtstext').innerHTML = text.innerHTML;
          rechtsMaske.querySelector('.rechts-koerper').scrollTop = 0;
          if (rechtsMaske.showModal && !rechtsMaske.open) rechtsMaske.showModal();
        });
    }

    document.querySelectorAll('.fuss-links a[href]').forEach(function (a) {
      var ziel = a.getAttribute('href');
      if (!/(impressum|datenschutz)\.html$/.test(ziel)) return;
      if (!window.fetch || !window.DOMParser) return;
      var pruef = document.createElement('dialog');
      if (typeof pruef.showModal !== 'function') return;   /* alter Browser: normaler Link */
      a.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;  /* neuer Tab bleibt möglich */
        e.preventDefault();
        rechtsOeffnen(ziel)['catch'](function () { window.location.href = ziel; });
      });
    });
  });
})();
