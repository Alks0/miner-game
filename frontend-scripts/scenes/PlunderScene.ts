import { NetworkManager } from '../core/NetworkManager';
import { html, qs } from '../utils/dom';
import { renderNav } from '../components/Nav';
import { RealtimeClient } from '../core/RealtimeClient';
import { showToast } from '../components/Toast';
import { renderResourceBar } from '../components/ResourceBar';
import { renderIcon } from '../components/Icon';
import { createSwordSlash } from '../components/AnimatedIcons';

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
          <div style="margin-top:12px;">
            <details>
              <summary style="color:#ff5c5c;"><span data-ico="target"></span>复仇列表</summary>
              <div id="revenge" style="margin-top:8px;display:flex;flex-direction:column;gap:8px;"></div>
            </details>
          </div>
          <div id="list" style="margin-top:12px;display:flex;flex-direction:column;gap:8px;"></div>
          <div id="result" style="margin-top:12px;opacity:.9;font-family:monospace;"></div>
        </div>
      </div>
    `);
    root.appendChild(view);

    const token = NetworkManager.I.getToken();
    if (token) RealtimeClient.I.connect(token);

    RealtimeClient.I.on('plunder.attacked', (msg) => {
      showToast(`被掠夺：来自 ${msg.attacker}，损失 ${msg.loss}`);
      this.log(`被 ${msg.attacker} 掠夺，损失 ${msg.loss}`);
    });
    this.resultBox = qs(view, '#result');

    const list = qs(view, '#list');
    const revengeList = qs(view, '#revenge');
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
      revengeList.innerHTML = '';
      for (let i = 0; i < 3; i++) list.appendChild(html('<div class="skeleton"></div>'));
      try {
        const [data, revengeData] = await Promise.all([
          NetworkManager.I.request<{ targets: any[] }>('/plunder/targets'),
          NetworkManager.I.request<{ revenges: any[] }>('/plunder/revenge-list').catch(() => ({ revenges: [] }))
        ]);
        
        // 渲染复仇列表
        revengeList.innerHTML = '';
        if (revengeData.revenges && revengeData.revenges.length > 0) {
          for (const target of revengeData.revenges) {
            const row = html(`
              <div class="list-item list-item--sell" style="border-color:#ff5c5c;">
                <div style="display:flex;flex-direction:column;gap:2px;">
                  <div style="display:flex;align-items:center;gap:6px;color:#ff5c5c;"><span data-ico="target"></span><strong>${target.username || target.id}</strong> 👹 仇人</div>
                  <div style="opacity:.85;">矿石：${target.ore} <span class="pill">复仇掠夺不受冷却限制</span></div>
                </div>
                <div>
                  <button class="btn btn-sell" data-id="${target.id}"><span data-ico="sword"></span>复仇</button>
                </div>
              </div>
            `);
            mountIcons(row);
            row.addEventListener('click', async (ev) => {
              const el = ev.target as HTMLButtonElement;
              const id = el.getAttribute('data-id');
              if (!id) return;
              const btn = el.closest('button') as HTMLButtonElement;
              if (!btn) return;
              
              btn.disabled = true;
              const originalHTML = btn.innerHTML;
              btn.innerHTML = '<span data-ico="sword"></span>复仇中…';
              mountIcons(btn);
              
              let shouldRefresh = false;
              try {
                const res = await NetworkManager.I.request<{ success: boolean; loot_amount: number }>(`/plunder/${id}`, { method: 'POST' });
                if (res.success) {
                  this.log(`复仇成功，获得 ${res.loot_amount}`);
                  showToast(`⚔️ 复仇成功！获得 ${res.loot_amount} 矿石`, 'success');
                  shouldRefresh = true;
                } else {
                  this.log(`复仇失败`);
                  showToast('复仇失败', 'warn');
                }
                await bar.update();
              } catch (e: any) {
                const message = e?.message || '复仇失败';
                this.log(`复仇失败：${message}`);
                showToast(message, 'error');
                btn.innerHTML = originalHTML;
                mountIcons(btn);
              } finally {
                btn.disabled = false;
                if (shouldRefresh) {
                  await load();
                }
              }
            });
            revengeList.appendChild(row);
          }
        } else {
          revengeList.innerHTML = '<div style="opacity:.8;text-align:center;padding:10px;">暂无可复仇的对象</div>';
        }
        
        list.innerHTML = '';
        if (!data.targets.length) {
          list.appendChild(html('<div style="opacity:.8;">暂无可掠夺的目标，稍后再试</div>'));
        }
        for (const target of data.targets) {
          const row = html(`
            <div class="list-item list-item--sell">
              <div style="display:flex;flex-direction:column;gap:2px;">
                <div style="display:flex;align-items:center;gap:6px;"><span data-ico="target"></span><strong>${target.username || target.id}</strong></div>
                <div style="opacity:.85;">矿石：${target.ore} <span class="pill">预计收益 5%~35%</span></div>
              </div>
              <div>
                <button class="btn btn-sell plunder-btn" data-id="${target.id}"><span class="icon-slot"></span>掠夺</button>
              </div>
            </div>
          `);
          mountIcons(row);
          
          // 添加剑气动画到掠夺按钮
          const plunderBtn = row.querySelector('.plunder-btn .icon-slot');
          if (plunderBtn) {
            plunderBtn.appendChild(createSwordSlash());
          }
          
          row.addEventListener('click', async (ev) => {
            const el = ev.target as HTMLButtonElement;
            const id = el.getAttribute('data-id');
            if (!id) return;
            const btn = el.closest('button') as HTMLButtonElement;
            if (!btn) return;
            
            btn.disabled = true;
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<span data-ico="sword"></span>掠夺中…';
            mountIcons(btn);
            
            let shouldRefresh = false;
            try {
              const res = await NetworkManager.I.request<{ success: boolean; loot_amount: number }>(`/plunder/${id}`, { method: 'POST' });
              if (res.success) {
                this.log(`成功掠夺 ${id}，获得 ${res.loot_amount}`);
                showToast(`掠夺成功，获得 ${res.loot_amount} 矿石`, 'success');
                shouldRefresh = true;
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
              // 失败时恢复按钮
              btn.innerHTML = originalHTML;
              mountIcons(btn);
            } finally {
              btn.disabled = false;
              // 成功后刷新列表（会替换按钮）
              if (shouldRefresh) {
                await load();
              }
            }
          });
          list.appendChild(row);
        }
      } catch (e: any) {
        showToast(e?.message || '加载掠夺目标失败', 'error');
        list.innerHTML = '<div style="opacity:.8;text-align:center;padding:20px;">加载失败，请稍后重试</div>';
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
