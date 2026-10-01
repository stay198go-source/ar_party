/* ==========================================================================
 *  fairies.js  ―  妖精レジストリ & ステージ演出 v4
 *  ────────────────────────────────────────────────────────────────────────
 *  v4 でやったこと
 *   1) 4人（ローズ・リア・ティンク・リリー）の画像を全部つなげた
 *   2) 人数に合わせて自動で並べ直す（スマホでも重ならない）
 *   3) ふわふわ浮かぶ ＋ まばたき ＋ タップでジャンプ（ゆっくり・かわいく）
 *   4) 動きに合わせてキラキラが舞う（FairyFX）
 *   5) ふきだしは「順番に1人ずつ」しゃべる（重ならない）
 *   6) localStorage に発見フラグを保存 → ホームのバッジと連動
 * ========================================================================= */

/* ---------- 妖精データ ----------
 *  frames.jump : [ [画像名, 時間の割合], ... ]  割合の合計 = 1
 *  frames.jumpMs : ジャンプ全体の長さ(ミリ秒)。長いほどゆっくり
 *  img : 画像の縦横比(aspect) / 体の高さの割合(bodyRatio) / 体の幅の割合(bodyW) / 体の中心(cx)
 */
window.FAIRIES = [
  /* ---------- 1. バラの妖精 ローズ ---------- */
  { id:'rose', emblem:'emblem_rose.png', name:'ローズ', role:'🌹 メイン妖精', subtitle:'バラの香りをお届け',
    color:'#ff4081', accent:'#d81b60',
    sparks:['#ff80ab','#ffd54f','#ffffff','#ffb3d1','#ff4081'], glyphs:['✦','✧','♡','★'],
    img:{ aspect:1.159, bodyRatio:0.89, bodyW:0.654, cx:0.49 },
    frames:{ rest:'rose_1', blink:'rose_2', jumpMs:3000,
             jump:[['rose_1',.08],['rose_3',.11],['rose_4',.14],['rose_5',.31],['rose_6',.22],['rose_7',.08],['rose_1',.06]] },
    voice:['こんにちは！バラの妖精ローズよ。','今日は私が一番きれいに咲いてるわ♪',
           'タップでジャンプしてごらん、ピョン！','このガーデンには私の大切なバラがいっぱいあるの。',
           'あなたにも香りを届けてあげる🌹','私のことは「ローズ」って呼んでね！'],
    captions:['バラの香りで満たす','愛と情熱の花園'],
    hint:'📷 ローズの絵（マーカー）にカメラを向けてね',
    entry:'fadeBounce', delay:0, bleCode:'R', area:'ローズガーデン', status:'ready' },

  /* ---------- 2. 雲の妖精 リア ---------- */
  { id:'ria', emblem:'emblem_ria.png', name:'リア', role:'☁️ おともだち', subtitle:'雲の上からやってきた',
    color:'#4fc3f7', accent:'#0277bd',
    sparks:['#81d4fa','#b3e5fc','#ffffff','#e1bee7','#ffd54f'], glyphs:['✦','✧','★','☆'],
    img:{ aspect:1.568, bodyRatio:0.961, bodyW:0.453, cx:0.563 },
    frames:{ rest:'ria_1', blink:'ria_2', jumpMs:3200,
             jump:[['ria_1',.07],['ria_3',.13],['ria_4',.14],['ria_5',.20],['ria_6',.24],['ria_5',.12],['ria_1',.10]] },
    voice:['はじめまして！雲の妖精のリアよ♪',
           'ローズのことが大好き！これからずっと一緒だよ。',
           '私のハープ、聴きたい？そっと鳴らしてみるね🎵',
           'タップしたら虹を描いてあげる🌈',
           'ねぇ、私の雲に乗って一緒に空をお散歩しない？',
           '今日は雲が一層ふわふわだよ☁️'],
    captions:['虹のかけらを奏でる','ふわふわ雲の乙女'],
    thanks:['見つけてくれてありがとう！💕','わたしは雲の妖精リア。ずっとかくれてたんだよ☁️',
            'ローズとも、もう仲良しなんだ🌹','タップしてみて。虹を描いてあげる🌈'],
    entry:'floatDown', delay:1800, bleCode:'C', area:'天空の泉', status:'ready',
    search:{ yaw:50, pitch:6 },
    hint:'☁️ 空のほうから、ふわふわの気配がするよ…', },

  /* ---------- 3. 光の妖精 ティンク ---------- */
  { id:'tink', emblem:'emblem_tink.png', name:'ティンク', role:'✨ あたらしい仲間', subtitle:'キラキラの光をまとう',
    color:'#ffd54f', accent:'#ff9800',
    sparks:['#ffe082','#fff59d','#ffffff','#ffcc80','#ffd54f'], glyphs:['✦','✧','★','✦'],
    img:{ aspect:0.93, bodyRatio:0.942, bodyW:0.687, cx:0.486 },
    frames:{ rest:'tink_1', blink:'tink_2', jumpMs:2400,
             jump:[['tink_1',.12],['tink_2',.76],['tink_1',.12]] },
    voice:['やっほー！キラキラの妖精ティンクだよ✨',
           'ほら見て、キラキラが舞ってるでしょ？',
           'みんなで遊べて、とってもうれしいな♪',
           'タップしたら、ぴょんって跳ねるよ！'],
    captions:['光のかけらを集める','きらめきの案内人'],
    thanks:['見つけてくれて、ありがとう！✨','キラキラの妖精ティンクだよ。','どうしてわかったの？ すごいね！',
            'タップしてみて。ぴょんっ！'],
    entry:'sparkleBurst', delay:3200, bleCode:'T', area:'光の花壇', status:'ready',
    search:{ yaw:-60, pitch:12 },
    hint:'✨ キラキラ光るものを、さがしてみてね', },

  /* ---------- 4. 森の妖精 リリー ---------- */
  { id:'lily', emblem:'emblem_lily.png', name:'リリー', role:'🍃 もう 1 人の仲間', subtitle:'そよ風にのって森から',
    color:'#aed581', accent:'#558b2f',
    sparks:['#c5e1a5','#aed581','#ffffff','#ffe082','#dcedc8'], glyphs:['✦','✧','❦','★'],
    img:{ aspect:0.805, bodyRatio:0.964, bodyW:0.928, cx:0.5 },
    frames:{ rest:'lily_1', blink:'lily_2', jumpMs:2400,
             jump:[['lily_1',.12],['lily_2',.76],['lily_1',.12]] },
    voice:['こんにちは。森の妖精リリーです🍃',
           'そよ風にのって、ここまで来たの。',
           'ゆっくり深呼吸してみて。いい香りがするよ🌿',
           'みんなと友だちになれて、うれしいな。'],
    captions:['森の声を届ける','そよ風のささやき'],
    thanks:['見つけてくれてありがとう🍃','森の妖精リリーです。','じっと待ってたら、会えてうれしい…','タップしてみて。そよ風を送るね'],
    entry:'windSweep', delay:4600, bleCode:'L', area:'神秘の森', status:'ready',
    search:{ yaw:115, pitch:0 },
    hint:'🍃 うしろのほうも、ぐるっとたしかめてみて', }
];

/* ==========================================================================
 *  FairyStore ― 「みつけた妖精」の記録（ホーム・ARステージ・ローズ画面で共通）
 *  新しい保存名を使うので、前のテストで「発見済み」になっていた記録は引き継がれない
 * ========================================================================= */
window.FairyStore = (function(){
  const KEY = 'ar_party_found_v2';
  function get(){ try{ return JSON.parse(localStorage.getItem(KEY) || '{}'); }catch(e){ return {}; } }
  function mark(x){                       // x は 'ria' のような id でも、妖精データ本体でもOK
    const id = (typeof x === 'string') ? x : (x && x.id);
    if(!id) return get();
    const d = get(); if(!d[id]) d[id] = { ts: Date.now() };
    try{ localStorage.setItem(KEY, JSON.stringify(d)); }catch(e){}
    return d;
  }
  function has(id){ return !!get()[id]; }
  function count(){ const d = get(); return FAIRIES.filter(f => d[f.id]).length; }
  function reset(){ try{ localStorage.removeItem(KEY); }catch(e){} }
  return { get, mark, has, count, reset, KEY };
})();

/* ==========================================================================
 *  FairyFX  ― キラキラ（ステージ・AR 共通）
 * ========================================================================= */
window.FairyFX = (function(){
  const MAX_LIVE = 90;
  let live = 0, styled = false;

  const CSS = `
  .fx-layer{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:50}
  .fx-layer.fixed{position:fixed;z-index:29}
  .fx-spark{position:absolute;pointer-events:none;line-height:1;font-weight:700;
    text-shadow:0 0 6px currentColor,0 0 12px rgba(255,255,255,.95);
    opacity:0;transform:translate(-50%,-50%) scale(.2);
    animation:fxSpark var(--dur,1200ms) cubic-bezier(.2,.7,.3,1) forwards;will-change:transform,opacity}
  @keyframes fxSpark{
    0%{opacity:0;transform:translate(-50%,-50%) scale(.2) rotate(0deg)}
    18%{opacity:1;transform:translate(calc(-50% + var(--dx)*.25),calc(-50% + var(--dy)*.25)) scale(1) rotate(calc(var(--rot)*.3))}
    100%{opacity:0;transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) scale(.3) rotate(var(--rot))}}

  /* ---------- ステージの妖精カード ---------- */
  .fairy-card{position:absolute;left:var(--pos-x);top:var(--pos-y);transform:translate(-50%,-50%);
    text-align:center;cursor:pointer;display:flex;flex-direction:column;align-items:center;
    touch-action:manipulation;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none}
  .fairy-card.pre{visibility:hidden}
  .fairy-body{animation:fairyFloat var(--float-dur,4.2s) ease-in-out infinite;animation-delay:var(--float-delay,0s);will-change:transform}
  .fairy-jump{transform-origin:50% 90%;will-change:transform}
  .fairy-img{display:block;position:relative;height:var(--img-h,180px);width:auto;max-width:none;
    filter:drop-shadow(0 12px 16px rgba(0,0,0,.16));pointer-events:none;-webkit-user-drag:none}
  @keyframes fairyFloat{
    0%{transform:translate(0,0) rotate(-1.4deg)}
    25%{transform:translate(calc(var(--float-amp,8px)*.5),calc(var(--float-amp,8px)*-.7)) rotate(0deg)}
    50%{transform:translate(0,calc(var(--float-amp,8px)*-1)) rotate(1.4deg)}
    75%{transform:translate(calc(var(--float-amp,8px)*-.5),calc(var(--float-amp,8px)*-.5)) rotate(0deg)}
    100%{transform:translate(0,0) rotate(-1.4deg)}}

  .fairy-name{margin-top:4px;background:rgba(255,255,255,.9);padding:5px 12px;border-radius:14px;
    display:inline-block;border:2px solid var(--fairy-color);box-shadow:0 2px 6px rgba(0,0,0,.1);line-height:1.25}
  .fairy-name strong{font-size:var(--nm-fs,13px);color:var(--fairy-accent);display:block}
  .fairy-name .role{font-size:calc(var(--nm-fs,13px) - 3px);color:var(--fairy-accent)}
  .fairy-name .caption{display:block;font-size:calc(var(--nm-fs,13px) - 4px);color:#888;margin-top:1px}

  .fairy-bubble{position:absolute;bottom:100%;margin-bottom:4px;left:50%;transform:translateX(-50%) scale(.85);
    width:max-content;max-width:var(--bubble-w,240px);background:#fff;color:#4a3b32;
    border:2px solid var(--fairy-color);padding:7px 11px;border-radius:16px;
    font-size:var(--bb-fs,13px);font-weight:600;line-height:1.4;box-shadow:0 4px 14px rgba(0,0,0,.18);
    opacity:0;transition:opacity .3s ease,transform .3s ease;pointer-events:none;text-align:left}
  .fairy-bubble.show{opacity:1;transform:translateX(-50%) scale(1)}
  .fairy-bubble .b-name{display:block;background:var(--fairy-color);color:#fff;padding:1px 8px;border-radius:10px;
    font-size:calc(var(--bb-fs,13px) - 2px);font-weight:700;margin-bottom:3px;width:fit-content}
  .fairy-bubble::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);
    border:7px solid transparent;border-top-color:var(--fairy-color)}

  /* ---------- 登場アニメ ---------- */
  @keyframes fadeBounce   { 0%{transform:translate(-50%,-50%) scale(0.4)} 60%{transform:translate(-50%,-50%) scale(1.15)}
                            80%{transform:translate(-50%,-50%) scale(0.95)} 100%{transform:translate(-50%,-50%) scale(1)} }
  @keyframes floatDown    { 0%{transform:translate(-50%,-160%) scale(0.6)} 70%{transform:translate(-50%,-45%) scale(1.1)}
                            100%{transform:translate(-50%,-50%) scale(1)} }
  @keyframes sparkleBurst { 0%{transform:translate(-50%,-50%) scale(0.2) rotate(0deg)} 60%{transform:translate(-50%,-50%) scale(1.2) rotate(180deg)}
                            100%{transform:translate(-50%,-50%) scale(1) rotate(360deg)} }
  @keyframes windSweep    { 0%{transform:translate(-160%,-50%) scale(0.6)} 70%{transform:translate(-45%,-50%) scale(1.1)}
                            100%{transform:translate(-50%,-50%) scale(1)} }
  .entry-fadeBounce   {animation:fadeBounce   1100ms cubic-bezier(.34,1.56,.64,1) forwards}
  .entry-floatDown    {animation:floatDown    1500ms cubic-bezier(.34,1.56,.64,1) forwards}
  .entry-sparkleBurst {animation:sparkleBurst 1300ms ease-out forwards}
  .entry-windSweep    {animation:windSweep    1300ms cubic-bezier(.34,1.56,.64,1) forwards}
  `;

  function injectStyle(){
    if(styled) return; styled = true;
    const s = document.createElement('style'); s.setAttribute('data-fairy-fx','1'); s.textContent = CSS;
    document.head.appendChild(s);
  }

  function createLayer(parent, fixed){
    injectStyle();
    const d = document.createElement('div');
    d.className = 'fx-layer' + (fixed ? ' fixed' : '');
    parent.appendChild(d);
    return d;
  }

  /* 画面上の位置(clientX, clientY)にキラキラを1つ出す */
  function spark(layer, cx, cy, o){
    if(!layer || live >= MAX_LIVE) return;
    o = o || {};
    const r = layer.getBoundingClientRect();
    const colors = o.colors || ['#fff','#ffd54f','#ff80ab'];
    const glyphs = o.glyphs || ['✦','✧','★'];
    const el = document.createElement('span');
    el.className = 'fx-spark';
    el.textContent = glyphs[Math.floor(Math.random()*glyphs.length)];
    const size = (o.size || 16) * (0.7 + Math.random()*0.9);
    const power = o.power || 1;
    const ang = Math.random()*Math.PI*2;
    const dist = (28 + Math.random()*46) * power;
    el.style.left = (cx - r.left) + 'px';
    el.style.top  = (cy - r.top) + 'px';
    el.style.fontSize = size + 'px';
    el.style.color = colors[Math.floor(Math.random()*colors.length)];
    el.style.setProperty('--dx', (Math.cos(ang)*dist*(o.spread||0.8)).toFixed(1) + 'px');
    el.style.setProperty('--dy', (Math.sin(ang)*dist*0.7 - (o.rise==null ? 26 : o.rise)*power).toFixed(1) + 'px');
    el.style.setProperty('--rot', ((Math.random()-0.5)*240).toFixed(0) + 'deg');
    el.style.setProperty('--dur', ((o.dur || 1300) * (0.8 + Math.random()*0.5)).toFixed(0) + 'ms');
    live++;
    const done = ()=>{ live = Math.max(0, live-1); el.remove(); };
    el.addEventListener('animationend', done, {once:true});
    setTimeout(()=>{ if(el.isConnected) done(); }, 2600);
    layer.appendChild(el);
  }

  function burst(layer, cx, cy, n, o){
    for(let i=0;i<n;i++) spark(layer, cx, cy, o);
  }

  return { injectStyle, createLayer, spark, burst };
})();

/* ==========================================================================
 *  FairySequencer ― ステージに妖精を並べて動かす
 * ========================================================================= */
window.FairySequencer = (function () {
  const ENTRY_MS = { fadeBounce:1100, floatDown:1500, sparkleBurst:1300, windSweep:1300 };
  const rand = (a,b)=>a+Math.random()*(b-a);
  const frameUrl = k => (!k || k.endsWith('.png')) ? k : (k + '.png');
  const state = { stage:null, layer:null, speakers:[], talkIdx:0, talkTimer:null, resizeBound:false };

  function preload(f){
    const names = new Set([f.frames.rest, f.frames.blink]);
    (f.frames.jump||[]).forEach(p=>names.add(p[0]));
    names.forEach(n=>{ const i = new Image(); i.src = frameUrl(n); });
  }
  function setFrame(img, name){ if(img) img.src = frameUrl(name); }

  /* ---- 体のあたり(画面座標)をランダムに1点とる：キラキラの出どころ ---- */
  function bodyPoint(card, f){
    const img = card.querySelector('.fairy-img');
    if(!img) return {x:0,y:0};
    const r = img.getBoundingClientRect();
    const bw = f.img.bodyW * r.width;
    const cx = r.left + r.width * f.img.cx;
    return { x: cx + (Math.random()-0.5)*bw*1.25,
             y: r.top + r.height*(0.06 + Math.random()*0.88) };
  }
  function fxOpts(f, power){
    return { colors:f.sparks, glyphs:f.glyphs, size:15, power:power||1, dur:1400 };
  }

  /* ---- 人数に合わせて並べる ---- */
  function layout(stage){
    const cards = [...stage.querySelectorAll('.fairy-card')];
    const n = cards.length; if(!n) return;
    const W = stage.clientWidth, H = stage.clientHeight;
    const portrait = H >= W*0.95;
    let cells, rows, cols;
    if(portrait){
      cols = (n===1) ? 1 : 2; rows = (n>2) ? 2 : 1;
      if(n===1) cells = [[.5,.5]];
      else if(n===2) cells = [[.27,.56],[.73,.56]];
      else if(n===3) cells = [[.27,.31],[.73,.31],[.5,.76]];
      else cells = [[.27,.31],[.73,.31],[.27,.76],[.73,.76]];
    } else {
      cols = n; rows = 1;
      cells = cards.map((_,i)=>[(i+.5)/n, .58]);
    }
    const cellW = W/cols, cellH = H/rows;
    const bodyH = Math.max(90, Math.min(cellH*(rows===2?0.42:0.5), cellW*0.95/0.8, 360));
    const compact = bodyH < 190;
    cards.forEach((card,i)=>{
      const f = FAIRIES.find(x=>x.id===card.dataset.fid);
      const c = cells[i] || [.5,.5];
      card.style.setProperty('--pos-x', (c[0]*100)+'%');
      card.style.setProperty('--pos-y', (c[1]*100)+'%');
      const imgH = bodyH / f.img.bodyRatio;
      card.style.setProperty('--img-h', imgH.toFixed(1)+'px');
      /* 画像の中で体が中心からずれている分（リアの虹など）をもどす */
      const im = card.querySelector('.fairy-img');
      if(im) im.style.left = (-(f.img.cx - 0.5) * imgH * f.img.aspect).toFixed(1) + 'px';
      card.style.setProperty('--bubble-w', Math.min(300, cellW*0.94).toFixed(0)+'px');
      card.style.setProperty('--nm-fs', (compact ? 12 : 14)+'px');
      card.style.setProperty('--bb-fs', (compact ? 12.5 : 14)+'px');
      card.style.setProperty('--float-amp', Math.min(14, Math.max(6, bodyH*0.05)).toFixed(1)+'px');
      card.style.setProperty('--float-dur', (3.8 + (i%3)*0.6).toFixed(1)+'s');
      card.style.setProperty('--float-delay', (-i*0.9)+'s');
      card.dataset.cellH = cellH;
      card.dataset.bodyH = bodyH;
    });
  }

  function buildNodes(stage, opts){
    opts = opts || {};
    FairyFX.injectStyle();
    const only = opts.onlyIds ? new Set(opts.onlyIds) : null;
    state.stage = stage;
    state.speakers = [];
    state.layer = FairyFX.createLayer(stage, false);
    let z = 10;
    FAIRIES.forEach(f=>{
      if (only && !only.has(f.id)) return;
      preload(f);
      const card = document.createElement('div');
      card.className = 'fairy-card pre';
      card.id = `fairy-${f.id}`;
      card.dataset.fid = f.id;
      card.style.setProperty('--fairy-color',  f.color);
      card.style.setProperty('--fairy-accent', f.accent);
      card.style.zIndex = z++;
      card.dataset.z = card.style.zIndex;
      card.dataset.state = 'idle';

      const bubble = document.createElement('div');
      bubble.className = 'fairy-bubble';
      card.appendChild(bubble);

      const body = document.createElement('div'); body.className = 'fairy-body';
      const jump = document.createElement('div'); jump.className = 'fairy-jump';
      const img = document.createElement('img');
      img.className = 'fairy-img'; img.alt = f.name; img.draggable = false;
      img.src = frameUrl(f.frames.rest);
      jump.appendChild(img); body.appendChild(jump); card.appendChild(body);

      const badge = document.createElement('div');
      badge.className = 'fairy-name';
      badge.innerHTML =
        `<strong>${f.name}</strong>`+
        `<span class="role">${f.role}</span>`+
        `<span class="caption">${f.captions?f.captions[0]:''}</span>`;
      card.appendChild(badge);

      stage.insertBefore(card, state.layer);
    });
    layout(stage);
    if(!state.resizeBound){
      state.resizeBound = true;
      window.addEventListener('resize', ()=>{ if(state.stage) layout(state.stage); });
      window.addEventListener('orientationchange', ()=> setTimeout(()=>{ if(state.stage) layout(state.stage); }, 250));
    }
  }

  function runSequence(stage, opts){
    opts = opts || {};
    const only = opts.onlyIds ? new Set(opts.onlyIds) : null;
    const list = [...FAIRIES].filter(f=>!only||only.has(f.id)).sort((a,b)=>a.delay-b.delay);
    /* 人数が少ない画面でもテンポよく：最初の1人を基準に間隔をつめる */
    const base = list.length ? list[0].delay : 0;
    list.forEach((f,i)=>{
      const wait = Math.min(f.delay - base, i*1500);
      setTimeout(()=>spawnFairy(stage,f), wait);
    });
  }

  function spawnFairy(stage, f){
    const card = stage.querySelector('#fairy-'+f.id);
    if(!card) return;
    card.classList.remove('pre');
    card.classList.add('entry-'+f.entry);
    setTimeout(()=>card.classList.remove('entry-'+f.entry), ENTRY_MS[f.entry]||1200);

    /* 登場のキラキラ */
    setTimeout(()=>{
      const p = bodyPoint(card,f); const r = card.getBoundingClientRect();
      FairyFX.burst(state.layer, r.left+r.width/2, r.top+r.height*0.4, 18, fxOpts(f,1.6));
    }, 250);

    card.addEventListener('pointerdown', e=>{ e.preventDefault(); onJump(card,f); });
    scheduleBlink(card,f);
    idleSparkles(card,f);
    state.speakers.push(card);
    startTalking();
  }

  /* ---- まばたき（不規則に・ときどき2回） ---- */
  function scheduleBlink(card, f){
    const img = card.querySelector('.fairy-img');
    const blinkOnce = ()=>{
      if(card.dataset.state==='jumping') return;
      setFrame(img, f.frames.blink);
      setTimeout(()=>{ if(card.dataset.state!=='jumping') setFrame(img, f.frames.rest); }, 150);
    };
    const next = ()=>{
      setTimeout(()=>{
        blinkOnce();
        if(Math.random()<0.3) setTimeout(blinkOnce, 340);
        next();
      }, rand(2200, 4800));
    };
    next();
  }

  /* ---- ふだんのキラキラ（ふわふわ飛んでいる感じ） ---- */
  function idleSparkles(card, f){
    const tick = ()=>{
      if(card.dataset.state!=='jumping'){
        const p = bodyPoint(card,f);
        FairyFX.spark(state.layer, p.x, p.y, fxOpts(f,0.8));
        if(Math.random()<0.4){ const q = bodyPoint(card,f); FairyFX.spark(state.layer, q.x, q.y, fxOpts(f,0.8)); }
      }
      setTimeout(tick, rand(450, 900));
    };
    setTimeout(tick, 900);
  }

  /* ---- タップでジャンプ（ゆっくり・キラキラ付き） ---- */
  function onJump(card, f){
    if (card.dataset.state==='jumping') return;
    card.dataset.state = 'jumping';
    card.classList.add('jumping');
    card.style.zIndex = 70;
    const img  = card.querySelector('.fairy-img');
    const jumpEl = card.querySelector('.fairy-jump');
    const T = f.frames.jumpMs || 2800;
    const cellH = +card.dataset.cellH || 300;
    const bodyH = +card.dataset.bodyH || 160;
    const H = Math.min(cellH*0.34, 150), S = 1.22;

    /* 動き：しゃがむ → ぐーんと跳ぶ → 空中でふわっ → ふんわり着地 */
    if(jumpEl.animate){
      jumpEl.animate([
        { transform:'translateY(0) scale(1,1)', offset:0, easing:'ease-in-out' },
        { transform:'translateY(4px) scale(1.06,0.92)', offset:.16, easing:'ease-out' },
        { transform:`translateY(${-H*0.55}px) scale(0.97,1.07)`, offset:.30, easing:'ease-out' },
        { transform:`translateY(${-H}px) scale(${S},${S})`, offset:.46, easing:'ease-in-out' },
        { transform:`translateY(${-H*0.92}px) scale(${S},${S}) rotate(2deg)`, offset:.56, easing:'ease-in' },
        { transform:`translateY(${-H*0.2}px) scale(1,1.04)`, offset:.66, easing:'ease-in' },
        { transform:'translateY(0) scale(1.08,0.9)', offset:.72, easing:'ease-out' },
        { transform:'translateY(-3px) scale(0.98,1.03)', offset:.82, easing:'ease-in-out' },
        { transform:'translateY(0) scale(1,1)', offset:1 }
      ], { duration:T, fill:'none' });
    }

    /* 画像を「ゆっくり」順番に切り替える */
    let acc = 0;
    f.frames.jump.forEach(([fr, frac])=>{
      setTimeout(()=>setFrame(img, fr), acc*T);
      acc += frac;
    });

    /* キラキラ：飛び立つ・空中・着地で増やす */
    const fx = state.layer;
    setTimeout(()=>{ const p=bodyPoint(card,f); FairyFX.burst(fx, p.x, p.y, 16, fxOpts(f,1.5)); }, T*0.18);
    const trail = setInterval(()=>{
      for(let k=0;k<2;k++){ const p=bodyPoint(card,f); FairyFX.spark(fx, p.x, p.y, fxOpts(f,1.2)); }
    }, 60);
    setTimeout(()=>clearInterval(trail), T*0.74);
    setTimeout(()=>{ const p=bodyPoint(card,f); FairyFX.burst(fx, p.x, p.y+bodyH*0.2, 24, fxOpts(f,2)); }, T*0.70);

    setTimeout(()=>{
      setFrame(img, f.frames.rest);
      card.dataset.state = 'idle';
      card.classList.remove('jumping');
      card.style.zIndex = card.dataset.z;
    }, T+40);
  }

  /* ---- ふきだし：順番に1人ずつ ---- */
  function startTalking(){
    if(state.talkTimer) return;
    const talk = ()=>{
      const list = state.speakers; if(!list.length) return;
      list.forEach(c=>{ const b=c.querySelector('.fairy-bubble'); if(b) b.classList.remove('show'); });
      const card = list[state.talkIdx++ % list.length];
      const f = FAIRIES.find(x=>x.id===card.dataset.fid);
      card._say = (card._say==null) ? 0 : card._say+1;
      const b = card.querySelector('.fairy-bubble');
      b.innerHTML = `<span class="b-name">${f.role}</span><span class="b-text">${f.voice[card._say % f.voice.length]}</span>`;
      requestAnimationFrame(()=>b.classList.add('show'));
      if(card.dataset.state!=='jumping') card.style.zIndex = 60;
      setTimeout(()=>{ b.classList.remove('show'); if(card.dataset.state!=='jumping') card.style.zIndex = card.dataset.z; }, 3600);
    };
    setTimeout(talk, 1400);
    state.talkTimer = setInterval(talk, 4200);
  }

  /* ===== ホーム連携用 ===== */
  function getDiscoveredMap(){ return FairyStore.get(); }

  return { buildNodes, runSequence, getDiscoveredMap, layout };
})();
