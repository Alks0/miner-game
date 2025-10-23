import { NetworkManager } from '../core/NetworkManager';
import { RealtimeClient } from '../core/RealtimeClient';
import { html, qs } from '../utils/dom';
import { renderNav } from '../components/Nav';
import { renderResourceBar } from '../components/ResourceBar';
import { showToast } from '../components/Toast';
import { spawnFloatText } from '../components/FloatText';

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
      <div class="container" style="color:#fff;">
        <div class="mine card fade-in">
          <div style="opacity:.9;margin-bottom:8px;">⛏️ 挖矿面板</div>
          <div style="height:10px;border-radius:999px;background:rgba(255,255,255,.12);overflow:hidden;">
            <div id="fill" style="height:100%;width:0%;background:linear-gradient(90deg,#7B2CF5,#2C89F5);box-shadow:0 0 10px #7B2CF5;transition:width .3s ease"></div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0 12px;">
            <span>矿车装载</span>
            <strong id="percent">0%</strong>
          </div>
          <div class="row" style="gap:8px;">
            <button id="start" class="btn btn-buy" style="flex:1;">开始挖矿</button>
            <button id="stop" class="btn btn-ghost" style="flex:1;">停止</button>
            <button id="collect" class="btn btn-primary" style="flex:1;">收矿</button>
          </div>
          <div class="row" style="gap:8px;margin-top:8px;">
            <button id="status" class="btn btn-ghost" style="flex:1;">刷新状态</button>
            <button id="repair" class="btn btn-sell" style="flex:1;">修理</button>
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
    this.els.start = qs<HTMLButtonElement>(this.view, '#start');
    this.els.stop = qs<HTMLButtonElement>(this.view, '#stop');
    this.els.collect = qs<HTMLButtonElement>(this.view, '#collect');
    this.els.repair = qs<HTMLButtonElement>(this.view, '#repair');
    this.els.statusBtn = qs<HTMLButtonElement>(this.view, '#status');
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
      } else if (msg.type === 'normal' && msg.amount) {
        this.setStatusMessage(`矿车增加 ${msg.amount}，当前 ${this.formatPercent()}`);
      } else if (msg.type === 'collapse') {
        this.setStatusMessage('矿道坍塌，请立即修理');
      } else if (msg.type === 'collect') {
        this.setStatusMessage('矿石已收集，矿车清空');
      } else if (this.isCollapsed) {
        this.setStatusMessage(`矿道坍塌，剩余 ${this.collapseRemaining}s`);
      }
      this.updateControls();
    };

    this.mineCollapseHandler = (msg) => {
      const seconds = Number(msg?.repair_duration) || 0;
      if (seconds > 0) this.beginCollapseCountdown(seconds);
      showToast(`矿道坍塌，需修理（约 ${seconds}s）`);
    };

    this.plunderHandler = (msg) => {
      showToast(`被掠夺：来自 ${msg.attacker}，损失 ${msg.loss}`);
    };

    RealtimeClient.I.on('mine.update', this.mineUpdateHandler);
    RealtimeClient.I.on('mine.collapse', this.mineCollapseHandler);
    RealtimeClient.I.on('plunder.attacked', this.plunderHandler);
  }

  private async handleStart() {
    if (this.pending || this.isCollapsed) {
      if (this.isCollapsed) showToast('矿道坍塌，请先修理');
      return;
    }
    this.pending = 'start';
    this.updateControls();
    try {
      const status = await NetworkManager.I.request<MineStatus>('/mine/start', { method: 'POST' });
      this.applyStatus(status);
      this.setStatusMessage('矿机已启动');
    } catch (e: any) {
      showToast(e?.message || '启动失败');
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
    } catch (e: any) {
      showToast(e?.message || '停止失败');
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
        showToast(`收集矿石 ${res.collected}`);
      } else {
        showToast('矿车为空，无矿石可收集');
      }
      await updateBar();
    } catch (e: any) {
      showToast(e?.message || '收矿失败');
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
    } catch (e: any) {
      showToast(e?.message || '修理失败');
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
      showToast(e?.message || '获取状态失败');
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
    if (this.pending !== 'collect' && this.els.collect) {
      this.els.collect.disabled = this.pending === 'collect' || this.cartAmt <= 0;
    }
  }

  private updateControls() {
    const isBusy = (key: PendingAction) => this.pending === key;
    if (this.els.start) {
      const busy = isBusy('start');
      this.els.start.disabled = busy || this.isMining || this.isCollapsed;
      this.els.start.textContent = busy ? '启动中…' : this.isMining ? '挖矿中' : '开始挖矿';
    }
    if (this.els.stop) {
      const busy = isBusy('stop');
      this.els.stop.disabled = busy || !this.isMining;
      this.els.stop.textContent = busy ? '停止中…' : '停止';
    }
    if (this.els.collect) {
      const busy = isBusy('collect');
      this.els.collect.disabled = busy || this.cartAmt <= 0;
      this.els.collect.textContent = busy ? '收集中…' : '收矿';
    }
    if (this.els.repair) {
      const busy = isBusy('repair');
      this.els.repair.disabled = busy || !this.isCollapsed;
      this.els.repair.textContent = busy ? '修理中…' : '修理';
    }
    if (this.els.statusBtn) {
      this.els.statusBtn.disabled = isBusy('status');
      this.els.statusBtn.textContent = isBusy('status') ? '刷新中…' : '刷新状态';
    }
  }

  private setStatusMessage(text: string) {
    if (!this.els.statusText) return;
    this.els.statusText.textContent = text;
  }

  private formatPercent() {
    const pct = this.cartCap > 0 ? Math.min(1, this.cartAmt / this.cartCap) : 0;
    return `${Math.round(pct * 100)}%`;
  }
}
