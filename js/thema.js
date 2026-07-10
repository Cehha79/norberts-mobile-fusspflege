// Hell-/Dunkelmodus — gespeicherte Wahl vor dem ersten Zeichnen anwenden (kein Flackern).
// Wird bewusst synchron im <head> geladen. Die Seite startet IMMER hell; dunkel
// nur, wenn der Besucher es selbst umgeschaltet hat. Die System-Einstellung
// (`prefers-color-scheme`) wird bewusst nicht ausgewertet — Hasans Vorgabe.
(function () {
  var KEY = 'nf-thema';
  var wahl = null;
  try { wahl = localStorage.getItem(KEY); } catch (e) { /* privater Modus o. ä. */ }
  if (wahl === 'dunkel') document.documentElement.setAttribute('data-theme', 'dunkel');
})();
