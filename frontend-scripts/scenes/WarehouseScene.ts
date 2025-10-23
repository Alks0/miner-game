import { NetworkManager } from '../core/NetworkManager';
import { html, qs } from '../utils/dom';
import { renderNav } from '../components/Nav';

export class WarehouseScene {
  mount(root: HTMLElement) {
    root.innerHTML = '';
    root.appendChild(renderNav('warehouse'));
    const view = html(`
      <div style="max-width:520px;margin:12px auto;color:#fff;">
        <div style="padding:12px;border-radius:16px;background:linear-gradient(135deg, rgba(123,44,245,.25), rgba(44,137,245,.25));backdrop-filter:blur(10px);box-shadow:0 8px 20px rgba(0,0,0,.35),0 0 12px rgba(123,44,245,.7);">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <h3 style="margin:0">仓库</h3>
            <button id="refresh" style="padding:8px 12px;border-radius:10px;color:#fff;background:linear-gradient(135deg,#7B2CF5,#2C89F5);border:0;">刷新</button>
          </div>
          <div id="list" style="margin-top:8px;display:flex;flex-direction:column;gap:8px;"></div>
        </div>
      </div>
    `);
    root.appendChild(view);
    const load = async () => {
      const data = await NetworkManager.I.request<{ items: any[] }>('/items');
      const list = qs(view, '#list');
      list.innerHTML = '';
      for (const it of data.items) {
        const row = html(`
          <div style="display:flex;gap:8px;align-items:center;justify-content:space-between;background:rgba(255,255,255,.06);border-radius:12px;padding:10px;">
            <div style="display:flex;flex-direction:column;gap:2px;">
              <div><strong>${it.templateId}</strong></div>
              <div style="opacity:.85">Lv.${it.level} ${it.isEquipped? '· 已装备' : ''} ${it.isListed? '· 挂单中' : ''}</div>
            </div>
            <div style="display:flex;gap:6px;">
              <button data-act="equip" data-id="${it.id}" style="padding:6px 10px;border-radius:8px;border:0;color:#fff;background:#2C89F5;">装备</button>
              <button data-act="upgrade" data-id="${it.id}" style="padding:6px 10px;border-radius:8px;border:0;color:#fff;background:#7B2CF5;">升级</button>
            </div>
          </div>
        `);
        row.addEventListener('click', async (ev) => {
          const t = ev.target as HTMLElement;
          const id = t.getAttribute('data-id');
          const act = t.getAttribute('data-act');
          if (!id || !act) return;
          if (act === 'equip') {
            await NetworkManager.I.request('/items/equip', { method:'POST', body: JSON.stringify({ itemId: id }) });
          } else if (act === 'upgrade') {
            await NetworkManager.I.request('/items/upgrade', { method:'POST', body: JSON.stringify({ itemId: id }) });
          }
          await load();
        });
        list.appendChild(row);
      }
    };
    qs<HTMLButtonElement>(view, '#refresh').onclick = load;
    load();
  }
}

