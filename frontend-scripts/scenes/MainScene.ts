import { NetworkManager } from '../core/NetworkManager';
import { RealtimeClient } from '../core/RealtimeClient';
import { html, qs } from '../utils/dom';
import { renderNav } from '../components/Nav';
import { renderResourceBar } from '../components/ResourceBar';
import { showToast } from '../components/Toast';
import { spawnFloatText } from '../components/FloatText';
import { renderIcon } from '../components/Icon';

type MineStatus = {
  cartAmount: number;
  cartCapacity: number;
  collapsed: boolean;
  collapsedRemaining: number;
  running: boolean;
  intervalMs: number;
};

type PendingAction = 'start' | 'stop' | 'collect' | 'repair' | 'status' | null;

export class MainScene {
  private view: HTMLElement | null = null;
  private cartAmt = 0;
  private cartCap = 1000;
  private isMining = false;
  private isCollapsed = false;
  private collapseRemaining = 0;
  private collapseTimer: number | null = null;
  private intervalMs = 3000;
  private pending: PendingAction = null;

  private els = {
    fill: null as HTMLElement | null,
    percent: null as HTMLElement | null,
    statusText: null as HTMLElement | null,
    ring: null as HTMLElement | null,
    ringPct: null as HTMLElement | null,
    cycle: null as HTMLElement | null,
    statusTag: null as HTMLElement | null,
    events: null as HTMLElement | null,
    start: null as HTMLButtonElement | null,
    stop: null as HTMLButtonElement | null,
    collect: null as HTMLButtonElement | null,
    repair: null as HTMLButtonElement | null,
    statusBtn: null as HTMLButtonElement | null,
  };

  private mineUpdateHandler?: (msg: any) => void;
  private mineCollapseHandler?: (msg: any) => void;
  private plunderHandler?: (msg: any) => void;

  async mount(root: HTMLElement) {
    this.clearCollapseTimer();
    this.pending = null;

    const nav = renderNav('main');
    const bar = renderResourceBar();
    const view = html(`
      <div class="container grid-2" style="color:#fff;">
        <div class="mine card fade-in">
          <div style="opacity:.9;margin-bottom:8px;display:flex;align-items:center;gap:8px;"><span data-ico="pick"></span>挖矿面板</div>
          <div style="height:10px;border-radius:999px;background:rgba(255,255,255,.12);overflow:hidden;">
            <div id="fill" style="height:100%;width:0%;background:linear-gradient(90deg,#7B2CF5,#2C89F5);box-shadow:0 0 10px #7B2CF5;transition:width .3s ease"></div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0 12px;">
            <span>矿车装载</span>
            <strong id="percent">0%</strong>
          </div>
          <div class="row" style="gap:8px;">
            <button id="start" class="btn btn-buy" style="flex:1;"><span data-ico="play"></span>开始挖矿</button>
            <button id="stop" class="btn btn-ghost" style="flex:1;"><span data-ico="stop"></span>停止</button>
            <button id="collect" class="btn btn-primary" style="flex:1;"><span data-ico="collect"></span>收矿</button>
          </div>
          <div class="row" style="gap:8px;margin-top:8px;">
            <button id="status" class="btn btn-ghost" style="flex:1;"><span data-ico="refresh"></span>刷新状态</button>
            <button id="repair" class="btn btn-sell" style="flex:1;"><span data-ico="wrench"></span>修理</button>
          </div>
          <div id="statusText" style="margin-top:6px;opacity:.9;min-height:20px;"></div>
        </div>
      </div>
    `);

    root.innerHTML = '';
    root.appendChild(nav);
    root.appendChild(bar.root);
    root.appendChild(view);

    this.view = view;
    // mount icons in header/buttons
    try {
      view.querySelectorAll('[data-ico]')
        .forEach((el) => {
          const name = (el as HTMLElement).getAttribute('data-ico') as any;
          try { el.appendChild(renderIcon(name, { size: 20 })); } catch {}
        });
    } catch {}
    this.upgradeMineCardUI();
    this.cacheElements();
    this.attachHandlers(bar.update.bind(bar));
    await bar.update();
    this.setupRealtime();
    await this.refreshStatus();
    this.updateProgress();
    this.updateControls();
  }

  private cacheElements() {
    if (!this.view) return;
    this.els.fill = qs(this.view, '#fill');
    this.els.percent = qs(this.view, '#percent');
    this.els.statusText = qs(this.view, '#statusText');
    this.els.ring = this.view.querySelector('#ring');
    this.els.ringPct = this.view.querySelector('#ringPct');
    this.els.cycle = this.view.querySelector('#cycle');
    this.els.statusTag = this.view.querySelector('#statusTag');
    this.els.events = this.view.querySelector('#events');
    this.els.start = qs<HTMLButtonElement>(this.view, '#start');
    this.els.stop = qs<HTMLButtonElement>(this.view, '#stop');
    this.els.collect = qs<HTMLButtonElement>(this.view, '#collect');
    this.els.repair = qs<HTMLButtonElement>(this.view, '#repair');
    this.els.statusBtn = qs<HTMLButtonElement>(this.view, '#status');
  }

  // Enhance UI: add radial meter and event feed dynamically
  private upgradeMineCardUI() {
    if (!this.view) return;
    const mineCard = this.view.querySelector('.mine');
    if (!mineCard) return;
    try {
      const block = html(`
        <div class="row" style="gap:12px;align-items:center;margin-bottom:8px;">
          <div class="ring" id="ring"><div class="label" id="ringPct">0%</div></div>
          <div style="display:flex;flex-direction:column;gap:6px;">
            <div class="pill" id="statusTag">待机</div>
            <div class="pill"><span data-ico="clock"></span>周期 <span id="cycle">3s</span></div>
          </div>
        </div>
      `);
      block.querySelectorAll('[data-ico]')
        .forEach((el) => {
          const name = (el as HTMLElement).getAttribute('data-ico') as any;
          try { el.appendChild(renderIcon(name, { size: 16 })); } catch {}
        });
      (mineCard as HTMLElement).insertBefore(block, (mineCard as HTMLElement).children[1] || null);
      const feed = html(`<div class="event-feed" id="events" style="margin-top:10px;"></div>`);
      (mineCard as HTMLElement).appendChild(feed);
    } catch {}
  }

  private attachHandlers(updateBar: () => Promise<void>) {
    if (!this.view) return;
    this.els.start?.addEventListener('click', () => this.handleStart());
    this.els.stop?.addEventListener('click', () => this.handleStop());
    this.els.statusBtn?.addEventListener('click', () => this.refreshStatus());
    this.els.repair?.addEventListener('click', () => this.handleRepair());
    this.els.collect?.addEventListener('click', () => this.handleCollect(updateBar));
  }

  private setupRealtime() {
    const token = (NetworkManager as any).I['token'];
    if (token) RealtimeClient.I.connect(token);

    if (this.mineUpdateHandler) RealtimeClient.I.off('mine.update', this.mineUpdateHandler);
    if (this.mineCollapseHandler) RealtimeClient.I.off('mine.collapse', this.mineCollapseHandler);
    if (this.plunderHandler) RealtimeClient.I.off('plunder.attacked', this.plunderHandler);

    this.mineUpdateHandler = (msg) => {
      this.cartAmt = typeof msg.cartAmount === 'number' ? msg.cartAmount : this.cartAmt;
      this.cartCap = typeof msg.cartCapacity === 'number' ? msg.cartCapacity : this.cartCap;
      this.isMining = msg.running ?? this.isMining;
      if (msg.collapsed && msg.collapsedRemaining) {
        this.beginCollapseCountdown(msg.collapsedRemaining);
      } else if (!msg.collapsed) {
        this.isCollapsed = false;
        this.clearCollapseTimer();
      }
      this.updateProgress();
      if (msg.type === 'critical' && msg.amount) {
        this.setStatusMessage(`触发暴击，矿车增加 ${msg.amount}！`);
        this.logEvent(`暴击 +${msg.amount}`);
      } else if (msg.type === 'normal' && msg.amount) {
        this.setStatusMessage(`矿车增加 ${msg.amount}，当前 ${this.formatPercent()}`);
        this.logEvent(`挖掘 +${msg.amount}`);
      } else if (msg.type === 'collapse') {
        this.setStatusMessage('矿道坍塌，请立即修理');
        this.logEvent('矿道坍塌');
      } else if (msg.type === 'collect') {
        this.setStatusMessage('矿石已收集，矿车清空');
        this.logEvent('收集完成');
      } else if (this.isCollapsed) {
        this.setStatusMessage(`矿道坍塌，剩余 ${this.collapseRemaining}s`);
      }
      this.updateControls();
    };

    this.mineCollapseHandler = (msg) => {
      const seconds = Number(msg?.repair_duration) || 0;
      if (seconds > 0) this.beginCollapseCountdown(seconds);
      showToast(`矿道坍塌，需修理（约 ${seconds}s）`, 'warn');
    };

    this.plunderHandler = (msg) => {
      showToast(`被掠夺：来自 ${msg.attacker}，损失 ${msg.loss}`, 'warn');
      this.logEvent(`被 ${msg.attacker} 掠夺 -${msg.loss}`);
    };

    RealtimeClient.I.on('mine.update', this.mineUpdateHandler);
    RealtimeClient.I.on('mine.collapse', this.mineCollapseHandler);
    RealtimeClient.I.on('plunder.attacked', this.plunderHandler);
  }

  private async handleStart() {
    if (this.pending || this.isCollapsed) {
      if (this.isCollapsed) showToast('矿道坍塌，请先修理', 'warn');
      return;
    }
    this.pending = 'start';
    this.updateControls();
    try {
      const status = await NetworkManager.I.request<MineStatus>('/mine/start', { method: 'POST' });
      this.applyStatus(status);
      this.setStatusMessage('矿机已启动');
      showToast('矿机已启动', 'success');
    } catch (e: any) {
      showToast(e?.message || '启动失败', 'error');
    } finally {
      this.pending = null;
      this.updateControls();
    }
  }

  private async handleStop() {
    if (this.pending) return;
    this.pending = 'stop';
    this.updateControls();
    try {
      const status = await NetworkManager.I.request<MineStatus>('/mine/stop', { method: 'POST' });
      this.applyStatus(status);
      this.setStatusMessage('矿机已停止');
      showToast('矿机已停止', 'success');
    } catch (e: any) {
      showToast(e?.message || '停止失败', 'error');
    } finally {
      this.pending = null;
      this.updateControls();
    }
  }

  private async handleCollect(updateBar: () => Promise<void>) {
    if (this.pending || this.cartAmt <= 0) return;
    this.pending = 'collect';
    this.updateControls();
    try {
      const res = await NetworkManager.I.request<{ collected: number; status: MineStatus }>('/mine/collect', { method: 'POST' });
      if (res.status) this.applyStatus(res.status);
      if (res.collected > 0) {
        const oreLabel = document.querySelector('#ore');
        if (oreLabel) spawnFloatText(oreLabel as Element, `+${res.collected}`, '#7B2CF5');
        showToast(`收集矿石 ${res.collected}`, 'success');
      } else {
        showToast('矿车为空，无矿石可收集', 'warn');
      }
      await updateBar();
    } catch (e: any) {
      showToast(e?.message || '收矿失败', 'error');
    } finally {
      this.pending = null;
      this.updateControls();
    }
  }

  private async handleRepair() {
    if (this.pending || !this.isCollapsed) return;
    this.pending = 'repair';
    this.updateControls();
    try {
      const status = await NetworkManager.I.request<MineStatus>('/mine/repair', { method: 'POST' });
      this.applyStatus(status);
      this.setStatusMessage('矿道已修复，可重新启动');
      showToast('矿道已修复', 'success');
    } catch (e: any) {
      showToast(e?.message || '修理失败', 'error');
    } finally {
      this.pending = null;
      this.updateControls();
    }
  }

  private async refreshStatus() {
    if (this.pending === 'status') return;
    this.pending = 'status';
    this.updateControls();
    try {
      const status = await NetworkManager.I.request<MineStatus>('/mine/status');
      this.applyStatus(status);
    } catch (e: any) {
      showToast(e?.message || '获取状态失败', 'error');
    } finally {
      this.pending = null;
      this.updateControls();
    }
  }

  private applyStatus(status: MineStatus | undefined, opts: { quiet?: boolean } = {}) {
    if (!status) return;
    this.cartAmt = status.cartAmount ?? this.cartAmt;
    this.cartCap = status.cartCapacity ?? this.cartCap;
    this.intervalMs = status.intervalMs ?? this.intervalMs;
    this.isMining = Boolean(status.running);
    this.isCollapsed = Boolean(status.collapsed);
    if (status.collapsed && status.collapsedRemaining > 0) {
      this.beginCollapseCountdown(status.collapsedRemaining);
    } else {
      this.clearCollapseTimer();
      this.collapseRemaining = 0;
    }
    this.updateProgress();
    if (!opts.quiet) {
      if (this.isCollapsed && this.collapseRemaining > 0) {
        this.setStatusMessage(`矿道坍塌，剩余 ${this.collapseRemaining}s`);
      } else if (this.isMining) {
        const seconds = Math.max(1, Math.round(this.intervalMs / 1000));
        this.setStatusMessage(`矿机运行中，周期约 ${seconds}s，当前 ${this.formatPercent()}`);
      } else {
        this.setStatusMessage('矿机已停止，点击开始挖矿');
      }
    }
    if (this.els.cycle) {
      const seconds = Math.max(1, Math.round(this.intervalMs / 1000));
      this.els.cycle.textContent = `${seconds}s`;
    }
    if (this.els.statusTag) {
      const el = this.els.statusTag as HTMLElement;
      el.innerHTML = '';
      const ico = this.isCollapsed ? 'close' : (this.isMining ? 'bolt' : 'clock');
      try { el.appendChild(renderIcon(ico as any, { size: 16 })); } catch {}
      el.appendChild(document.createTextNode(this.isCollapsed ? '坍塌' : (this.isMining ? '运行中' : '待机')));
    }
    this.updateControls();
  }

  private beginCollapseCountdown(seconds: number) {
    this.clearCollapseTimer();
    this.isCollapsed = true;
    this.collapseRemaining = Math.max(0, Math.floor(seconds));
    this.setStatusMessage(`矿道坍塌，剩余 ${this.collapseRemaining}s`);
    this.updateControls();
    this.collapseTimer = window.setInterval(() => {
      this.collapseRemaining = Math.max(0, this.collapseRemaining - 1);
      if (this.collapseRemaining <= 0) {
        this.clearCollapseTimer();
        this.isCollapsed = false;
        this.setStatusMessage('坍塌解除，可重新启动矿机');
        this.updateControls();
      } else {
        this.setStatusMessage(`矿道坍塌，剩余 ${this.collapseRemaining}s`);
      }
    }, 1000);
  }

  private clearCollapseTimer() {
    if (this.collapseTimer !== null) {
      window.clearInterval(this.collapseTimer);
      this.collapseTimer = null;
    }
  }

  private updateProgress() {
    if (!this.els.fill || !this.els.percent) return;
    const pct = this.cartCap > 0 ? Math.min(1, this.cartAmt / this.cartCap) : 0;
    this.els.fill.style.width = `${Math.round(pct * 100)}%`;
    this.els.percent.textContent = `${Math.round(pct * 100)}%`;
    if (this.els.ring) {
      const deg = Math.round(pct * 360);
      (this.els.ring as HTMLElement).style.background = `conic-gradient(#7B2CF5 ${deg}deg, rgba(255,255,255,.08) 0deg)`;
    }
    if (this.els.ringPct) this.els.ringPct.textContent = `${Math.round(pct * 100)}%`;
    if (this.pending !== 'collect' && this.els.collect) {
      this.els.collect.disabled = this.pending === 'collect' || this.cartAmt <= 0;
    }
  }

  private updateControls() {
    const isBusy = (key: PendingAction) => this.pending === key;
    const setBtn = (btn: HTMLButtonElement | null, icon: any, label: string, disabled: boolean) => {
      if (!btn) return;
      btn.disabled = disabled;
      // keep first child as icon if present, otherwise create
      let iconHost = btn.querySelector('.icon');
      if (!iconHost) {
        btn.insertBefore(renderIcon(icon, { size: 18 }), btn.firstChild);
      } else {
        // Replace existing icon with new one if icon name differs by re-rendering
        const host = document.createElement('span');
        host.appendChild(renderIcon(icon, { size: 18 }));
        // remove old icon wrapper and use new
        iconHost.parentElement?.replaceChild(host.firstChild as Node, iconHost);
      }
      // set label text (preserve icon)
      // remove existing text nodes
      Array.from(btn.childNodes).forEach((n, idx) => {
        if (idx > 0) btn.removeChild(n);
      });
      btn.appendChild(document.createTextNode(label));
    };

    setBtn(this.els.start, 'play', isBusy('start') ? '启动中…' : this.isMining ? '挖矿中' : '开始挖矿', isBusy('start') || this.isMining || this.isCollapsed);
    setBtn(this.els.stop, 'stop', isBusy('stop') ? '停止中…' : '停止', isBusy('stop') || !this.isMining);
    setBtn(this.els.collect, 'collect', isBusy('collect') ? '收集中…' : '收矿', isBusy('collect') || this.cartAmt <= 0);
    setBtn(this.els.repair, 'wrench', isBusy('repair') ? '修理中…' : '修理', isBusy('repair') || !this.isCollapsed);
    setBtn(this.els.statusBtn, 'refresh', isBusy('status') ? '刷新中…' : '刷新状态', isBusy('status'));
  }

  private setStatusMessage(text: string) {
    if (!this.els.statusText) return;
    this.els.statusText.textContent = text;
  }

  private logEvent(msg: string) {
    if (!this.els?.events) return;
    const line = document.createElement('div');
    line.className = 'event';
    const now = new Date();
    const hh = String(now.getHours()).padStart(2,'0');
    const mm = String(now.getMinutes()).padStart(2,'0');
    const ss = String(now.getSeconds()).padStart(2,'0');
    line.textContent = `[${hh}:${mm}:${ss}] ${msg}`;
    this.els.events.prepend(line);
  }

  private formatPercent() {
    const pct = this.cartCap > 0 ? Math.min(1, this.cartAmt / this.cartCap) : 0;
    return `${Math.round(pct * 100)}%`;
  }
}
    // mount icons
    try {
      view.querySelectorAll('[data-ico]')
        .forEach((el) => {
          const name = (el as HTMLElement).getAttribute('data-ico') as any;
          try { el.appendChild(renderIcon(name, { size: 20 })); } catch {}
        });
    } catch {}
