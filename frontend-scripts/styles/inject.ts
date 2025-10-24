let injected = false;

export function ensureGlobalStyles() {
  if (injected) return;
  const css = `:root{--bg:#0b1020;--bg-2:#0f1530;--fg:#fff;--muted:rgba(255,255,255,.75);--grad:linear-gradient(135deg,#7B2CF5,#2C89F5);--panel-grad:linear-gradient(135deg,rgba(123,44,245,.25),rgba(44,137,245,.25));--glass:blur(10px);--glow:0 8px 20px rgba(0,0,0,.35),0 0 12px rgba(123,44,245,.7);--radius-sm:10px;--radius-md:12px;--radius-lg:16px;--ease:cubic-bezier(.22,.61,.36,1);--dur:.28s;--buy:#2C89F5;--sell:#E36414;--ok:#2ec27e;--warn:#f6c445;--danger:#ff5c5c;--rarity-common:#9aa0a6;--rarity-rare:#4fd4f5;--rarity-epic:#b26bff;--rarity-legendary:#f6c445;--container-max:720px}
html,body{background:radial-gradient(1200px 600px at 50% -10%, rgba(123,44,245,.12), transparent),var(--bg);color:var(--fg);font-family:system-ui,-apple-system,"Segoe UI","PingFang SC","Microsoft YaHei",Arial,sans-serif}
html{color-scheme:dark}
.container{padding:0 12px}
.container{max-width:var(--container-max);margin:12px auto}
.card{position:relative;border-radius:var(--radius-lg);background:var(--panel-grad);backdrop-filter:var(--glass);box-shadow:var(--glow);padding:12px;overflow:hidden}
.card:hover{box-shadow:var(--glow),0 0 24px rgba(123,44,245,.15)}
/* neon corners + sheen */
.card::before{content:"";position:absolute;inset:0;border-radius:inherit;background:radial-gradient(40% 25% at 100% 0, rgba(123,44,245,.18), transparent 60%),radial-gradient(35% 25% at 0 100%, rgba(44,137,245,.16), transparent 60%);pointer-events:none}
.card::after{content:"";position:absolute;left:-30%;top:-120%;width:60%;height:300%;background:linear-gradient(120deg,transparent,rgba(255,255,255,.18),transparent);transform:rotate(8deg);opacity:.25;animation:card-sheen 9s linear infinite;pointer-events:none}
@keyframes card-sheen{0%{transform:translateX(0) rotate(8deg)}100%{transform:translateX(160%) rotate(8deg)}}
.row{display:flex;gap:8px;align-items:center}
.card input,.card button{box-sizing:border-box;outline:none}
.card input{background:rgba(255,255,255,.08);border:0;border-radius:var(--radius-md);color:var(--fg);padding:10px;margin:8px 0;appearance:none;-webkit-appearance:none;background-clip:padding-box;pointer-events:auto;touch-action:manipulation}
.card select.input, select.input{background:rgba(255,255,255,.08);color:var(--fg);border:0;border-radius:var(--radius-md);padding:10px;margin:8px 0;appearance:none;-webkit-appearance:none;background-clip:padding-box}
.card select.input option, select.input option{background:#0b1020;color:#fff}
.card select.input:focus, select.input:focus{outline:2px solid rgba(123,44,245,.45)}
.card button{width:100%;border-radius:var(--radius-md)}
.btn{position:relative;overflow:hidden;padding:10px 14px;border:0;border-radius:var(--radius-md);color:#fff;transition:transform var(--dur) var(--ease),box-shadow var(--dur) var(--ease),filter var(--dur) var(--ease);cursor:pointer}
.btn .icon{margin-right:6px}
.btn:active{transform:translateY(1px) scale(.99)}
.btn:disabled{opacity:.5;cursor:not-allowed;filter:grayscale(0.3)}
.btn::after{content:"";position:absolute;inset:0;opacity:0;background:linear-gradient(115deg,transparent,rgba(255,255,255,.25),transparent 55%);transform:translateX(-60%);transition:opacity var(--dur) var(--ease), transform var(--dur) var(--ease);pointer-events:none}
.btn:hover::after{opacity:.9;transform:translateX(0)}
.btn:hover{filter:saturate(110%)}
.btn-primary{background:var(--grad);box-shadow:var(--glow);position:relative}
.btn-primary::before{content:"";position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent);animation:btn-shimmer 3s linear infinite;pointer-events:none}
@keyframes btn-shimmer{0%{left:-100%}100%{left:200%}}
.btn-energy{position:relative;animation:btn-pulse 2s ease-in-out infinite}
.btn-energy::before{content:"";position:absolute;inset:-2px;border-radius:inherit;background:linear-gradient(135deg,rgba(123,44,245,.6),rgba(44,137,245,.6));filter:blur(8px);z-index:-1;opacity:.6;animation:energy-ring 2s ease-in-out infinite;pointer-events:none}
@keyframes btn-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.02)}}
@keyframes energy-ring{0%,100%{opacity:.4;filter:blur(8px)}50%{opacity:.8;filter:blur(12px)}}
.btn-buy{background:var(--buy)}
.btn-sell{background:var(--sell)}
.btn-ghost{background:rgba(255,255,255,.08)}
.input{width:100%;padding:10px;border:0;border-radius:var(--radius-md);background:rgba(255,255,255,.08);color:var(--fg);pointer-events:auto;touch-action:manipulation;user-select:text;-webkit-user-select:text;transition:all .2s ease}
.input:focus{background:rgba(255,255,255,.12);box-shadow:0 0 0 2px rgba(123,44,245,.4);outline:none}
.pill{padding:2px 8px;border-radius:999px;background:rgba(255,255,255,.08);font-size:12px;cursor:pointer;transition:background .3s ease}
.pill.pill-running{animation:pill-breathe 2s ease-in-out infinite}
@keyframes pill-breathe{0%,100%{background:rgba(46,194,126,.25);box-shadow:0 0 8px rgba(46,194,126,.3)}50%{background:rgba(46,194,126,.35);box-shadow:0 0 12px rgba(46,194,126,.5)}}
.pill.pill-collapsed{animation:pill-alert 1s ease-in-out infinite}
@keyframes pill-alert{0%,100%{background:rgba(255,92,92,.25);box-shadow:0 0 8px rgba(255,92,92,.3)}50%{background:rgba(255,92,92,.45);box-shadow:0 0 16px rgba(255,92,92,.6)}}
.pill.active{background:linear-gradient(135deg, rgba(123,44,245,.35), rgba(44,137,245,.28));box-shadow:var(--glow)}
.scene-header{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;margin-bottom:8px}
.scene-header h1{margin:0;font-size:20px;position:relative;display:inline-block}
.scene-header h1::after{content:"";position:absolute;left:0;bottom:-2px;width:100%;height:2px;background:var(--grad);opacity:.4;pointer-events:none}
.scene-header p{margin:0;opacity:.85}
.stats{display:flex;gap:10px}
.stat{flex:1;min-width:0;background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.03));border-radius:12px;padding:10px;display:flex;align-items:center;gap:10px;position:relative;overflow:hidden}
.stat-animated:hover{background:linear-gradient(180deg,rgba(255,255,255,.1),rgba(255,255,255,.05));box-shadow:0 0 16px rgba(123,44,245,.2)}
.stat .ico{font-size:18px;filter:drop-shadow(0 0 8px rgba(123,44,245,.35));transition:transform .3s ease}
.pulse-icon{animation:icon-pulse .6s ease}
@keyframes icon-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.3) rotate(5deg)}}
.stat .val{font-weight:700;font-size:16px}
.stat .label{opacity:.85;font-size:12px}
.event-feed{max-height:240px;overflow:auto;display:flex;flex-direction:column;gap:6px;position:relative}
.event-feed::before{content:"";position:absolute;top:0;left:0;right:0;height:20px;background:linear-gradient(180deg,rgba(12,20,44,.55),transparent);pointer-events:none;z-index:1}
.event-feed::after{content:"";position:absolute;bottom:0;left:0;right:0;height:20px;background:linear-gradient(0deg,rgba(12,20,44,.55),transparent);pointer-events:none;z-index:1}
.event-feed .event{opacity:.9;font-family:monospace;font-size:12px;position:relative}
.main-screen{position:relative;padding:12px 0 36px;min-height:100vh}
.main-stack{display:flex;flex-direction:column;gap:16px}
.mine-card{min-height:calc(100vh - 160px);padding:24px 20px;display:flex;flex-direction:column;gap:20px;border-radius:20px}
@media (min-width:580px){.mine-card{min-height:620px;padding:28px 26px}}
.mine-header{display:flex;align-items:center;justify-content:space-between;gap:12px}
.mine-title{display:flex;align-items:center;gap:10px;font-size:18px;font-weight:600;letter-spacing:.04em;text-shadow:0 2px 12px rgba(18,10,48,.6);position:relative}
.mine-title::after{content:"";position:absolute;left:0;bottom:-4px;width:100%;height:2px;background:linear-gradient(90deg,transparent,rgba(123,44,245,.6),transparent);opacity:.5;animation:title-glow 3s ease-in-out infinite}
@keyframes title-glow{0%,100%{opacity:.3;transform:scaleX(.8)}50%{opacity:.7;transform:scaleX(1)}}
.mine-title .icon{filter:drop-shadow(0 0 12px rgba(124,60,255,.55))}
.mine-chips{display:flex;align-items:center;gap:8px}
.mine-chips .pill{display:flex;align-items:center;gap:6px;font-size:12px;background:rgba(15,24,56,.55);box-shadow:inset 0 0 0 1px rgba(123,44,245,.25)}
.mine-grid{display:grid;gap:18px}
@media (min-width:640px){.mine-grid{grid-template-columns:220px 1fr;align-items:center}}
.mine-gauge{position:relative;display:flex;align-items:center;justify-content:center;padding:8px 0}
.mine-progress{position:relative;display:flex;flex-direction:column;gap:14px}
.mine-progress .miner-char-wrapper{position:absolute;top:-140px;left:120px;z-index:5;pointer-events:none;transform:scale(1.5)}
.mine-gauge .ring{width:200px;height:200px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:conic-gradient(#7B2CF5 0deg,rgba(255,255,255,.08) 0deg);box-shadow:inset 0 0 30px rgba(123,44,245,.28),0 24px 48px rgba(12,8,42,.55)}
.mine-gauge .ring::before{content:"";position:absolute;inset:18%;border-radius:50%;background:radial-gradient(circle at 50% 28%,rgba(123,44,245,.45),rgba(12,20,46,.92) 70%);box-shadow:inset 0 14px 28px rgba(0,0,0,.48);pointer-events:none}
.mine-gauge .ring-core{position:relative;display:flex;flex-direction:column;align-items:center;gap:4px;font-weight:600}
.mine-gauge .ring-core span{font-size:22px}
.mine-gauge .ring-core small{font-size:12px;letter-spacing:.12em;opacity:.75;text-transform:uppercase}
.ring-glow{position:absolute;width:200px;height:200px;border-radius:50%;filter:blur(32px);background:radial-gradient(circle,rgba(123,44,245,.48),rgba(44,137,245,.1));opacity:.6;animation:mine-glow 9s ease-in-out infinite}
.ring-glow-b{animation-delay:-4.5s;background:radial-gradient(circle,rgba(44,137,245,.45),transparent 65%)}
.ring-pulse{animation:ring-flash .6s ease!important}
@keyframes ring-flash{0%,100%{box-shadow:inset 0 0 30px rgba(123,44,245,.28),0 24px 48px rgba(12,8,42,.55)}50%{box-shadow:inset 0 0 50px rgba(246,196,69,.8),0 24px 68px rgba(246,196,69,.5),0 0 80px rgba(246,196,69,.4)}}
.ring-full{animation:ring-glow-full 2s ease-in-out infinite!important}
@keyframes ring-glow-full{0%,100%{box-shadow:inset 0 0 40px rgba(246,196,69,.5),0 24px 48px rgba(246,196,69,.35),0 0 60px rgba(246,196,69,.3)}50%{box-shadow:inset 0 0 60px rgba(246,196,69,.7),0 24px 68px rgba(246,196,69,.5),0 0 80px rgba(246,196,69,.5)}}
.milestone-pulse{animation:milestone-ring 1s ease}
@keyframes milestone-ring{0%{transform:scale(1)}30%{transform:scale(1.08)}60%{transform:scale(.98)}100%{transform:scale(1)}}
@keyframes mine-glow{0%,100%{transform:scale(.92);opacity:.45}50%{transform:scale(1.05);opacity:.8}}
.mine-progress-meta{display:flex;align-items:flex-end;justify-content:space-between;font-size:14px;letter-spacing:.02em}
.mine-progress-track{position:relative;height:12px;border-radius:999px;background:rgba(255,255,255,.1);overflow:hidden;box-shadow:inset 0 0 14px rgba(123,44,245,.28)}
.mine-progress-fill{height:100%;width:0;background:linear-gradient(90deg,#7B2CF5,#2C89F5);box-shadow:0 0 16px rgba(123,44,245,.65);transition:width .35s var(--ease);position:relative;overflow:hidden}
.mine-progress-fill::after{content:"";position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent);animation:progress-wave 2s linear infinite;pointer-events:none}
@keyframes progress-wave{0%{left:-100%}100%{left:200%}}
.mine-status{min-height:22px;font-size:13px;opacity:.9}
.mine-actions-grid{display:grid;gap:12px;grid-template-columns:repeat(2,minmax(0,1fr))}
.mine-actions-grid .btn{height:48px;display:flex;align-items:center;justify-content:center;font-size:15px;gap:8px}
.mine-actions-grid .span-2{grid-column:span 2}
@media (min-width:680px){.mine-actions-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.mine-actions-grid .span-2{grid-column:span 3}}
.mine-feed{position:relative;border-radius:16px;background:rgba(12,20,44,.55);padding:14px 12px;box-shadow:inset 0 0 24px rgba(123,44,245,.12);backdrop-filter:blur(12px)}
.mine-feed::before{content:"";position:absolute;inset:0;background:linear-gradient(135deg,rgba(123,44,245,.16),rgba(44,137,245,.14) 60%,transparent);opacity:.75;pointer-events:none}
.mine-feed .event-feed{max-height:180px}
.event{transition:opacity .3s ease, transform .3s ease}
.event-critical{color:#f6c445;font-weight:600}
.event-warning{color:#ff5c5c}
.event-success{color:#2ec27e}
.event-normal{color:rgba(255,255,255,.9)}
.mine-hologram{position:relative;flex:1;min-height:180px;border-radius:18px;background:radial-gradient(90% 120% at 50% 100%,rgba(44,137,245,.35),rgba(8,12,30,.3) 55%,transparent);overflow:hidden;margin-top:auto;display:flex;align-items:center;justify-content:center;isolation:isolate;transition:background .5s ease}
.holo-idle{background:radial-gradient(90% 120% at 50% 100%,rgba(123,44,245,.25),rgba(8,12,30,.3) 55%,transparent)}
.holo-mining{background:radial-gradient(90% 120% at 50% 100%,rgba(44,137,245,.45),rgba(8,12,30,.3) 55%,transparent)}
.holo-mining .mine-holo-grid{animation-duration:12s!important}
.holo-collapsed{background:radial-gradient(90% 120% at 50% 100%,rgba(255,92,92,.35),rgba(8,12,30,.3) 55%,transparent);animation:holo-glitch .5s ease infinite}
@keyframes holo-glitch{0%,100%{transform:translateX(0)}25%{transform:translateX(-2px)}75%{transform:translateX(2px)}}
.critical-flash{animation:critical-burst .4s ease}
@keyframes critical-burst{0%{background:radial-gradient(90% 120% at 50% 100%,rgba(44,137,245,.35),rgba(8,12,30,.3) 55%,transparent)}50%{background:radial-gradient(90% 120% at 50% 100%,rgba(246,196,69,.65),rgba(246,196,69,.2) 55%,transparent)}100%{background:radial-gradient(90% 120% at 50% 100%,rgba(44,137,245,.35),rgba(8,12,30,.3) 55%,transparent)}}
.mine-holo-grid{position:absolute;width:140%;height:140%;background:repeating-linear-gradient(0deg,rgba(255,255,255,.08) 0,rgba(255,255,255,.08) 1px,transparent 1px,transparent 28px),repeating-linear-gradient(90deg,rgba(255,255,255,.05) 0,rgba(255,255,255,.05) 1px,transparent 1px,transparent 26px);opacity:.22;transform:translate3d(-10%,0,0) rotate(8deg);animation:holo-pan 16s linear infinite}
.mine-holo-grid.diagonal{opacity:.18;transform:translate3d(10%,0,0) rotate(-16deg);animation-duration:22s}
@keyframes holo-pan{0%{transform:translate3d(-12%,0,0) rotate(8deg)}100%{transform:translate3d(12%,0,0) rotate(8deg)}}
.mine-holo-glow{position:absolute;width:70%;height:70%;border-radius:50%;background:radial-gradient(circle at 50% 40%,rgba(123,44,245,.55),transparent 70%);filter:blur(32px);opacity:.55;animation:holo-breathe 10s ease-in-out infinite}
@keyframes holo-breathe{0%,100%{transform:scale(.9);opacity:.45}50%{transform:scale(1.08);opacity:.85}}
.mine-shard{position:absolute;width:120px;height:120px;background:conic-gradient(from 150deg,rgba(123,44,245,.8),rgba(44,137,245,.38),rgba(123,44,245,.08));clip-path:polygon(50% 0,88% 40%,70% 100%,30% 100%,12% 40%);opacity:.26;filter:blur(.4px);animation:shard-float 8s ease-in-out infinite}
.mine-shard.shard-1{top:18%;left:16%;animation-delay:-1.4s}
.mine-shard.shard-2{bottom:16%;right:22%;animation-delay:-3.2s;transform:scale(.74)}
.mine-shard.shard-3{top:26%;right:34%;animation-delay:-5.1s;transform:scale(.5) rotate(12deg)}
@keyframes shard-float{0%,100%{transform:translateY(-10px) scale(1);opacity:.2}50%{transform:translateY(10px) scale(1.05);opacity:.4}}
.main-ambient{position:absolute;inset:0;z-index:-1;pointer-events:none;overflow:hidden}
.main-ambient .ambient.orb{position:absolute;width:420px;height:420px;border-radius:50%;filter:blur(120px);opacity:.42;animation:ambient-drift 26s ease-in-out infinite}
.main-ambient .orb-a{background:radial-gradient(circle,rgba(123,44,245,.6),transparent 70%);top:-140px;right:-120px}
.main-ambient .orb-b{background:radial-gradient(circle,rgba(44,137,245,.55),transparent 70%);bottom:-180px;left:-180px;animation-delay:-13s}
.main-ambient .grid{position:absolute;inset:0;background:radial-gradient(70% 60% at 50% 100%,rgba(255,255,255,.08),transparent 75%);opacity:.35;mix-blend-mode:screen;animation:ambient-pulse 18s ease-in-out infinite}
@keyframes ambient-drift{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(8%, -4%,0) scale(1.05)}}
@keyframes ambient-pulse{0%,100%{opacity:.25}50%{opacity:.45}}
.fade-in{animation:fade-in .3s var(--ease)}
@keyframes fade-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
.flash{animation:flash .9s ease}
@keyframes flash{0%{box-shadow:0 0 0 rgba(255,255,255,0)}40%{box-shadow:0 0 0 6px rgba(255,255,255,.15)}100%{box-shadow:0 0 0 rgba(255,255,255,0)}}
.skeleton{position:relative;overflow:hidden;background:rgba(255,255,255,.08);border-radius:var(--radius-md);height:44px}
.skeleton::after{content:"";position:absolute;inset:0;transform:translateX(-100%);background:linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent);animation:shimmer 1.2s infinite;pointer-events:none}
@keyframes shimmer{100%{transform:translateX(100%)}}
.list-item{display:flex;gap:8px;align-items:center;justify-content:space-between;background:rgba(255,255,255,.06);border-radius:var(--radius-md);padding:10px;transition:all .2s ease}
.list-item:hover{background:rgba(255,255,255,.09);transform:translateX(2px)}
.list-item--buy{border-left:3px solid var(--buy)}
.list-item--sell{border-left:3px solid var(--sell)}
.nav{max-width:var(--container-max);margin:12px auto 0;display:flex;gap:8px;flex-wrap:wrap;position:sticky;top:0;z-index:40;padding:6px;border-radius:14px;background:linear-gradient(180deg,rgba(20,20,40,.45),rgba(20,20,40,.25));backdrop-filter:blur(10px) saturate(125%);border:1px solid rgba(255,255,255,.06);box-shadow:0 4px 12px rgba(0,0,0,.3)}
.nav a{flex:1;display:flex;justify-content:center;align-items:center;gap:6px;text-align:center;padding:10px;border-radius:999px;text-decoration:none;color:#fff;transition:background var(--dur) var(--ease), transform var(--dur) var(--ease);position:relative}
.nav a::before{content:"";position:absolute;inset:0;border-radius:inherit;background:var(--grad);opacity:0;transition:opacity var(--dur) var(--ease);pointer-events:none}
.nav a:hover::before{opacity:.1}
.nav a .ico{opacity:.95}
.nav a.active{background:var(--grad);box-shadow:var(--glow)}
.nav a:not(.active):hover{background:rgba(255,255,255,.06)}
/* generic icon */
.icon{display:inline-block;line-height:0;vertical-align:middle}
.icon svg{display:block;filter:drop-shadow(0 0 8px rgba(123,44,245,.35))}
/* rarity badges */
.badge{display:inline-flex;align-items:center;gap:6px;padding:2px 8px;border-radius:999px;font-size:12px;line-height:1;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06)}
.badge i{display:inline-block;width:8px;height:8px;border-radius:999px}
.badge.rarity-common i{background:var(--rarity-common)}
.badge.rarity-rare i{background:var(--rarity-rare)}
.badge.rarity-epic i{background:var(--rarity-epic)}
.badge.rarity-legendary i{background:var(--rarity-legendary)}
.rarity-outline-common{box-shadow:0 0 0 1px rgba(154,160,166,.35) inset, 0 0 24px rgba(154,160,166,.15)}
.rarity-outline-rare{box-shadow:0 0 0 1px rgba(79,212,245,.45) inset, 0 0 28px rgba(79,212,245,.25)}
.rarity-outline-epic{box-shadow:0 0 0 1px rgba(178,107,255,.5) inset, 0 0 32px rgba(178,107,255,.3)}
.rarity-outline-legendary{box-shadow:0 0 0 1px rgba(246,196,69,.6) inset, 0 0 36px rgba(246,196,69,.35)}
/* aura card wrapper */
.item-card{position:relative;border-radius:var(--radius-md);padding:10px;background:linear-gradient(140deg,rgba(255,255,255,.06),rgba(255,255,255,.04));overflow:hidden;transition:all .3s ease}
.item-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.4)}
.item-card::before{content:"";position:absolute;inset:-1px;border-radius:inherit;padding:1px;background:linear-gradient(135deg,rgba(255,255,255,.18),rgba(255,255,255,.02));-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}
.item-card[data-rarity="common"]{border:1px solid rgba(154,160,166,.25)}
.item-card[data-rarity="rare"]{border:1px solid rgba(79,212,245,.35)}
.item-card[data-rarity="epic"]{border:1px solid rgba(178,107,255,.4)}
.item-card[data-rarity="legendary"]{border:1px solid rgba(246,196,69,.45)}
.upgrade-success{animation:upgrade-flash 1s ease}
@keyframes upgrade-flash{0%{transform:scale(1);box-shadow:0 0 0 rgba(46,194,126,0)}25%{transform:scale(1.02);box-shadow:0 0 30px rgba(46,194,126,.6),0 0 60px rgba(46,194,126,.3)}50%{transform:scale(1);box-shadow:0 0 40px rgba(46,194,126,.8),0 0 80px rgba(46,194,126,.4)}75%{transform:scale(1.01);box-shadow:0 0 30px rgba(46,194,126,.6),0 0 60px rgba(46,194,126,.3)}100%{transform:scale(1);box-shadow:0 0 0 rgba(46,194,126,0)}}
.upgrade-fail{animation:upgrade-fail-flash 1s ease}
@keyframes upgrade-fail-flash{0%{transform:scale(1);box-shadow:0 0 0 rgba(255,92,92,0)}25%{transform:scale(0.98);box-shadow:0 0 20px rgba(255,92,92,.5),0 0 40px rgba(255,92,92,.2)}50%{transform:scale(1);box-shadow:0 0 30px rgba(255,92,92,.7),0 0 50px rgba(255,92,92,.3)}75%{transform:scale(0.99);box-shadow:0 0 20px rgba(255,92,92,.5),0 0 40px rgba(255,92,92,.2)}100%{transform:scale(1);box-shadow:0 0 0 rgba(255,92,92,0)}}
.fragment-card{display:flex;flex-direction:column;gap:8px;background:rgba(255,255,255,.06);border-radius:12px;padding:12px;border:1px solid rgba(123,44,245,.25);transition:all .3s ease;position:relative;overflow:hidden}
.fragment-card::before{content:"";position:absolute;top:0;right:0;width:40px;height:40px;background:radial-gradient(circle,rgba(123,44,245,.3),transparent);opacity:0;transition:opacity .3s ease;pointer-events:none}
.fragment-card:hover::before{opacity:1;animation:corner-pulse 2s ease-in-out infinite}
@keyframes corner-pulse{0%,100%{transform:scale(1);opacity:.3}50%{transform:scale(1.2);opacity:.6}}
.fragment-card.can-craft{border-color:rgba(46,194,126,.5);box-shadow:0 0 12px rgba(46,194,126,.2);animation:fragment-ready 2s ease-in-out infinite}
@keyframes fragment-ready{0%,100%{box-shadow:0 0 12px rgba(46,194,126,.2)}50%{box-shadow:0 0 20px rgba(46,194,126,.4),0 0 40px rgba(46,194,126,.2)}}
.fragment-icon{font-size:32px;text-align:center}
.fragment-info{display:flex;flex-direction:column;gap:4px;text-align:center}
.fragment-name{font-size:14px;font-weight:600}
.fragment-count{font-size:13px;opacity:.85}
.btn-sm{padding:6px 10px;font-size:13px;height:auto}
.ad-overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(8px);z-index:10000;display:flex;align-items:center;justify-content:center;animation:fade-in .3s ease}
.ad-dialog{max-width:420px;width:90%;background:var(--panel-grad);border-radius:var(--radius-lg);box-shadow:var(--glow);padding:24px;animation:fade-in .3s ease}
.ad-content{display:flex;flex-direction:column;align-items:center;gap:12px}
.ad-icon{font-size:48px;filter:drop-shadow(0 0 12px rgba(123,44,245,.6))}
.ad-placeholder{display:flex;flex-direction:column;align-items:center;margin:12px 0;padding:20px;background:rgba(255,255,255,.04);border-radius:12px;width:100%}
.ad-progress-ring{position:relative;width:100px;height:100px}
.ad-circle-bg{fill:none;stroke:rgba(255,255,255,.1);stroke-width:8}
.ad-circle-fg{fill:none;stroke:url(#grad);stroke-width:8;stroke-linecap:round;transform:rotate(-90deg);transform-origin:50% 50%;transition:stroke-dashoffset .3s ease}
.ad-countdown{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700}
.ad-actions{display:flex;gap:12px;width:100%}
/* 矿工动画 */
.miner-animation{display:flex;flex-direction:column;align-items:center;gap:4px;opacity:.9}
.miner-svg{width:100px;height:100px}
.miner-body{animation:miner-bounce 1.5s ease-in-out infinite}
@keyframes miner-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
.miner-arm{transform-origin:110px 95px;animation:pickaxe-swing 1.2s ease-in-out infinite}
@keyframes pickaxe-swing{0%,100%{transform:rotate(0deg)}30%{transform:rotate(-35deg)}60%{transform:rotate(-25deg)}}
.miner-light{animation:helmet-light 2s ease-in-out infinite}
@keyframes helmet-light{0%,100%{opacity:.6}50%{opacity:1}}
.ore-particle{animation:ore-spark 1.2s ease-out infinite}
.ore-particle.p1{animation-delay:0.3s}
.ore-particle.p2{animation-delay:0.4s}
.ore-particle.p3{animation-delay:0.35s}
@keyframes ore-spark{0%{opacity:0;transform:translate(0,0) scale(1)}30%{opacity:1}100%{opacity:0;transform:translate(-10px,15px) scale(0.3)}}
.miner-status{font-size:13px;opacity:.75;letter-spacing:.05em}
.miner-idle{display:flex;flex-direction:column;align-items:center;gap:4px;opacity:.5}
.miner-idle svg{width:75px;height:75px}
.idle-miner{animation:idle-breathe 3s ease-in-out infinite}
@keyframes idle-breathe{0%,100%{opacity:.6;transform:scale(1)}50%{opacity:.8;transform:scale(1.02)}}
@keyframes warning-pulse{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.1);opacity:1}}
.critical-mining .miner-arm{animation:pickaxe-critical .4s ease-in-out 3!important}
@keyframes pickaxe-critical{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-45deg)}}
/* 宝箱动画 */
.treasure-chest{display:inline-block;vertical-align:middle}
.chest-body{animation:chest-bounce .8s ease-in-out infinite}
@keyframes chest-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
.chest-lid{transform-origin:50% 10px;animation:chest-open 2s ease-in-out infinite}
@keyframes chest-open{0%,90%{transform:rotateX(0deg)}95%{transform:rotateX(-15deg)}100%{transform:rotateX(0deg)}}
.chest-coins .coin{animation:coin-pop 1.5s ease-out infinite}
.coin.c1{animation-delay:0s}
.coin.c2{animation-delay:0.15s}
.coin.c3{animation-delay:0.3s}
@keyframes coin-pop{0%,80%{opacity:0;transform:translateY(0) scale(0)}85%{opacity:1;transform:translateY(-8px) scale(1.2)}100%{opacity:0;transform:translateY(-12px) scale(0.8)}}
/* 剑气特效 */
.sword-slash{display:inline-block;vertical-align:middle}
.slash-trail{animation:slash-anim 1s ease-in-out infinite}
.slash1{animation-delay:0s}
.slash2{animation-delay:0.1s}
@keyframes slash-anim{0%,70%{opacity:0;stroke-dasharray:0 100;stroke-dashoffset:0}75%{opacity:0.8;stroke-dasharray:20 100;stroke-dashoffset:0}100%{opacity:0;stroke-dasharray:20 100;stroke-dashoffset:-20}}
/* 金币旋转 */
.spinning-coin{display:inline-block;vertical-align:middle}
.coin-spin{animation:coin-rotate 3s linear infinite}
@keyframes coin-rotate{0%{transform:rotateY(0deg)}100%{transform:rotateY(360deg)}}
/* 奖杯动画 */
.trophy-anim{display:inline-block;vertical-align:middle}
.trophy-bounce{animation:trophy-jump 2s ease-in-out infinite}
@keyframes trophy-jump{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
.trophy-star{animation:star-twinkle 1.5s ease-in-out infinite}
@keyframes star-twinkle{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:1;transform:scale(1.3)}}
/* 能量波纹 */
.energy-ripple{opacity:0;transition:opacity .3s ease}
.btn-energy:hover .energy-ripple{opacity:1}
.ripple{animation:ripple-expand 2s ease-out infinite}
.r1{animation-delay:0s}
.r2{animation-delay:0.3s}
.r3{animation-delay:0.6s}
@keyframes ripple-expand{0%{r:20;opacity:0.6}100%{r:45;opacity:0}}
/* 装载粒子流 */
.loading-particles{opacity:0;transition:opacity .3s ease}
.mine-progress-fill:not([style*="width: 0"]) ~ .loading-particles{opacity:1}
.particle{animation:particle-flow 2s linear infinite}
.part1{animation-delay:0s}
.part2{animation-delay:0.4s}
.part3{animation-delay:0.8s}
@keyframes particle-flow{0%{cx:0;opacity:0}10%{opacity:1}90%{opacity:1}100%{cx:400;opacity:0}}
/* 资源卡片粒子 */
.stat-particles{opacity:0;transition:opacity .3s ease}
.stat-animated:hover .stat-particles{opacity:1}
.stat-particle{animation:stat-float 3s ease-in-out infinite}
.sp1{animation-delay:0s}
.sp2{animation-delay:0.5s}
.sp3{animation-delay:1s}
@keyframes stat-float{0%{cy:25;opacity:0}30%{opacity:0.6}60%{cy:15;opacity:0.8}100%{cy:8;opacity:0}}
/* 闪电效果 */
.lightning-effect{position:absolute;inset:0;pointer-events:none;z-index:10}
.lightning-group{animation:lightning-flash .6s ease}
@keyframes lightning-flash{0%{opacity:0}10%{opacity:1}20%{opacity:0}30%{opacity:1}40%{opacity:0}}
.bolt{stroke-dasharray:200;stroke-dashoffset:200;animation:bolt-draw .3s ease forwards}
@keyframes bolt-draw{to{stroke-dashoffset:0}}
/* 魔法阵 */
.magic-circle{position:absolute;inset:0;pointer-events:none;opacity:0.3;z-index:0}
.magic-ring{stroke-dasharray:4 8;animation:magic-rotate 20s linear infinite}
.ring-1{animation-duration:20s}
.ring-2{animation-duration:15s;animation-direction:reverse}
.ring-3{animation-duration:25s}
@keyframes magic-rotate{from{transform:rotate(0deg);transform-origin:50% 50%}to{transform:rotate(360deg);transform-origin:50% 50%}}
.rune{animation:rune-pulse 2s ease-in-out infinite}
.r1{animation-delay:0s}
.r2{animation-delay:0.5s}
.r3{animation-delay:1s}
.r4{animation-delay:1.5s}
@keyframes rune-pulse{0%,100%{r:3;opacity:.6}50%{r:5;opacity:1}}
.center-star{animation:star-rotate 4s linear infinite}
@keyframes star-rotate{from{transform:rotate(0deg);transform-origin:150px 150px}to{transform:rotate(360deg);transform-origin:150px 150px}}
/* 星空背景 */
.starfield{opacity:0.4}
.star{animation:star-twinkle-bg 4s ease-in-out infinite}
@keyframes star-twinkle-bg{0%,100%{opacity:0}50%{opacity:0.8}}
/* 能量脉冲 */
.pulse-wave{animation:pulse-expand 3s ease-out infinite}
.wave-1{animation-delay:0s}
.wave-2{animation-delay:1s}
.wave-3{animation-delay:2s}
@keyframes pulse-expand{0%{r:10;opacity:0.8}100%{r:90;opacity:0}}
/* 数据流 */
.data-stream{animation:stream-flow 2s linear infinite}
@keyframes stream-flow{from{transform:translateY(-100px)}to{transform:translateY(100px)}}
/* vertical timeline */
.timeline{position:relative;margin-top:8px;padding-left:16px}
.timeline::before{content:"";position:absolute;left:6px;top:0;bottom:0;width:2px;background:rgba(255,255,255,.1);pointer-events:none}
.timeline-item{position:relative;margin:8px 0 8px 0}
.timeline-item .dot{position:absolute;left:-12px;top:2px;width:10px;height:10px;border-radius:999px;background:var(--rarity-rare);box-shadow:0 0 10px rgba(79,212,245,.5)}
.timeline-item .time{opacity:.75;font-size:12px}
.timeline-item .desc{margin-top:2px}
/* action buttons line */
.actions{display:flex;gap:6px;flex-wrap:wrap}
/* subtle hover */
.hover-lift{transition:transform var(--dur) var(--ease), box-shadow var(--dur) var(--ease)}
.hover-lift:hover{transform:translateY(-1px)}
/* ring meter */
.ring{--size:116px;--thick:10px;position:relative;width:var(--size);height:var(--size);border-radius:50%;background:conic-gradient(#7B2CF5 0deg, rgba(255,255,255,.08) 0deg)}
.ring::after{content:"";position:absolute;inset:calc(var(--thick));border-radius:inherit;background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.02));pointer-events:none}
.ring .label{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-weight:700}
/* toast */
.toast-wrap{position:fixed;right:16px;bottom:16px;display:flex;flex-direction:column;gap:8px;z-index:9999}
.toast{max-width:340px;padding:10px 12px;border-radius:12px;color:#fff;background:rgba(30,30,50,.96);box-shadow:var(--glow);position:relative;overflow:hidden;border:1px solid rgba(123,44,245,.3);animation:toast-slide-in .3s ease}
.toast.success{background:linear-gradient(180deg,rgba(46,194,126,.16),rgba(30,30,50,.96))}
.toast.warn{background:linear-gradient(180deg,rgba(246,196,69,.18),rgba(30,30,50,.96))}
.toast.error{background:linear-gradient(180deg,rgba(255,92,92,.18),rgba(30,30,50,.96))}
.toast .life{position:absolute;left:0;bottom:0;height:2px;background:#7B2CF5;animation:toast-life var(--life,3.5s) linear forwards}
@keyframes toast-life{from{width:100%}to{width:0}}
@keyframes toast-slide-in{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
@media (prefers-reduced-motion:reduce){*{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:0ms!important}}

/* responsive width + desktop grid layout for fullness */
@media (min-width:900px){:root{--container-max:920px}}
@media (min-width:1200px){:root{--container-max:1080px}}

.container.grid-2{display:grid;grid-template-columns:1fr;gap:12px}
@media (min-width:980px){
  .container.grid-2{grid-template-columns:1fr 1fr;align-items:start}
  .container.grid-2>.card:first-child{grid-column:1/-1}
}

/* decorative page overlays: aurora, grid lines, bottom glow */
html::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:-2;opacity:.035;background-image:linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px);background-size:24px 24px}
body::before{content:"";position:fixed;right:-10vw;top:-18vh;width:70vw;height:70vh;pointer-events:none;z-index:-1;filter:blur(50px);opacity:.55;background:radial-gradient(closest-side at 25% 40%, rgba(123,44,245,.35), transparent 65%), radial-gradient(closest-side at 70% 60%, rgba(44,137,245,.25), transparent 70%);mix-blend-mode:screen;animation:aurora-a 18s ease-in-out infinite alternate}
body::after{content:"";position:fixed;left:-10vw;bottom:-22vh;width:120vw;height:60vh;pointer-events:none;z-index:-1;filter:blur(60px);opacity:.75;background:radial-gradient(120vw 60vh at 50% 100%, rgba(44,137,245,.22), transparent 65%), conic-gradient(from 200deg at 50% 75%, rgba(123,44,245,.18), rgba(44,137,245,.12), transparent 70%);mix-blend-mode:screen;animation:aurora-b 22s ease-in-out infinite alternate}
@keyframes aurora-a{0%{transform:translateY(0)}100%{transform:translateY(14px)}}
@keyframes aurora-b{0%{transform:translateY(0)}100%{transform:translateY(-12px)}}
`;
  const style = document.createElement('style');
  style.setAttribute('data-ui', 'miner-game');
  style.textContent = css;
  document.head.appendChild(style);
  injected = true;

  // soft starfield background (very light)
  try {
    const exists = document.querySelector('[data-stars]');
    if (!exists) {
      const cvs = document.createElement('canvas');
      cvs.setAttribute('data-stars', '');
      cvs.style.cssText = 'position:fixed;inset:0;z-index:-2;opacity:.40;pointer-events:none;';
      document.body.appendChild(cvs);
      const ctx = cvs.getContext('2d');
      const stars = Array.from({ length: 80 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random()*1.2+0.2, s: Math.random()*0.8+0.2 }));
      type Meteor = { x: number; y: number; vx: number; vy: number; life: number; ttl: number };
      const meteors: Meteor[] = [];
      const spawnMeteor = () => {
        const x = Math.random()*cvs.width*0.6 + cvs.width*0.2;
        const y = -20; // from top
        const speed = 3 + Math.random()*3;
        const angle = Math.PI*0.8 + Math.random()*0.2; // diagonally
        meteors.push({ x, y, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed, life: 0, ttl: 1200 + Math.random()*800 });
      };
      // gentle planets/orbs
      const orbs = Array.from({ length: 2 }, () => ({ x: Math.random(), y: Math.random()*0.5 + 0.1, r: Math.random()*80 + 70, hue: Math.random() }));
      const fit = () => { cvs.width = window.innerWidth; cvs.height = window.innerHeight; };
      fit();
      window.addEventListener('resize', fit);
      let t = 0;
      const loop = () => {
        if (!ctx) return;
        t += 0.016;
        ctx.clearRect(0,0,cvs.width,cvs.height);
        // soft orbs
        for (const ob of orbs) {
          const x = ob.x * cvs.width, y = ob.y * cvs.height;
          const pulse = (Math.sin(t*0.6 + x*0.0015)*0.5+0.5)*0.12;
          const rad = ob.r * (1+pulse);
          const grad = ctx.createRadialGradient(x, y, 0, x, y, rad);
          grad.addColorStop(0, 'rgba(110,80,255,0.10)');
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(x, y, rad, 0, Math.PI*2);
          ctx.fill();
        }
        // stars twinkle
        for (const st of stars) {
          const x = st.x * cvs.width, y = st.y * cvs.height;
          const tw = (Math.sin(t*1.6 + x*0.002 + y*0.003)*0.5+0.5)*0.5+0.5;
          ctx.beginPath();
          ctx.arc(x, y, st.r + tw*0.6, 0, Math.PI*2);
          ctx.fillStyle = 'rgba(180,200,255,0.6)';
          ctx.fill();
        }
        // meteors
        if (Math.random() < 0.015 && meteors.length < 2) spawnMeteor();
        for (let i=meteors.length-1; i>=0; i--) {
          const m = meteors[i];
          m.x += m.vx; m.y += m.vy; m.life += 16;
          // trail
          const trail = ctx.createLinearGradient(m.x, m.y, m.x - m.vx*8, m.y - m.vy*8);
          trail.addColorStop(0, 'rgba(255,255,255,0.9)');
          trail.addColorStop(1, 'rgba(150,180,255,0)');
          ctx.strokeStyle = trail;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(m.x - m.vx*10, m.y - m.vy*10);
          ctx.lineTo(m.x, m.y);
          ctx.stroke();
          if (m.y > cvs.height + 40 || m.x < -40 || m.x > cvs.width + 40 || m.life > m.ttl) {
            meteors.splice(i,1);
          }
        }
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }
  } catch {}
}
