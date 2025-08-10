
// Basic utility to fetch JSON
async function loadJSON(path){ const r = await fetch(path); return await r.json(); }

// Theme toggle (dark/light) with persistence
(function(){
  const key='vvk_theme';
  const btn = document.getElementById('themeToggle');
  const saved = localStorage.getItem(key) || 'dark';
  if(saved==='light') document.documentElement.classList.add('light');
  if(btn){
    btn.addEventListener('click', ()=>{
      document.documentElement.classList.toggle('light');
      localStorage.setItem(key, document.documentElement.classList.contains('light') ? 'light':'dark');
    });
  }
  const y = document.getElementById('year'); if(y) y.textContent = new Date().getFullYear();
})();

// Confetti (simple)
function shootConfetti(){
  const canvas = document.createElement('canvas');
  canvas.style.position='fixed';canvas.style.inset='0';canvas.style.pointerEvents='none';canvas.width=innerWidth;canvas.height=innerHeight;document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const pieces = Array.from({length:180},()=>({x:Math.random()*canvas.width,y:-20*Math.random(),r:4+8*Math.random(),vy:2+4*Math.random(),vx:-2+4*Math.random()}));
  let t=0, anim;
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy; ctx.fillStyle=`hsl(${(t+p.x)%360},80%,60%)`; ctx.fillRect(p.x, p.y, p.r, p.r);
    });
    t+=2; if(t<600) anim=requestAnimationFrame(draw); else canvas.remove();
  } draw();
}

// Countdown & state machine (before -> live -> after)
(async function(){
  const cfg = await loadJSON('data/config.json');
  const events = await loadJSON('data/events.json');
  const dEl=document.getElementById('d'), hEl=document.getElementById('h'), mEl=document.getElementById('m'), sEl=document.getElementById('s');
  const stateBadge = document.getElementById('stateBadge');
  const livePanel = document.getElementById('livePanel');
  const afterPanel = document.getElementById('afterPanel');
  const listEl = document.getElementById('eventList');
  const liveIframe = document.getElementById('liveIframe');

  if(listEl){ events.forEach(e=>{ const li=document.createElement('li'); li.textContent=`${e.time} — ${e.title} · ${e.desc}`; listEl.appendChild(li); }); }

  const start = new Date(cfg.eventDate);
  // end = start + ~4 hours (adjust as needed)
  const end = new Date(start.getTime()+ 4*60*60*1000);
  if(liveIframe && cfg.livestream?.enabled && cfg.livestream.youtubeId){
    liveIframe.src = `https://www.youtube.com/embed/${cfg.livestream.youtubeId}`;
  }

  function setState(state){
    // states: before, live, after
    if(stateBadge){
      stateBadge.textContent = state==='before' ? 'Đang chuẩn bị' : state==='live' ? 'Đang diễn ra' : 'Hậu sự kiện';
    }
    if(livePanel) livePanel.classList.toggle('hidden', state!=='live');
    if(afterPanel) afterPanel.classList.toggle('hidden', state!=='after');
    if(state==='live'){ shootConfetti(); }
  }

  function pad(n){ return n.toString().padStart(2,'0'); }

  function tick(){
    const now = new Date();
    if(now < start){
      // before
      const diff = start-now;
      const d = Math.floor(diff/86400000);
      const h = Math.floor((diff%86400000)/3600000);
      const m = Math.floor((diff%3600000)/60000);
      const s = Math.floor((diff%60000)/1000);
      if(dEl){ dEl.textContent=pad(d); hEl.textContent=pad(h); mEl.textContent=pad(m); sEl.textContent=pad(s); }
      setState('before');
    } else if (now >= start && now <= end){
      // live
      setState('live');
      const cd = document.getElementById('countdown'); if(cd) cd.style.display='none';
    } else {
      // after
      setState('after');
      const cd = document.getElementById('countdown'); if(cd) cd.style.display='none';
    }
  }
  tick(); setInterval(tick, 1000);
})();

// About page: timeline & old photos
(async function(){
  const timeline = document.getElementById('historyTimeline');
  if(!timeline) return;
  const items = await loadJSON('data/history.json');
  timeline.innerHTML = items.map(i => `
    <div class="card">
      <strong>${i.year}</strong><br>${i.title}<br><span class="muted">${i.desc}</span>
    </div>
  `).join('');
  // old gallery uses first 3 gallery items
  const gal = await loadJSON('data/gallery.json');
  const container = document.getElementById('oldGallery');
  if(container){
    container.innerHTML = gal.slice(0,3).map(g=>`
      <a href="assets/images/${g.src}" class="glightbox" data-gallery="old" data-title="${g.caption}">
        <img src="assets/images/${g.src}" alt="${g.caption}"/>
      </a>
    `).join('');
    if(window.GLightbox){ GLightbox({selector:'.glightbox'}); }
  }
})();

// Leadership page
(async function(){
  const wrap = document.getElementById('leaders');
  if(!wrap) return;
  const leaders = await loadJSON('data/leadership.json');
  wrap.innerHTML = leaders.map(p=>`
    <article class="card">
      <img src="assets/images/${p.photo}" alt="${p.name}" style="width:100%;height:180px;object-fit:cover;border-radius:12px"/>
      <h3>${p.name}</h3>
      <p><strong>${p.role}</strong> – ${p.term}</p>
      <p class="muted">${p.bio}</p>
    </article>
  `).join('');
})();

// Events page
(async function(){
  const list = document.getElementById('eventsList');
  if(!list) return;
  const evs = await loadJSON('data/events.json');
  list.innerHTML = evs.map(e=>`<li><strong>${e.time}</strong> – ${e.title}<br><span class="muted">${e.desc}</span></li>`).join('');
  const cfg = await loadJSON('data/config.json');
  const map = document.getElementById('mapEmbed'); if(map) map.src = cfg.maps.embed;
})();

// Gallery page
(async function(){
  const grid = document.getElementById('galleryGrid');
  if(!grid) return;
  const data = await loadJSON('data/gallery.json');
  function render(q=''){
    const k = q.trim().toLowerCase();
    grid.innerHTML = data
      .filter(g => !k || g.caption.toLowerCase().includes(k))
      .map(g => `
        <a href="assets/images/${g.src}" class="glightbox" data-gallery="main" data-title="${g.caption}">
          <img src="assets/images/${g.src}" alt="${g.caption}"/>
        </a>`).join('');
    if(window.GLightbox){ GLightbox({selector:'.glightbox'}); }
  }
  const input = document.getElementById('gallerySearch');
  if(input){ input.addEventListener('input', e=>render(e.target.value)); }
  render();
})();

// Guestbook page: form + giscus
(async function(){
  const formFrame = document.getElementById('wishesForm');
  if(!formFrame) return;
  const cfg = await loadJSON('data/config.json');
  formFrame.src = cfg.forms.wishes;
  if(cfg.giscus?.enabled){
    const s = document.createElement('script');
    s.src = 'https://giscus.app/client.js';
    s.setAttribute('data-repo', cfg.giscus.repo);
    s.setAttribute('data-repo-id', cfg.giscus.repoId);
    s.setAttribute('data-category', cfg.giscus.category);
    s.setAttribute('data-category-id', cfg.giscus.categoryId);
    s.setAttribute('data-mapping', cfg.giscus.mapping);
    s.setAttribute('data-strict', '0');
    s.setAttribute('data-reactions-enabled', cfg.giscus.reactionsEnabled);
    s.setAttribute('data-emit-metadata', cfg.giscus.emitMetadata);
    s.setAttribute('data-input-position', 'top');
    s.setAttribute('data-theme', cfg.giscus.theme);
    s.setAttribute('data-lang', cfg.giscus.lang || 'vi');
    s.crossOrigin='anonymous';
    s.async = true;
    document.getElementById('giscusContainer').appendChild(s);
  }
})();

// Alumni page
(async function(){
  const list = document.getElementById('alumniList');
  if(!list) return;
  const groups = await loadJSON('data/alumni.json');
  list.innerHTML = groups.map(g=>`
    <div class="card">
      <strong>${g.group}</strong>
      <div class="muted">Năm tốt nghiệp: ${g.year}</div>
      <div style="margin-top:8px">${g.links.map(l=>`<a class="btn ghost" href="${l.url}" target="_blank" rel="noopener">${l.name}</a>`).join(' ')}</div>
    </div>
  `).join('');
})();

// Fun page: simple quiz with localStorage leaderboard
(function(){
  const box = document.getElementById('quizBox'); if(!box) return;
  const Q = [
    {q:'Trường thành lập năm nào?', opts:['1998','2000','2005'], a:1},
    {q:'CLB nào có tiết mục văn nghệ trong sự kiện?', opts:['Bóng rổ','Văn nghệ','STEM'], a:1},
    {q:'Sự kiện bế mạc lúc mấy giờ?', opts:['10:00','11:00','12:00'], a:1}
  ];
  let i=0, score=0;
  const qTitle = document.getElementById('qTitle');
  const qOptions = document.getElementById('qOptions');
  const next = document.getElementById('nextQ');
  const result = document.getElementById('quizResult');
  function render(){
    const cur = Q[i]; qTitle.textContent = cur.q; qOptions.innerHTML='';
    cur.opts.forEach((o,idx)=>{
      const li=document.createElement('li');
      const b=document.createElement('button'); b.className='btn ghost'; b.textContent=o;
      b.onclick=()=>{ if(idx===cur.a) score++; Array.from(qOptions.querySelectorAll('button')).forEach(x=>x.disabled=true); };
      li.appendChild(b); qOptions.appendChild(li);
    });
  }
  render();
  next.onclick=()=>{
    if(i<Q.length-1){ i++; render(); }
    else{
      result.classList.remove('hidden');
      result.textContent = `Điểm của bạn: ${score}/${Q.length}`;
      const name = prompt('Nhập tên để lưu BXH:');
      if(name){
        const key='vvk_lb'; const lb=JSON.parse(localStorage.getItem(key)||'[]');
        lb.push({name,score,ts:Date.now()}); lb.sort((a,b)=>b.score-a.score); localStorage.setItem(key, JSON.stringify(lb.slice(0,10)));
      }
      // render leaderboard
      const lbEl=document.getElementById('lb'); const data=JSON.parse(localStorage.getItem('vvk_lb')||'[]');
      lbEl.innerHTML=data.map((row,idx)=>`<li>${idx+1}. ${row.name} — ${row.score} điểm</li>`).join('');
      next.disabled=true;
    }
  };
})();
