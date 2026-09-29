/* ============================================================================
   MedWell Studio — tenant brand applier (shared by all Studio pages)
   StudioBrand.apply(brand_config)  → sets --sb-* tokens, font, logo, name.
   Accepts generic keys (colors.primary / primary_dark / accent, font) and, as a
   fallback, the legacy Concentra keys (colors.blue / navy / orange, typeface).
   No brand_config → MedWell defaults from studio-brand.css stay in force.
   ============================================================================ */
(function(){
  const HEX = /^#[0-9a-f]{6}$/i;
  const DEFAULT_NAME = "MedWell";
  function set(k,v){ if(v && HEX.test(v)) document.documentElement.style.setProperty(k,v); }
  function loadFont(fam){
    if(!fam || typeof fam!=="string" || !/^[A-Za-z0-9 ]{2,40}$/.test(fam)) return;
    const id="sb-font-"+fam.replace(/ /g,"-");
    if(!document.getElementById(id)){
      const l=document.createElement("link"); l.id=id; l.rel="stylesheet";
      l.href="https://fonts.googleapis.com/css2?family="+encodeURIComponent(fam).replace(/%20/g,"+")+":wght@400;600;700&display=swap";
      document.head.appendChild(l);
    }
    document.documentElement.style.setProperty("--sb-font",
      '"'+fam+'", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif');
  }
  function apply(bc, opts){
    opts = opts || {};
    const nameEl = document.getElementById(opts.nameId || "sbTenant");
    if(!bc){ if(nameEl && !nameEl.textContent) nameEl.textContent = DEFAULT_NAME; return DEFAULT_NAME; }
    const c = bc.colors || {};
    const primary = c.primary || c.blue;
    set("--sb-primary",      primary);
    set("--sb-primary-deep", c.primary_dark || c.navy);
    set("--sb-accent",       c.accent || c.orange);
    // accent-as-text must stay readable on white: tenant accents (e.g. orange) often
    // aren't, so text accents follow the tenant primary.
    set("--sb-accent-text",  c.accent_text || primary);
    loadFont(bc.font || bc.typeface);
    const logoEl = document.getElementById(opts.logoId || "sbLogo");
    if(logoEl && bc.logo){ logoEl.src = bc.logo; logoEl.style.display = "block"; }
    const name = bc.name || opts.fallbackName || DEFAULT_NAME;
    if(nameEl) nameEl.textContent = name;
    return name;
  }
  window.StudioBrand = { apply, DEFAULT_NAME };
})();
