// Simple LightSearch demo app (frontend)
// - Modal manager
// - i18n (client files)
// - Theme toggle (classic / liquid)
// - Progressive rendering using mock API data from /api/search (server)
(function(){
  const q = document.getElementById('q');
  const searchBtn = document.getElementById('searchBtn');
  const academicBtn = document.getElementById('academicBtn');
  const settingsBtn = document.getElementById('settingsBtn');
  const results = document.getElementById('results');
  const settingsModal = document.getElementById('settingsModal');
  const academicModal = document.getElementById('academicModal');

  function openModal(el){ el.classList.add('is-active'); el.setAttribute('aria-hidden','false'); }
  function closeModal(el){ el.classList.remove('is-active'); el.setAttribute('aria-hidden','true'); }
  function closeAll(){ document.querySelectorAll('.modal.is-active').forEach(m=>closeModal(m)); }
  document.addEventListener('click', e=>{ if(e.target.closest('[data-close]')) closeAll(); });

  settingsBtn.addEventListener('click', ()=> openModal(settingsModal));
  document.getElementById('settingsClose').addEventListener('click', ()=> closeModal(settingsModal));

  academicBtn.addEventListener('click', ()=> openModal(academicModal));
  document.getElementById('academicClose').addEventListener('click', ()=> closeModal(academicModal));
  document.getElementById('academicDo').addEventListener('click', ()=>{ closeModal(academicModal); performSearch(q.value, {academic:true}); });

  // i18n loader (client-only)
  async function loadI18n(lang){
    try{
      const res = await fetch('/i18n/' + lang + '.json');
      if(!res.ok) throw new Error('not found');
      return await res.json();
    }catch(e){
      return null;
    }
  }

  function detectLang(){
    const nav = (navigator.language||'en').slice(0,2);
    if(['zh','en','ja','ko','ru'].includes(nav)) return nav;
    return 'en';
  }

  // apply translations for keys present in page (data-i18n)
  async function applyTranslationsEffective(lang){
    const dictionary = await loadI18n(lang) || {};
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      el.textContent = dictionary[key] || el.textContent;
    });
    // placeholder
    q.placeholder = (dictionary['search.placeholder'] || 'Search the web');
  }

  // Load saved settings
  const saved = JSON.parse(localStorage.getItem('ls:settings')||'{}');
  let currentLang = saved.lang==='auto'||!saved.lang ? detectLang() : (saved.lang||detectLang());
  let theme = saved.theme||'classic';
  if(saved.lang && saved.lang!=='auto'){ currentLang = saved.lang; }
  if(theme==='liquid'){ document.documentElement.setAttribute('data-theme','liquid'); }

  applyTranslationsEffective(currentLang);

  // wire settings controls
  const langSelect = document.getElementById('langSelect');
  const themeSelect = document.getElementById('themeSelect');
  langSelect.value = saved.lang || 'auto';
  themeSelect.value = saved.theme || 'classic';
  langSelect.addEventListener('change', async ()=>{
    const v = langSelect.value;
    localStorage.setItem('ls:settings', JSON.stringify({lang:v,theme:themeSelect.value}));
    if(v==='auto'){ currentLang = detectLang(); } else currentLang = v;
    await applyTranslationsEffective(currentLang);
  });
  themeSelect.addEventListener('change', ()=>{
    const v = themeSelect.value;
    localStorage.setItem('ls:settings', JSON.stringify({lang:langSelect.value,theme:v}));
    if(v==='liquid') document.documentElement.setAttribute('data-theme','liquid');
    else document.documentElement.removeAttribute('data-theme');
  });

  // Progressive rendering via /api/search (server provides mock data list with delay hints)
  let currentToken = 0;
  async function performSearch(query, opts={}){
    if(!query || query.trim()===''){ results.innerHTML = '<div class="card meta">Please type a query.</div>'; return; }
    currentToken++;
    const token = currentToken;
    results.innerHTML = '';
    // fetch metadata from server
    const res = await fetch('/api/search?q=' + encodeURIComponent(query) + (opts.academic ? '&academic=1' : ''));
    const payload = await res.json();
    // payload: { sources: [ {source,delay,items: [...] } ] }
    // render skeleton
    const sk = document.createElement('div'); sk.className='card'; sk.innerHTML='<div class="meta">Loading...</div><div style="height:8px"></div><div style="height:14px;background:linear-gradient(90deg,#eee,#f7f7f7,#eee);border-radius:6px"></div>'; results.appendChild(sk);

    // for each source, render after its delay
    for(const s of payload.sources){
      await new Promise(r=>setTimeout(r, s.delay));
      if(token !== currentToken) return; // aborted by new search
      const block = document.createElement('div'); block.className='card'; block.innerHTML='<div class="meta">'+ s.source +'</div>';
      s.items.forEach(it=>{ const el = document.createElement('div'); el.innerHTML = '<div class="title">'+it.title+'</div><div class="meta">'+it.desc+'</div><div style="margin-top:8px"><a href="'+it.url+'">'+it.url+'</a></div>'; block.appendChild(el); });
      results.appendChild(block);
    }
    // add compare button if multiple sources
    if(payload.sources.length>1){
      const comp = document.createElement('div'); comp.className='card'; comp.innerHTML='<div style="font-weight:700;margin-bottom:8px">Compare</div>';
      const row = document.createElement('div'); row.className='compare-row';
      payload.sources.slice(0,2).forEach(s=>{ const col = document.createElement('div'); col.className='compare-col'; col.innerHTML = '<div class="meta">'+s.source+'</div>'; s.items.forEach(it=> col.innerHTML += '<div style="padding-top:6px"><div class="title">'+it.title+'</div><div class="meta">'+it.desc+'</div></div>'); row.appendChild(col); });
      comp.appendChild(row); results.prepend(comp);
    }
  }

  searchBtn.addEventListener('click', ()=> performSearch(q.value));
  q.addEventListener('keydown', e=>{ if(e.key==='Enter') performSearch(q.value); });

  // expose for debug
  window._ls = {performSearch, openModal: (id)=>document.getElementById(id).classList.add('is-active')};
})();
