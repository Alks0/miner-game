export function renderNav(active: string): HTMLElement {
  const tabs: { key: string; text: string; href: string }[] = [
    { key: 'main', text: '主页', href: '#/main' },
    { key: 'warehouse', text: '仓库', href: '#/warehouse' },
    { key: 'plunder', text: '掠夺', href: '#/plunder' },
    { key: 'exchange', text: '交易所', href: '#/exchange' },
    { key: 'ranking', text: '排行', href: '#/ranking' },
  ];
  const wrap = document.createElement('div');
  wrap.style.cssText = 'max-width:480px;margin:12px auto 0;display:flex;gap:8px;flex-wrap:wrap;';
  for (const t of tabs) {
    const a = document.createElement('a');
    a.href = t.href;
    a.textContent = t.text;
    a.style.cssText = `flex:1;text-align:center;padding:10px;border-radius:999px;text-decoration:none;`+
      `background:${t.key===active? 'linear-gradient(135deg,#7B2CF5,#2C89F5)' : 'rgba(255,255,255,.08)'};`+
      `color:#fff;box-shadow:${t.key===active? '0 0 12px #7B2CF5' : 'none'};`;
    wrap.appendChild(a);
  }
  return wrap;
}

