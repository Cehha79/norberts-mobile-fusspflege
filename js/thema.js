// Hell-/Dunkelmodus — gespeicherte Wahl vor dem ersten Zeichnen anwenden (kein Flackern).
// Wird bewusst synchron im <head> geladen. Standard: Hell; ohne gespeicherte Wahl
// folgt die Seite der System-Einstellung.
(function () {
  var KEY = 'nf-thema';
  var wahl = null;
  try { wahl = localStorage.getItem(KEY); } catch (e) { /* privater Modus o. ä. */ }
  var dunkel = wahl === 'dunkel' ||
    (!wahl && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (dunkel) document.documentElement.setAttribute('data-theme', 'dunkel');
})();
