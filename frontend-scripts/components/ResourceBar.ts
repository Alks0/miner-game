import { NetworkManager } from '../core/NetworkManager';
import { renderIcon } from './Icon';

export function renderResourceBar() {
  const box = document.createElement('div');
  box.className = 'container';
  const card = document.createElement('div');
  card.className = 'card fade-in';
  card.innerHTML = `
    <div style="display:flex;justify-content:space-between"><span>💎 矿石</span><strong id="ore">0</strong></div>
    <div style="display:flex;justify-content:space-between"><span>🪙 BB币</span><strong id="coin">0</strong></div>
  `;
  // override with enhanced stats layout
  card.innerHTML = `
    <div class="stats">
      <div class="stat">
        <div class="ico" data-ico="ore"></div>
        <div style="display:flex;flex-direction:column;gap:2px;">
          <div class="val" id="ore">0</div>
          <div class="label">矿石</div>
        </div>
      </div>
      <div class="stat">
        <div class="ico" data-ico="coin"></div>
        <div style="display:flex;flex-direction:column;gap:2px;">
          <div class="val" id="coin">0</div>
          <div class="label">BB</div>
        </div>
      </div>
    </div>
  `;
  box.appendChild(card);
  // inject icons
  try {
    const oreIco = card.querySelector('[data-ico="ore"]');
    const coinIco = card.querySelector('[data-ico="coin"]');
    if (oreIco) oreIco.appendChild(renderIcon('ore', { size: 18 }));
    if (coinIco) coinIco.appendChild(renderIcon('coin', { size: 18 }));
  } catch {}
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
