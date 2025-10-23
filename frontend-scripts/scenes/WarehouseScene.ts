import { NetworkManager } from '../core/NetworkManager';
import { html, qs } from '../utils/dom';
import { renderNav } from '../components/Nav';
import { RealtimeClient } from '../core/RealtimeClient';
import { renderResourceBar } from '../components/ResourceBar';
import { showToast } from '../components/Toast';

export class WarehouseScene {
  async mount(root: HTMLElement) {
    root.innerHTML = '';
    root.appendChild(renderNav('warehouse'));
    const bar = renderResourceBar();
    root.appendChild(bar.root);

    const view = html(`
      <div class="container" style="color:#fff;">
        <div class="card fade-in">
          <div class="row" style="justify-content:space-between;align-items:center;">
            <h3 style="margin:0;">仓库</h3>
            <button id="refresh" class="btn btn-primary">刷新</button>
          </div>
          <div style="margin-top:12px;">
            <details open>
              <summary>我的道具</summary>
              <div id="list" style="margin-top:8px;display:flex;flex-direction:column;gap:8px;"></div>
            </details>
            <details>
              <summary>道具模板</summary>
              <div id="tpls" style="margin-top:8px;display:flex;flex-direction:column;gap:8px;"></div>
            </details>
          </div>
        </div>
      </div>
    `);
    root.appendChild(view);

    const token = (NetworkManager as any).I['token'];
    if (token) RealtimeClient.I.connect(token);

    const list = qs(view, '#list');
    const tplContainer = qs(view, '#tpls');
    const refreshBtn = qs<HTMLButtonElement>(view, '#refresh');

    const load = async () => {
      refreshBtn.disabled = true;
      refreshBtn.textContent = '刷新中…';
      await bar.update();
      list.innerHTML = '';
      for (let i = 0; i < 3; i++) list.appendChild(html('<div class="skeleton"></div>'));
      try {
        const data = await NetworkManager.I.request<{ items: any[] }>('/items');
        list.innerHTML = '';
        if (!data.items.length) {
          list.appendChild(html('<div style="opacity:.8;">暂无道具，尝试多挖矿或掠夺以获取更多资源</div>'));
        }
        for (const item of data.items) {
          const row = html(`
            <div class="list-item ${item.isEquipped ? 'list-item--buy' : ''}">
              <div style="display:flex;flex-direction:column;gap:2px;">
                <div>
                  <strong>${item.templateId}</strong>
                  ${item.isEquipped ? '<span class="pill">已装备</span>' : ''}
                  ${item.isListed ? '<span class="pill">挂单中</span>' : ''}
                </div>
                <div style="opacity:.85;">等级 Lv.${item.level} · 实例 ${item.id}</div>
              </div>
              <div class="row" style="gap:6px;">
                <button class="btn btn-buy" data-act="equip" data-id="${item.id}" ${item.isEquipped ? 'disabled' : ''}>装备</button>
                <button class="btn btn-primary" data-act="upgrade" data-id="${item.id}">升级</button>
              </div>
            </div>
          `);
          row.addEventListener('click', async (ev) => {
            const target = ev.target as HTMLButtonElement;
            const id = target.getAttribute('data-id');
            const act = target.getAttribute('data-act');
            if (!id || !act) return;
            target.disabled = true;
            const original = target.textContent || '';
            target.textContent = act === 'equip' ? '装备中…' : '升级中…';
            try {
              if (act === 'equip') {
                await NetworkManager.I.request('/items/equip', { method: 'POST', body: JSON.stringify({ itemId: id }) });
                showToast('装备成功');
              } else {
                await NetworkManager.I.request('/items/upgrade', { method: 'POST', body: JSON.stringify({ itemId: id }) });
                showToast('升级成功');
              }
              await load();
            } catch (e: any) {
              showToast(e?.message || '操作失败');
            } finally {
              target.textContent = original;
              target.disabled = false;
            }
          });
          list.appendChild(row);
        }

        const tpls = await NetworkManager.I.request<{ templates: any[] }>('/items/templates');
        tplContainer.innerHTML = '';
        for (const tpl of tpls.templates) {
          const row = html(`<div class="list-item"><strong>${tpl.name || tpl.id}</strong> · ${tpl.category || '未知类型'}</div>`);
          tplContainer.appendChild(row);
        }
      } catch (e: any) {
        showToast(e?.message || '加载仓库失败');
      } finally {
        refreshBtn.disabled = false;
        refreshBtn.textContent = '刷新';
      }
    };

    refreshBtn.onclick = () => load();
    await load();
  }
}
