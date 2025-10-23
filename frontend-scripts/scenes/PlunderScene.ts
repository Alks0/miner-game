import { NetworkManager } from '../core/NetworkManager';
import { html, qs } from '../utils/dom';
import { renderNav } from '../components/Nav';

export class PlunderScene {
  private resultBox: HTMLElement | null = null;

  mount(root: HTMLElement) {
    root.innerHTML = '';
    root.appendChild(renderNav('plunder'));
    const view = html(`
      <div style="max-width:520px;margin:12px auto;color:#fff;">
        <div style="padding:12px;border-radius:16px;background:linear-gradient(135deg, rgba(123,44,245,.25), rgba(44,137,245,.25));backdrop-filter:blur(10px);box-shadow:0 8px 20px rgba(0,0,0,.35),0 0 12px rgba(123,44,245,.7);">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <h3 style="margin:0">掠夺目标</h3>
            <button id="refresh" style="padding:8px 12px;border-radius:10px;color:#fff;background:linear-gradient(135deg,#7B2CF5,#2C89F5);border:0;">刷新</button>
          </div>
          <div id="list" style="margin-top:8px;display:flex;flex-direction:column;gap:8px;"></div>
          <div id="result" style="margin-top:12px;opacity:.9;font-family:monospace;"></div>
        </div>
      </div>
    `);
    root.appendChild(view);
    this.resultBox = qs(view, '#result');

    const load = async () => {
      const data = await NetworkManager.I.request<{ targets: any[] }>('/plunder/targets');
      const list = qs(view, '#list');
      list.innerHTML = '';
      for (const t of data.targets) {
        const row = html(`
          <div style="display:flex;gap:8px;align-items:center;justify-content:space-between;background:rgba(255,255,255,.06);border-radius:12px;padding:10px;">
            <div style="display:flex;flex-direction:column;gap:2px;">
              <div><strong>${t.username || t.id}</strong></div>
              <div style="opacity:.85">矿石：${t.ore}</div>
            </div>
            <div>
              <button data-id="${t.id}" style="padding:6px 10px;border-radius:8px;border:0;color:#fff;background:#E36414;">掠夺</button>
            </div>
          </div>
        `);
        row.addEventListener('click', async (ev) => {
          const el = ev.target as HTMLElement;
          const id = el.getAttribute('data-id');
          if (!id) return;
          try {
            const r = await NetworkManager.I.request<{ success:boolean; loot_amount:number }>(`/plunder/${id}`, { method:'POST' });
            this.log(`掠夺成功，获得 ${r.loot_amount}`);
          } catch (e:any) {
            this.log(`掠夺失败：${e.message}`);
          }
        });
        list.appendChild(row);
      }
    };
    qs<HTMLButtonElement>(view, '#refresh').onclick = load;
    load();
  }

  private log(msg: string) {
    if (!this.resultBox) return;
    const line = document.createElement('div');
    line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    this.resultBox.prepend(line);
  }
}

