import { GameManager } from '../core/GameManager';
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
  
  // 添加退出登录按钮
  const logoutBtn = document.createElement('a');
  logoutBtn.href = '#';
  logoutBtn.className = 'nav-logout';
  logoutBtn.style.cssText = 'margin-left:auto;opacity:.75;';
  const logoutIco = renderIcon('logout', { size: 18, className: 'ico' });
  const logoutLabel = document.createElement('span');
  logoutLabel.textContent = '退出';
  logoutBtn.appendChild(logoutIco);
  logoutBtn.appendChild(logoutLabel);
  logoutBtn.onclick = (e) => {
    e.preventDefault();
    if (confirm('确定要退出登录吗？')) {
      GameManager.I.logout();
    }
  };
  wrap.appendChild(logoutBtn);
  
  return wrap;
}
