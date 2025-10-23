let injected = false;

export function ensureGlobalStyles() {
  if (injected) return;
  const css = `:root{--bg:#0b1020;--fg:#fff;--muted:rgba(255,255,255,.75);--grad:linear-gradient(135deg,#7B2CF5,#2C89F5);--panel-grad:linear-gradient(135deg,rgba(123,44,245,.25),rgba(44,137,245,.25));--glass:blur(10px);--glow:0 8px 20px rgba(0,0,0,.35),0 0 12px rgba(123,44,245,.7);--radius-sm:10px;--radius-md:12px;--radius-lg:16px;--ease:cubic-bezier(.22,.61,.36,1);--dur:.28s;--buy:#2C89F5;--sell:#E36414;--ok:#2ec27e;--warn:#f6c445;--danger:#ff5c5c}
html,body{background:var(--bg);color:var(--fg);font-family:system-ui,-apple-system,"Segoe UI","PingFang SC","Microsoft YaHei",Arial,sans-serif}
.container{padding:0 12px}
.container{max-width:680px;margin:12px auto}
.card{border-radius:var(--radius-lg);background:var(--panel-grad);backdrop-filter:var(--glass);box-shadow:var(--glow);padding:12px}
.row{display:flex;gap:8px;align-items:center}
.card input,.card button{box-sizing:border-box;outline:none}
.card input{background:rgba(255,255,255,.08);border:0;border-radius:var(--radius-md);color:var(--fg);padding:10px;margin:8px 0;appearance:none;-webkit-appearance:none;background-clip:padding-box}
.card button{width:100%;border-radius:var(--radius-md)}
.btn{padding:10px 14px;border:0;border-radius:var(--radius-md);color:#fff;transition:transform var(--dur) var(--ease),box-shadow var(--dur) var(--ease)}
.btn:active{transform:translateY(1px) scale(.99)}
.btn-primary{background:var(--grad);box-shadow:var(--glow)}
.btn-buy{background:var(--buy)}
.btn-sell{background:var(--sell)}
.btn-ghost{background:rgba(255,255,255,.08)}
.input{width:100%;padding:10px;border:0;border-radius:var(--radius-md);background:rgba(255,255,255,.08);color:var(--fg)}
.pill{padding:2px 8px;border-radius:999px;background:rgba(255,255,255,.08);font-size:12px}
.fade-in{animation:fade-in .3s var(--ease)}
@keyframes fade-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
.flash{animation:flash .9s ease}
@keyframes flash{0%{box-shadow:0 0 0 rgba(255,255,255,0)}40%{box-shadow:0 0 0 6px rgba(255,255,255,.15)}100%{box-shadow:0 0 0 rgba(255,255,255,0)}}
.skeleton{position:relative;overflow:hidden;background:rgba(255,255,255,.08);border-radius:var(--radius-md);height:44px}
.skeleton::after{content:"";position:absolute;inset:0;transform:translateX(-100%);background:linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent);animation:shimmer 1.2s infinite}
@keyframes shimmer{100%{transform:translateX(100%)}}
.list-item{display:flex;gap:8px;align-items:center;justify-content:space-between;background:rgba(255,255,255,.06);border-radius:var(--radius-md);padding:10px}
.list-item--buy{border-left:3px solid var(--buy)}
.list-item--sell{border-left:3px solid var(--sell)}
.nav{max-width:480px;margin:12px auto 0;display:flex;gap:8px;flex-wrap:wrap;position:sticky;top:0;z-index:10}
.nav a{flex:1;text-align:center;padding:10px;border-radius:999px;text-decoration:none;color:#fff}
.nav a.active{background:var(--grad);box-shadow:var(--glow)}
@media (prefers-reduced-motion:reduce){*{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:0ms!important}}
`;
  const style = document.createElement('style');
  style.setAttribute('data-ui', 'miner-game');
  style.textContent = css;
  document.head.appendChild(style);
  injected = true;
}
