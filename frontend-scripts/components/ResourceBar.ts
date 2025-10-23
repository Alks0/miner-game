import { NetworkManager } from '../core/NetworkManager';

export function renderResourceBar() {
  const box = document.createElement('div');
  box.className = 'container';
  const card = document.createElement('div');
  card.className = 'card fade-in';
  card.innerHTML = `
    <div style="display:flex;justify-content:space-between"><span>💎 矿石</span><strong id="ore">0</strong></div>
    <div style="display:flex;justify-content:space-between"><span>🪙 BB币</span><strong id="coin">0</strong></div>
  `;
  box.appendChild(card);
  const oreEl = card.querySelector('#ore') as HTMLElement;
  const coinEl = card.querySelector('#coin') as HTMLElement;
  async function update() {
    try {
      const p = await NetworkManager.I.request<{ id: string; username: string; nickname: string; oreAmount: number; bbCoins: number }>('/user/profile');
      oreEl.textContent = String(p.oreAmount);
      coinEl.textContent = String(p.bbCoins);
    } catch {
      // ignore fetch errors; UI 会在下一次刷新时恢复
    }
  }
  return { root: box, update };
}
