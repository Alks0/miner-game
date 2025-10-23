import { NetworkManager } from '../core/NetworkManager';
import { html, qs } from '../utils/dom';
import { renderNav } from '../components/Nav';

export class RankingScene {
  mount(root: HTMLElement) {
    root.innerHTML = '';
    root.appendChild(renderNav('ranking'));
    const view = html(`
      <div style="max-width:520px;margin:12px auto;color:#fff;">
        <div style="padding:12px;border-radius:16px;background:linear-gradient(135deg, rgba(123,44,245,.25), rgba(44,137,245,.25));backdrop-filter:blur(10px);box-shadow:0 8px 20px rgba(0,0,0,.35),0 0 12px rgba(123,44,245,.7);">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <h3 style="margin:0">排行榜</h3>
            <button id="refresh" style="padding:8px 12px;border-radius:10px;color:#fff;background:linear-gradient(135deg,#7B2CF5,#2C89F5);border:0;">刷新</button>
          </div>
          <div id="me" style="margin-top:8px;opacity:.95"></div>
          <div id="list" style="margin-top:8px;display:flex;flex-direction:column;gap:6px;"></div>
        </div>
      </div>
    `);
    root.appendChild(view);

    const load = async () => {
      const me = await NetworkManager.I.request<{ rank:number; score:number }>(`/ranking/me`);
      const top = await NetworkManager.I.request<{ list:any[] }>(`/ranking/top?n=20`);
      qs(view, '#me').textContent = `我的名次：${me.rank}  得分：${me.score}`;
      const list = qs(view, '#list');
      list.innerHTML = '';
      for (const r of top.list) {
        const row = html(`<div style="display:flex;justify-content:space-between;background:rgba(255,255,255,.06);border-radius:10px;padding:8px;">
          <span>#${r.rank}</span><span>${r.userId}</span><strong>${r.score}</strong>
        </div>`);
        list.appendChild(row);
      }
    };
    qs<HTMLButtonElement>(view, '#refresh').onclick = load;
    load();
  }
}

