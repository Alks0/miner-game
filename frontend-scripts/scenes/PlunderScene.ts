import { NetworkManager } from '../core/NetworkManager';
import { html, qs } from '../utils/dom';
import { renderNav } from '../components/Nav';
import { RealtimeClient } from '../core/RealtimeClient';
import { showToast } from '../components/Toast';
import { renderResourceBar } from '../components/ResourceBar';
import { renderIcon } from '../components/Icon';

export class PlunderScene {
  private resultBox: HTMLElement | null = null;

  mount(root: HTMLElement) {
    root.innerHTML = '';
    root.appendChild(renderNav('plunder'));
    const bar = renderResourceBar();
    root.appendChild(bar.root);

    const view = html(`
      <div class="container grid-2" style="color:#fff;">
        <div class="card fade-in">
          <div class="row" style="justify-content:space-between;align-items:center;">
            <h3 style="margin:0;display:flex;align-items:center;gap:8px;"><span data-ico="sword"></span>掠夺目标</h3>
            <button id="refresh" class="btn btn-primary"><span data-ico="refresh"></span>刷新</button>
          </div>
          <div id="list" style="margin-top:12px;display:flex;flex-direction:column;gap:8px;"></div>
          <div id="result" style="margin-top:12px;opacity:.9;font-family:monospace;"></div>
        </div>
      </div>
    `);
    root.appendChild(view);

    const token = (NetworkManager as any).I['token'];
    if (token) RealtimeClient.I.connect(token);

    RealtimeClient.I.on('plunder.attacked', (msg) => {
      showToast(`被掠夺：来自 ${msg.attacker}，损失 ${msg.loss}`);
      this.log(`被 ${msg.attacker} 掠夺，损失 ${msg.loss}`);
    });
    this.resultBox = qs(view, '#result');

    const list = qs(view, '#list');
    const refreshBtn = qs<HTMLButtonElement>(view, '#refresh');
    const mountIcons = (rootEl: Element) => {
      rootEl.querySelectorAll('[data-ico]')
        .forEach((el) => {
          const name = (el as HTMLElement).getAttribute('data-ico') as any;
          try { el.appendChild(renderIcon(name, { size: 20 })); } catch {}
        });
    };
    mountIcons(view);

    const load = async () => {
      refreshBtn.disabled = true;
      refreshBtn.innerHTML = '<span data-ico="refresh"></span>刷新中…';
      mountIcons(refreshBtn);
      await bar.update();
      list.innerHTML = '';
      for (let i = 0; i < 3; i++) list.appendChild(html('<div class="skeleton"></div>'));
      try {
        const data = await NetworkManager.I.request<{ targets: any[] }>('/plunder/targets');
        list.innerHTML = '';
        if (!data.targets.length) {
          list.appendChild(html('<div style="opacity:.8;">暂无可掠夺的目标，稍后再试</div>'));
        }
        for (const target of data.targets) {
          const row = html(`
            <div class="list-item list-item--sell">
              <div style="display:flex;flex-direction:column;gap:2px;">
                <div style="display:flex;align-items:center;gap:6px;"><span data-ico="target"></span><strong>${target.username || target.id}</strong></div>
                <div style="opacity:.85;">矿石：${target.ore} <span class="pill">预计收益 5%~30%</span></div>
              </div>
              <div>
                <button class="btn btn-sell" data-id="${target.id}"><span data-ico="sword"></span>掠夺</button>
              </div>
            </div>
          `);
          mountIcons(row);
          row.addEventListener('click', async (ev) => {
            const el = ev.target as HTMLButtonElement;
            const id = el.getAttribute('data-id');
            if (!id) return;
            el.disabled = true;
            const original = el.textContent || '';
            el.textContent = '掠夺中…';
            try {
              const res = await NetworkManager.I.request<{ success: boolean; loot_amount: number }>(`/plunder/${id}`, { method: 'POST' });
              if (res.success) {
                this.log(`成功掠夺 ${id}，获得 ${res.loot_amount}`);
                showToast(`掠夺成功，获得 ${res.loot_amount} 矿石`, 'success');
                // 刷新列表
                await load();
              } else {
                this.log(`掠夺 ${id} 失败`);
                showToast('掠夺失败', 'warn');
              }
              await bar.update();
            } catch (e: any) {
              const message = e?.message || '掠夺失败';
              this.log(`掠夺失败：${message}`);
              if (message.includes('冷却')) {
                showToast(message, 'warn');
              } else {
                showToast(message, 'error');
              }
            } finally {
              el.textContent = original;
              el.disabled = false;
            }
          });
          list.appendChild(row);
        }
      } catch (e: any) {
        showToast(e?.message || '加载掠夺目标失败');
      } finally {
        refreshBtn.disabled = false;
        refreshBtn.innerHTML = '<span data-ico="refresh"></span>刷新';
        mountIcons(refreshBtn);
      }
    };

    refreshBtn.onclick = () => load();
    load();
  }

  private log(msg: string) {
    if (!this.resultBox) return;
    const line = document.createElement('div');
    line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    this.resultBox.prepend(line);
  }
}
