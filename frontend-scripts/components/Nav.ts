export function renderNav(active: string): HTMLElement {
  const tabs: { key: string; text: string; href: string }[] = [
    { key: 'main', text: '主页', href: '#/main' },
    { key: 'warehouse', text: '仓库', href: '#/warehouse' },
    { key: 'plunder', text: '掠夺', href: '#/plunder' },
    { key: 'exchange', text: '交易所', href: '#/exchange' },
    { key: 'ranking', text: '排行', href: '#/ranking' },
  ];
  const wrap = document.createElement('div');
  wrap.className = 'nav';
  for (const t of tabs) {
    const a = document.createElement('a');
    a.href = t.href;
    a.textContent = t.text;
    if (t.key === active) a.classList.add('active');
    wrap.appendChild(a);
  }
  return wrap;
}
