import { NetworkManager } from '../core/NetworkManager';
import { renderIcon } from './Icon';
import { CountUpText } from './CountUpText';

export function renderResourceBar() {
  const box = document.createElement('div');
  box.className = 'container';
  const card = document.createElement('div');
  card.className = 'card fade-in';
  card.innerHTML = `
    <div class="stats">
      <div class="stat stat-animated" id="ore-stat">
        <div class="ico" data-ico="ore"></div>
        <div style="display:flex;flex-direction:column;gap:2px;">
          <div class="val" id="ore">0</div>
          <div class="label">矿石</div>
        </div>
        <svg class="stat-particles" width="100%" height="100%" viewBox="0 0 100 50" style="position:absolute;inset:0;pointer-events:none;">
          <circle class="stat-particle sp1" cx="20" cy="25" r="1.5" fill="#7B2CF5" opacity="0"/>
          <circle class="stat-particle sp2" cx="50" cy="25" r="1" fill="#2C89F5" opacity="0"/>
          <circle class="stat-particle sp3" cx="80" cy="25" r="1.5" fill="#f6c445" opacity="0"/>
        </svg>
      </div>
      <div class="stat stat-animated" id="coin-stat">
        <div class="ico" data-ico="coin"></div>
        <div style="display:flex;flex-direction:column;gap:2px;">
          <div class="val" id="coin">0</div>
          <div class="label">BB</div>
        </div>
        <svg class="stat-particles" width="100%" height="100%" viewBox="0 0 100 50" style="position:absolute;inset:0;pointer-events:none;">
          <circle class="stat-particle sp1" cx="20" cy="25" r="1.5" fill="#f6c445" opacity="0"/>
          <circle class="stat-particle sp2" cx="50" cy="25" r="1" fill="#ffd700" opacity="0"/>
          <circle class="stat-particle sp3" cx="80" cy="25" r="1.5" fill="#e36414" opacity="0"/>
        </svg>
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
  
  const oreCounter = new CountUpText();
  const coinCounter = new CountUpText();
  oreCounter.onUpdate = (text) => { oreEl.textContent = text; };
  coinCounter.onUpdate = (text) => { coinEl.textContent = text; };
  
  let prevOre = 0;
  let prevCoin = 0;
  
  async function update() {
    try {
      const p = await NetworkManager.I.request<{ id: string; username: string; nickname: string; oreAmount: number; bbCoins: number }>('/user/profile');
      
      // 使用计数动画更新
      if (p.oreAmount !== prevOre) {
        oreCounter.to(p.oreAmount, 800);
        // 如果是增加，添加图标脉冲效果
        if (p.oreAmount > prevOre) {
          const oreIcon = card.querySelector('#ore-stat .ico');
          if (oreIcon) {
            oreIcon.classList.add('pulse-icon');
            setTimeout(() => oreIcon.classList.remove('pulse-icon'), 600);
          }
        }
        prevOre = p.oreAmount;
      }
      
      if (p.bbCoins !== prevCoin) {
        coinCounter.to(p.bbCoins, 800);
        if (p.bbCoins > prevCoin) {
          const coinIcon = card.querySelector('#coin-stat .ico');
          if (coinIcon) {
            coinIcon.classList.add('pulse-icon');
            setTimeout(() => coinIcon.classList.remove('pulse-icon'), 600);
          }
        }
        prevCoin = p.bbCoins;
      }
    } catch {
      // ignore fetch errors; UI 会在下一次刷新时恢复
    }
  }
  return { root: box, update, oreEl, coinEl };
}
