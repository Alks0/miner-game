import { renderIcon } from './Icon';

export function renderNav(active: string): HTMLElement {
  const tabs: { key: string; text: string; href: string; icon: any }[] = [
    { key: 'main', text: '主页', href: '#/main', icon: 'home' },
    { key: 'warehouse', text: '仓库', href: '#/warehouse', icon: 'warehouse' },
    { key: 'plunder', text: '掠夺', href: '#/plunder', icon: 'plunder' },
    { key: 'exchange', text: '交易所', href: '#/exchange', icon: 'exchange' },
    { key: 'ranking', text: '排行', href: '#/ranking', icon: 'ranking' },
  ];
  const wrap = document.createElement('div');
  wrap.className = 'nav';
  for (const t of tabs) {
    const a = document.createElement('a');
    a.href = t.href;
    const ico = renderIcon(t.icon, { size: 18, className: 'ico' });
    const label = document.createElement('span');
    label.textContent = t.text;
    a.appendChild(ico);
    a.appendChild(label);
    if (t.key === active) a.classList.add('active');
    wrap.appendChild(a);
  }
  return wrap;
}
