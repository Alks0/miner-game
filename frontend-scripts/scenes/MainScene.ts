import { GameManager } from '../core/GameManager';
import { NetworkManager } from '../core/NetworkManager';
import { RealtimeClient } from '../core/RealtimeClient';
import { html, qs } from '../utils/dom';

export class MainScene {
  private ore = 0; private coin = 0; private cartAmt = 0; private cartCap = 1000;

  mount(root: HTMLElement) {
    const view = html(`
      <div style="max-width:420px;margin:20px auto;color:#fff;">
        <div class="res card" style="padding:16px;border-radius:16px;background:linear-gradient(135deg, rgba(123,44,245,.25), rgba(44,137,245,.25));backdrop-filter:blur(10px);box-shadow:0 8px 20px rgba(0,0,0,.35),0 0 12px rgba(123,44,245,.7);">
          <div style="display:flex;justify-content:space-between"><span>💎 矿石</span><strong id="ore">0</strong></div>
          <div style="display:flex;justify-content:space-between"><span>🪙 BB币</span><strong id="coin">0</strong></div>
        </div>
        <div class="mine card" style="padding:16px;border-radius:16px;margin-top:12px;background:linear-gradient(135deg, rgba(123,44,245,.25), rgba(44,137,245,.25));backdrop-filter:blur(10px);box-shadow:0 8px 20px rgba(0,0,0,.35),0 0 12px rgba(123,44,245,.7);">
          <div style="opacity:.9;margin-bottom:8px;">⛏️ 挖矿中</div>
          <div style="height:10px;border-radius:999px;background:rgba(255,255,255,.12);overflow:hidden"><div id="fill" style="height:100%;width:0%;background:linear-gradient(90deg,#7B2CF5,#2C89F5);box-shadow:0 0 10px #7B2CF5;transition:width .3s ease"></div></div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0 12px"><span>矿车</span><strong id="percent">0%</strong></div>
          <button id="collect" style="width:100%;padding:12px;border-radius:12px;color:#fff;background:linear-gradient(135deg,#7B2CF5,#2C89F5);box-shadow:0 8px 20px rgba(0,0,0,.35),0 0 12px #7B2CF5;">收矿</button>
        </div>
      </div>
    `);
    root.innerHTML = '';
    root.appendChild(view);
    this.refreshFromProfile();
    this.bindRealtime(view);
    this.startMining();
    qs<HTMLButtonElement>(view, '#collect').onclick = () => this.collect(view);
  }

  private async refreshFromProfile() {
    const p = GameManager.I.getProfile();
    if (p) { this.ore = p.oreAmount; this.coin = p.bbCoins; }
  }

  private bindRealtime(view: HTMLElement) {
    const token = (NetworkManager as any).I['token'];
    if (token) RealtimeClient.I.connect(token);
    RealtimeClient.I.on('mine.update', (msg) => {
      this.cartAmt = msg.cartAmount; this.cartCap = msg.cartCapacity;
      const pct = Math.min(1, this.cartAmt / this.cartCap);
      qs(view, '#fill').setAttribute('style', `height:100%;width:${Math.round(pct*100)}%;background:linear-gradient(90deg,#7B2CF5,#2C89F5);box-shadow:0 0 10px #7B2CF5;transition:width .3s ease`);
      qs(view, '#percent').textContent = `${Math.round(pct*100)}%`;
    });
  }

  private async startMining() {
    await NetworkManager.I.request('/mine/start', { method: 'POST' });
    const cart = await NetworkManager.I.request<{ cartAmount:number; cartCapacity:number }>('/mine/cart');
    this.cartAmt = cart.cartAmount; this.cartCap = cart.cartCapacity;
  }

  private async collect(view: HTMLElement) {
    const r = await NetworkManager.I.request<{ collected:number }>('/mine/collect', { method: 'POST' });
    this.ore += r.collected;
    qs(view, '#ore').textContent = `${this.ore.toLocaleString()}`;
  }
}


