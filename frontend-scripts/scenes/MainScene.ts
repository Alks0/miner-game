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
    hologram: null as HTMLElement | null,
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
      <section class="main-screen">
        <div class="main-ambient" aria-hidden="true">
          <span class="ambient orb orb-a"></span>
          <span class="ambient orb orb-b"></span>
          <span class="ambient grid"></span>
        </div>
        <div class="container main-stack" style="color:#fff;">
          <section class="mine card mine-card fade-in">
            <header class="mine-header">
              <div class="mine-title">
                <span class="title-icon" data-ico="pick"></span>
                <span class="title-label">挖矿面板</span>
              </div>
              <div class="mine-chips">
                <span class="pill" id="statusTag">待机</span>
                <span class="pill pill-cycle"><span data-ico="clock"></span>周期 <span id="cycle">3s</span></span>
              </div>
            </header>
            <div class="mine-grid">
              <div class="mine-gauge">
                <div class="ring" id="ring">
                  <div class="ring-core">
                    <span id="ringPct">0%</span>
                    <small>装载率</small>
                  </div>
                </div>
                <div class="ring-glow ring-glow-a"></div>
                <div class="ring-glow ring-glow-b"></div>
              </div>
              <div class="mine-progress">
                <div class="mine-progress-meta">
                  <span>矿车装载</span>
                  <strong id="percent">0%</strong>
                </div>
                <div class="mine-progress-track">
                  <div class="mine-progress-fill" id="fill"></div>
                </div>
                <div id="statusText" class="mine-status"></div>
              </div>
            </div>
            <div class="mine-actions-grid">
              <button id="start" class="btn btn-buy span-2"><span data-ico="play"></span>开始挖矿</button>
              <button id="stop" class="btn btn-ghost"><span data-ico="stop"></span>停止</button>
              <button id="collect" class="btn btn-primary"><span data-ico="collect"></span>收矿</button>
              <button id="status" class="btn btn-ghost"><span data-ico="refresh"></span>刷新状态</button>
              <button id="repair" class="btn btn-sell"><span data-ico="wrench"></span>修理</button>
            </div>
            <div class="mine-feed">
              <div class="event-feed" id="events"></div>
            </div>
            <div class="mine-hologram" id="hologram" aria-hidden="true">
              <span class="mine-holo-grid"></span>
              <span class="mine-holo-grid diagonal"></span>
              <span class="mine-holo-glow"></span>
            </div>
          </section>
        </div>
      </section>
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
    this.els.hologram = this.view.querySelector('#hologram');
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
    const token = NetworkManager.I.getToken();
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
        // 创建抛物线飞行动画
        this.createFlyingOreAnimation(res.collected);
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

  private createFlyingOreAnimation(amount: number) {
    const fillEl = this.els.fill;
    const oreEl = document.querySelector('#ore');
    if (!fillEl || !oreEl) return;

    const startRect = fillEl.getBoundingClientRect();
    const endRect = oreEl.getBoundingClientRect();

    // 创建多个矿石粒子
    const particleCount = Math.min(8, Math.max(3, Math.floor(amount / 20)));
    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.className = 'ore-particle';
        particle.textContent = '💎';
        particle.style.cssText = `
          position: fixed;
          left: ${startRect.left + startRect.width / 2}px;
          top: ${startRect.top + startRect.height / 2}px;
          font-size: 24px;
          pointer-events: none;
          z-index: 9999;
          filter: drop-shadow(0 0 8px rgba(123,44,245,0.8));
        `;
        document.body.appendChild(particle);

        const dx = endRect.left + endRect.width / 2 - startRect.left - startRect.width / 2;
        const dy = endRect.top + endRect.height / 2 - startRect.top - startRect.height / 2;
        const randomOffset = (Math.random() - 0.5) * 100;

        particle.animate([
          { 
            transform: 'translate(0, 0) scale(1)', 
            opacity: 1 
          },
          { 
            transform: `translate(${dx/2 + randomOffset}px, ${dy - 150}px) scale(1.2)`, 
            opacity: 1,
            offset: 0.5
          },
          { 
            transform: `translate(${dx}px, ${dy}px) scale(0.5)`, 
            opacity: 0 
          }
        ], {
          duration: 1000 + i * 50,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => {
          particle.remove();
          // 最后一个粒子到达时，添加脉冲效果
          if (i === particleCount - 1) {
            oreEl.classList.add('flash');
            setTimeout(() => oreEl.classList.remove('flash'), 900);
          }
        };
      }, i * 80);
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
      
      // 移除所有状态类
      el.classList.remove('pill-running', 'pill-collapsed');
      
      const ico = this.isCollapsed ? 'close' : (this.isMining ? 'bolt' : 'clock');
      try { el.appendChild(renderIcon(ico as any, { size: 16 })); } catch {}
      el.appendChild(document.createTextNode(this.isCollapsed ? '坍塌' : (this.isMining ? '运行中' : '待机')));
      
      // 添加对应的动态样式类
      if (this.isCollapsed) {
        el.classList.add('pill-collapsed');
      } else if (this.isMining) {
        el.classList.add('pill-running');
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

  private lastMilestone = 0;

  private updateProgress() {
    if (!this.els.fill || !this.els.percent) return;
    const pct = this.cartCap > 0 ? Math.min(1, this.cartAmt / this.cartCap) : 0;
    const pctInt = Math.round(pct * 100);
    
    this.els.fill.style.width = `${pctInt}%`;
    this.els.percent.textContent = `${pctInt}%`;
    
    // 圆环颜色渐变：紫色 -> 蓝色 -> 金色
    let ringColor = '#7B2CF5'; // 紫色
    if (pct >= 0.75) {
      ringColor = '#f6c445'; // 金色
    } else if (pct >= 0.5) {
      ringColor = '#2C89F5'; // 蓝色
    }
    
    if (this.els.ring) {
      const deg = Math.round(pct * 360);
      (this.els.ring as HTMLElement).style.background = `conic-gradient(${ringColor} ${deg}deg, rgba(255,255,255,.08) 0deg)`;
      
      // 满载时持续闪耀
      if (pct >= 1) {
        this.els.ring.classList.add('ring-full');
      } else {
        this.els.ring.classList.remove('ring-full');
      }
    }
    
    if (this.els.ringPct) this.els.ringPct.textContent = `${pctInt}%`;
    
    // 里程碑脉冲特效
    const milestones = [25, 50, 75, 100];
    for (const milestone of milestones) {
      if (pctInt >= milestone && this.lastMilestone < milestone) {
        this.triggerMilestonePulse(milestone);
        this.lastMilestone = milestone;
      }
    }
    
    // 当装载率下降（收矿后）重置里程碑
    if (pctInt < this.lastMilestone - 10) {
      this.lastMilestone = Math.floor(pctInt / 25) * 25;
    }
    
    // 90%警告提示
    if (pctInt >= 90 && pctInt < 100) {
      if (!this.els.statusText?.textContent?.includes('即将满载')) {
        this.setStatusMessage('⚠️ 矿车即将满载，建议收矿');
      }
    }
    
    if (this.pending !== 'collect' && this.els.collect) {
      this.els.collect.disabled = this.pending === 'collect' || this.cartAmt <= 0;
      
      // 可收矿时添加能量特效
      if (this.cartAmt > 0 && !this.els.collect.disabled) {
        this.els.collect.classList.add('btn-energy');
      } else {
        this.els.collect.classList.remove('btn-energy');
      }
    }
    
    // 更新矿石数量
    this.updateShards(pct);
    
    // 更新全息背景状态
    this.updateHologramState();
  }

  private triggerMilestonePulse(milestone: number) {
    if (this.els.ring) {
      this.els.ring.classList.add('milestone-pulse');
      setTimeout(() => this.els.ring?.classList.remove('milestone-pulse'), 1000);
    }
    
    if (this.els.ringPct) {
      this.els.ringPct.classList.add('flash');
      setTimeout(() => this.els.ringPct?.classList.remove('flash'), 900);
    }
    
    // 显示里程碑消息
    showToast(`🎯 达成 ${milestone}% 装载率！`, 'success');
  }

  private updateHologramState() {
    if (!this.els.hologram) return;
    
    // 移除所有状态类
    this.els.hologram.classList.remove('holo-idle', 'holo-mining', 'holo-collapsed');
    
    // 根据状态添加对应的类
    if (this.isCollapsed) {
      this.els.hologram.classList.add('holo-collapsed');
    } else if (this.isMining) {
      this.els.hologram.classList.add('holo-mining');
    } else {
      this.els.hologram.classList.add('holo-idle');
    }
  }

  private updateShards(loadPercent: number) {
    if (!this.els.hologram) return;
    
    // 计算应该显示的矿石数量（装载率越高，矿石越多）
    // 0-20%: 2个, 20-40%: 4个, 40-60%: 6个, 60-80%: 8个, 80-100%: 10个
    const targetCount = Math.max(2, Math.min(12, Math.floor(loadPercent * 12) + 2));
    
    // 获取当前矿石元素
    const currentShards = this.els.hologram.querySelectorAll('.mine-shard');
    const currentCount = currentShards.length;
    
    // 如果数量相同，不做处理
    if (currentCount === targetCount) return;
    
    // 需要添加矿石
    if (currentCount < targetCount) {
      const toAdd = targetCount - currentCount;
      for (let i = 0; i < toAdd; i++) {
        const shard = document.createElement('span');
        shard.className = 'mine-shard';
        
        // 随机位置和大小
        const positions = [
          { top: '18%', left: '16%', delay: -1.4, scale: 1 },
          { bottom: '16%', right: '22%', delay: -3.2, scale: 0.74 },
          { top: '26%', right: '34%', delay: -5.1, scale: 0.5 },
          { top: '40%', left: '28%', delay: -2.5, scale: 0.85 },
          { bottom: '30%', left: '18%', delay: -4.1, scale: 0.68 },
          { top: '15%', right: '15%', delay: -1.8, scale: 0.92 },
          { bottom: '22%', right: '40%', delay: -3.8, scale: 0.78 },
          { top: '50%', left: '12%', delay: -2.2, scale: 0.6 },
          { top: '35%', right: '20%', delay: -4.5, scale: 0.88 },
          { bottom: '40%', left: '35%', delay: -3.5, scale: 0.7 },
          { top: '60%', right: '28%', delay: -2.8, scale: 0.65 },
          { bottom: '50%', right: '12%', delay: -4.8, scale: 0.82 },
        ];
        
        const posIndex = (currentCount + i) % positions.length;
        const pos = positions[posIndex];
        
        if (pos.top) shard.style.top = pos.top;
        if (pos.bottom) shard.style.bottom = pos.bottom;
        if (pos.left) shard.style.left = pos.left;
        if (pos.right) shard.style.right = pos.right;
        shard.style.animationDelay = `${pos.delay}s`;
        shard.style.transform = `scale(${pos.scale})`;
        
        // 添加淡入动画
        shard.style.opacity = '0';
        this.els.hologram.appendChild(shard);
        
        // 触发淡入
        setTimeout(() => {
          shard.style.transition = 'opacity 0.5s ease';
          shard.style.opacity = '0.26';
        }, 50);
      }
    }
    // 需要移除矿石
    else if (currentCount > targetCount) {
      const toRemove = currentCount - targetCount;
      for (let i = 0; i < toRemove; i++) {
        const lastShard = currentShards[currentShards.length - 1 - i];
        if (lastShard) {
          (lastShard as HTMLElement).style.transition = 'opacity 0.5s ease';
          (lastShard as HTMLElement).style.opacity = '0';
          setTimeout(() => {
            lastShard.remove();
          }, 500);
        }
      }
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
    const now = new Date();
    const hh = String(now.getHours()).padStart(2,'0');
    const mm = String(now.getMinutes()).padStart(2,'0');
    const ss = String(now.getSeconds()).padStart(2,'0');
    
    // 根据消息类型添加不同的样式类
    let eventClass = 'event';
    if (msg.includes('暴击')) {
      eventClass += ' event-critical';
    } else if (msg.includes('坍塌') || msg.includes('掠夺')) {
      eventClass += ' event-warning';
    } else if (msg.includes('收集') || msg.includes('成功')) {
      eventClass += ' event-success';
    } else {
      eventClass += ' event-normal';
    }
    
    line.className = eventClass;
    line.textContent = `[${hh}:${mm}:${ss}] ${msg}`;
    
    // 添加滑入动画
    line.style.opacity = '0';
    line.style.transform = 'translateX(20px)';
    this.els.events.prepend(line);
    
    // 触发动画
    setTimeout(() => {
      line.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      line.style.opacity = '0.9';
      line.style.transform = 'translateX(0)';
    }, 10);
    
    // 暴击事件添加闪光效果
    if (msg.includes('暴击')) {
      line.classList.add('flash');
      // 触发全局暴击特效
      this.triggerCriticalEffect();
    }
  }

  private triggerCriticalEffect() {
    // 圆环闪电效果
    if (this.els.ring) {
      this.els.ring.classList.add('ring-pulse');
      setTimeout(() => this.els.ring?.classList.remove('ring-pulse'), 600);
    }
    
    // 全息背景闪烁
    if (this.els.hologram) {
      this.els.hologram.classList.add('critical-flash');
      setTimeout(() => this.els.hologram?.classList.remove('critical-flash'), 400);
    }
  }

  private formatPercent() {
    const pct = this.cartCap > 0 ? Math.min(1, this.cartAmt / this.cartCap) : 0;
    return `${Math.round(pct * 100)}%`;
  }
}