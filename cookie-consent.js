// ============================================================
// Cookie-Consent nach § 25 TDDDG / DSGVO
// - "Alle akzeptieren" und "Alle ablehnen" sind bewusst GLEICH prominent
// - Kein vorangehaktes Kästchen, echte Wahl auf erster Ebene
// - Externe Inhalte (Google Fonts) laden erst NACH Zustimmung
// - Jederzeit widerrufbar über Link im Footer
// ============================================================

(function () {
  const STORAGE_KEY = 'cookie-consent-v1';

  function getConsent() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch (e) {
      return null;
    }
  }

  function setConsent(fonts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ fonts: fonts, ts: Date.now() }));
  }

  function loadGoogleFonts() {
    if (document.getElementById('google-fonts-link')) return;
    const link = document.createElement('link');
    link.id = 'google-fonts-link';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap';
    document.head.appendChild(link);
  }

  function buildBanner() {
    const wrap = document.createElement('div');
    wrap.id = 'cookie-banner';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-label', 'Cookie-Einstellungen');
    wrap.innerHTML = `
      <div class="cookie-inner">
        <p class="cookie-text">
          <strong>Diese Website respektiert deine Privatsphäre.</strong><br>
          Technisch notwendige Funktionen laufen immer. Für die einheitliche Schriftdarstellung
          (Google Fonts) brauchen wir deine Zustimmung, da dabei deine IP-Adresse an Google
          übertragen wird. Mehr dazu in der <a href="datenschutz.html">Datenschutzerklärung</a>.
        </p>
        <div class="cookie-actions">
          <button type="button" id="cookie-settings-toggle" class="cookie-btn">Einstellungen</button>
          <button type="button" id="cookie-reject" class="cookie-btn">Alle ablehnen</button>
          <button type="button" id="cookie-accept" class="cookie-btn">Alle akzeptieren</button>
        </div>
      </div>
      <div id="cookie-settings-panel" hidden>
        <div class="cookie-category">
          <div class="cookie-category-text">
            <h4>Technisch notwendig</h4>
            <p>Nötig, damit die Seite grundlegend funktioniert (z. B. Speicherung deiner Cookie-Auswahl). Kann nicht deaktiviert werden.</p>
          </div>
          <label class="cookie-toggle">
            <input type="checkbox" checked disabled>
            <span class="track"></span><span class="thumb"></span>
          </label>
        </div>
        <div class="cookie-category">
          <div class="cookie-category-text">
            <h4>Externe Schriftarten (Google Fonts)</h4>
            <p>Lädt Schriftarten von Google-Servern für eine einheitliche Darstellung. Dabei wird deine IP-Adresse an Google (Irland/USA) übertragen.</p>
          </div>
          <label class="cookie-toggle">
            <input type="checkbox" id="cookie-fonts-toggle">
            <span class="track"></span><span class="thumb"></span>
          </label>
        </div>
        <button type="button" id="cookie-save" class="cookie-btn" style="background:var(--chalk); color:var(--ink); border-color:var(--chalk);">Auswahl speichern</button>
      </div>
    `;
    document.body.appendChild(wrap);

    document.getElementById('cookie-accept').addEventListener('click', function () {
      setConsent(true);
      loadGoogleFonts();
      wrap.hidden = true;
    });

    document.getElementById('cookie-reject').addEventListener('click', function () {
      setConsent(false);
      wrap.hidden = true;
    });

    document.getElementById('cookie-settings-toggle').addEventListener('click', function () {
      const panel = document.getElementById('cookie-settings-panel');
      panel.hidden = !panel.hidden;
    });

    document.getElementById('cookie-save').addEventListener('click', function () {
      const fontsWanted = document.getElementById('cookie-fonts-toggle').checked;
      setConsent(fontsWanted);
      if (fontsWanted) loadGoogleFonts();
      wrap.hidden = true;
    });
  }

  function showBanner() {
    if (!document.getElementById('cookie-banner')) buildBanner();
    document.getElementById('cookie-banner').hidden = false;
  }

  // Init: bereits gespeicherte Entscheidung anwenden, sonst Banner zeigen
  const existing = getConsent();
  if (existing === null) {
    document.addEventListener('DOMContentLoaded', showBanner);
  } else if (existing.fonts) {
    loadGoogleFonts();
  }

  // Dauerhafter Link im Footer, um die Auswahl jederzeit zu ändern
  document.addEventListener('DOMContentLoaded', function () {
    const footerLink = document.getElementById('cookie-settings-reopen');
    if (footerLink) {
      footerLink.addEventListener('click', function (e) {
        e.preventDefault();
        showBanner();
        document.getElementById('cookie-settings-panel').hidden = false;
        const toggle = document.getElementById('cookie-fonts-toggle');
        const current = getConsent();
        if (toggle && current) toggle.checked = !!current.fonts;
      });
    }
  });
})();
