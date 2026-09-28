/* ==========================================================================
 *  fairies.js  ―  妖精レジストリ & シーケンサー v3 (AR職人仕様)
 *  ────────────────────────────────────────────────────────────────────────
 *  ★ v3 でやったこと（前回のバグを全て潰した完全版）
 *   1) .png の有無を Image() プローブで先に確認 → 無ければ絵文字に
 *   2) .fairy-card に opacity:0 を入れない。常に 1 を維持する
 *   3) エントリーアニメは transform だけで演出する
 *   4) onerror で console.warn + フォールバック要素差し替え
 *   5) localStorage に発見フラグを保存 → ハブのバッジと連動
 *   6) 吹き出しは 5.5 秒おきに永続ループ（お話ししている感じ）
 * ========================================================================= */
window.FAIRIES = [
  /* ---------- 1. バラの妖精 ローズ ---------- */
  { id:'rose', name:'ローズ', role:'🌹 メイン妖精', subtitle:'バラの香りをお届け',
    color:'#ff4081', accent:'#d81b60',
    frames:{ rest:'rose_1', blink:'rose_2',
             jumpFrames:['rose_1','rose_3','rose_4','rose_5','rose_6','rose_7','rose_1'] },
    pos:{x:'24%',y:'55%',scale:1.00},
    voice:['こんにちは！バラの妖精ローズよ。','今日は私が一番きれいに咲いてるわ♪',
           'タップでジャンプしてごらん、ピョン！','このガーデンには私の大切なバラがいっぱいあるの。',
           'あなたにも香りを届けてあげる🌹','私のことは「ローズ」って呼んでね！'],
    captions:['バラの香りで満たす','愛と情熱の花園'],
    entry:'fadeBounce', delay:0, bleCode:'R', area:'ローズガーデン', status:'ready' },

  /* ---------- 2. 雲の妖精 リア★今回追加★ ---------- */
  { id:'ria', name:'リア', role:'☁️ おともだち', subtitle:'雲の上からやってきた',
    color:'#4fc3f7', accent:'#0277bd',
    frames:{ rest:'ria_1', blink:'ria_2',
             jumpFrames:['ria_1','ria_4','ria_5','ria_4','ria_3','ria_2','ria_1'] },
    pos:{x:'70%',y:'55%',scale:1.05},
    voice:['はじめまして！雲の妖精のリアよ♪',
           'ローズのことが大好き！これからずっと一緒だよ。',
           '私のハープ、聴きたい？そっと鳴らしてみるね🎵',
           'タップしたら虹を描いてあげる🌈',
           'ねぇ、私の雲に乗って一緒に空をお散歩しない？',
           '今日は雲が一層ふわふわだよ☁️',
           'ローズと私の並んでいるところ、ちょっとステキでしょ？'],
    captions:['虹のかけらを奏でる','ふわふわ雲の乙女'],
    entry:'floatDown', delay:1800, bleCode:'C', area:'天空の泉', status:'ready' },

  /* ---------- 3. 妖精 #3 (PENDING) ---------- */
  { id:'fairy3', name:'妖精 #3', role:'✨ あたらしい仲間', subtitle:'— 画像を追加してください —',
    color:'#ffd54f', accent:'#ff9800',
    frames:null,
    pos:{x:'46%',y:'22%',scale:0.85},
    voice:['（準備中）キラキラ妖精がもうすぐ登場するよ！',
           'ファイルを ar_party/ に入れて fairies.js の frames を埋めてね'],
    entry:'sparkleBurst', delay:1500, bleCode:'T', area:'光の花壇', status:'pending' },

  /* ---------- 4. 妖精 #4 (PENDING) ---------- */
  { id:'fairy4', name:'妖精 #4', role:'🍃 もう 1 人の仲間', subtitle:'— 画像を追加してください —',
    color:'#aed581', accent:'#558b2f',
    frames:null,
    pos:{x:'84%',y:'22%',scale:0.85},
    voice:['（準備中）そよ風の妖精がもうすぐ登場するよ！',
           '画像を ar_party/ の fairy4_1.png 等で置けば自動表示されます'],
    entry:'windSweep', delay:1700, bleCode:'L', area:'神秘の森', status:'pending' }
];

/* ===== シーケンサー本体 ===== */
window.FairySequencer = (function () {

  function resolveFrame(k){ return (!k||k.endsWith('.png'))?k:(k+'.png'); }

  function getCardFor(f){
    return document.querySelector(`#fairy-${f.id}`);
  }

  function makeEmojiFallback(f){
    const w = document.createElement('div');
    w.className = 'fairy-img-fallback';
    w.textContent = (f.role||'✨').split(' ')[0];
    w.dataset.id = f.id;
    return w;
  }

  function buildNodes(stage, opts){
    opts = opts || {};
    const only = opts.onlyIds ? new Set(opts.onlyIds) : null;
    let z = 10;
    FAIRIES.forEach(f=>{
      if (only && !only.has(f.id)) return;
      const card = document.createElement('div');
      card.className = 'fairy-card';
      card.id = `fairy-${f.id}`;
      card.style.setProperty('--pos-x',  f.pos.x);
      card.style.setProperty('--pos-y',  f.pos.y);
      card.style.setProperty('--scale',  f.pos.scale);
      card.style.setProperty('--fairy-color',  f.color);
      card.style.setProperty('--fairy-accent', f.accent);
      card.style.zIndex = z++;
      card.dataset.state = 'idle';
      card.dataset.status = f.status;

      if (f.status==='ready' && f.frames){
        const img = document.createElement('img');
        img.className = 'fairy-img';
        img.alt = f.name;
        img.dataset.id = f.id;
        const probe = new Image();
        probe.onload  = ()=>{ img.src = probe.src; };
        probe.onerror = ()=>{
          console.warn(`[fairies.js] ${f.id} の PNG が見つからないので絵文字で描画`);
          img.replaceWith(makeEmojiFallback(f));
        };
        probe.src = resolveFrame(f.frames.rest);
        card.appendChild(img);
      } else {
        const ph = document.createElement('div');
        ph.className = 'fairy-placeholder';
        ph.innerHTML =
          `<div class="ph-icon">${(f.role||'✨').split(' ')[0]}</div>`+
          `<div class="ph-name"><strong>${f.name}</strong><br><small>${f.subtitle}</small></div>`+
          `<div class="ph-hint">PNG を <code>${f.id}_1.png</code> で配置</div>`;
        card.appendChild(ph);
      }

      const badge = document.createElement('div');
      badge.className = 'fairy-name';
      badge.innerHTML =
        `<strong>${f.name}</strong>`+
        `<span class="role">${f.role}</span>`+
        `<span class="caption">${f.captions?f.captions[0]:''}</span>`;
      card.appendChild(badge);

      const bubble = document.createElement('div');
      bubble.className = 'fairy-bubble';
      card.appendChild(bubble);

      stage.appendChild(card);
    });
  }

  function runSequence(stage, opts){
    opts = opts || {};
    const only = opts.onlyIds ? new Set(opts.onlyIds) : null;
    [...FAIRIES]
      .filter(f=>!only||only.has(f.id))
      .sort((a,b)=>a.delay-b.delay)
      .forEach(f=>setTimeout(()=>spawnFairy(stage,f), f.delay));
  }

  function spawnFairy(stage, f){
    const card = getCardFor(f);
    if(!card) return;
    card.classList.add('entry-'+f.entry);

    if (f.status==='ready' && f.frames){
      startBlink(card, f);
      card.addEventListener('click', ()=>onJump(card,f));
      card.addEventListener('touchstart', e=>{e.preventDefault();onJump(card,f);},{passive:false});
    }
    startBubbles(card, f);

    setTimeout(()=>card.classList.remove('entry-'+f.entry), ENTRY_MS[f.entry]||1200);
    try{ markDiscovered(f); }catch(e){}
  }

  function startBlink(card, f){
    setInterval(()=>{
      const img = card.querySelector('img.fairy-img');
      if(!img || !img.complete || img.naturalWidth===0) return;
      img.src = resolveFrame(f.frames.blink);
      setTimeout(()=>{ if(img.complete) img.src = resolveFrame(f.frames.rest); }, 150);
    }, 3000);
  }

  function onJump(card, f){
    if (card.dataset.state==='jumping') return;
    card.dataset.state = 'jumping';
    card.classList.add('jumping');
    const img = card.querySelector('img.fairy-img');
    if(!img) return;
    let i=0;
    const tick = ()=>{
      if (i < f.frames.jumpFrames.length){
        img.src = resolveFrame(f.frames.jumpFrames[i++]);
        setTimeout(tick, 120);
      } else {
        img.src = resolveFrame(f.frames.rest);
        card.dataset.state = 'idle';
        card.classList.remove('jumping');
      }
    };
    tick();
  }

  function startBubbles(card, f){
    let idx = 0;
    const say = ()=>showBubble(card, f, idx++ % f.voice.length);
    say();
    card._bubbleTimer = setInterval(say, 5500);
  }

  function showBubble(card, f, idx){
    const b = card.querySelector('.fairy-bubble');
    if(!b) return;
    b.innerHTML =
      `<span class="b-name">${f.role}</span>`+
      `<span class="b-text">${f.voice[idx]}</span>`;
    requestAnimationFrame(()=>b.classList.add('show'));
  }

  /* ===== ハブ連携用 ===== */
  function markDiscovered(f){
    try{
      const key='ar_party_discovered';
      const data=JSON.parse(localStorage.getItem(key)||'{}');
      data[f.id]={ name:f.name, role:f.role, code:f.bleCode||'', area:f.area||'', ts:Date.now() };
      localStorage.setItem(key, JSON.stringify(data));
    }catch(e){}
  }
  function getDiscoveredMap(){
    try{ return JSON.parse(localStorage.getItem('ar_party_discovered')||'{}'); }catch(e){ return {}; }
  }

  const ENTRY_MS = { fadeBounce:1100, floatDown:1500, sparkleBurst:1300, windSweep:1300 };

  return { buildNodes, runSequence, getDiscoveredMap };
})();
