/* MedWell Studio — one login for every Studio page.
   The hub (wellness_tools/index.html) is the only place to log in. Every other Studio page calls
   StudioAuth.require('<tool>') first: no session -> hub (then back here after login);
   logged in without that tool -> hub with a "no access" note.
   Tools: drl, translation, reports. Session lives in localStorage "mw_am" (shared by all pages).
   This is the page-side gate only; each workflow re-checks the session server-side. */
(function(){
  var HUB = '/wellness_tools/index.html';   // root-relative: same on GitHub Pages and production
  var KEY = 'mw_am';
  function get(){ try{ var s = localStorage.getItem(KEY); return s ? JSON.parse(s) : null; }catch(e){ return null; } }
  function set(s){ try{ localStorage.setItem(KEY, JSON.stringify(s)); }catch(e){} }
  function clear(){ try{ localStorage.removeItem(KEY); }catch(e){} }
  function here(){ return location.pathname + location.search + location.hash; }
  function toHub(why, keepNext){
    var q = [];
    if(keepNext) q.push('next=' + encodeURIComponent(here()));
    if(why) q.push('why=' + why);
    location.replace(HUB + (q.length ? '?' + q.join('&') : ''));
  }
  function can(tool){
    var s = get(); if(!s || !s.am) return false;
    return s.am.is_platform_admin === true || (s.am.tools || []).indexOf(tool) > -1;
  }
  // only same-site paths are allowed as a post-login destination (no open redirect)
  function safeNext(n){ return (n && n.charAt(0) === '/' && n.charAt(1) !== '/') ? n : null; }

  window.StudioAuth = {
    HUB: HUB, get: get, set: set, clear: clear, can: can, safeNext: safeNext,
    session: function(){ var s = get(); return s ? s.session : ''; },
    require: function(tool){
      var s = get();
      if(!s || !s.session){ toHub('login', true); return null; }
      if(tool && !can(tool)){ toHub('noaccess', false); return null; }
      return s;
    },
    expired: function(){ clear(); toHub('expired', true); },
    logout: function(){ clear(); location.replace(HUB); },
    // fills #whoami and wires #logoutLink if the page has them
    paint: function(){
      var s = get(), w = document.getElementById('whoami'), lo = document.getElementById('logoutLink');
      if(w){ w.textContent = s ? s.am.name + (s.am.is_super_admin ? ' (admin)' : '') : ''; w.style.display = s ? '' : 'none'; }
      if(lo){ lo.style.display = s ? '' : 'none'; lo.onclick = function(e){ e.preventDefault(); window.StudioAuth.logout(); }; }
    }
  };
})();
