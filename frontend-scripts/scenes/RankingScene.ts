import { NetworkManager } from '../core/NetworkManager';
import { html, qs } from '../utils/dom';
import { renderNav } from '../components/Nav';
import { RealtimeClient } from '../core/RealtimeClient';
import { renderResourceBar } from '../components/ResourceBar';
import { renderIcon } from '../components/Icon';
import { createTrophyAnimation } from '../components/AnimatedIcons';

export class RankingScene {
  mount(root: HTMLElement) {
    root.innerHTML = '';
    root.appendChild(renderNav('ranking'));
    const bar = renderResourceBar();
    root.appendChild(bar.root);

    const view = html(`
      <div class="container grid-2" style="color:#fff;">
        <div class="card fade-in">
          <div class="row" style="justify-content:space-between;align-items:center;">
            <h3 style="margin:0;display:flex;align-items:center;gap:8px;"><span data-ico="trophy"></span>排行榜</h3>
            <button id="refresh" class="btn btn-primary"><span data-ico="refresh"></span>刷新</button>
          </div>
          <div id="me" style="margin-top:8px;opacity:.95;"></div>
          <div id="list" style="margin-top:12px;display:flex;flex-direction:column;gap:6px;"></div>
        </div>
      </div>
    `);
    root.appendChild(view);

    const token = NetworkManager.I.getToken();
    if (token) RealtimeClient.I.connect(token);

    const meBox = qs(view, '#me');
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
        const me = await NetworkManager.I.request<{ rank: number; score: number }>('/ranking/me');
        const top = await NetworkManager.I.request<{ list: any[] }>('/ranking/top?n=20');
        meBox.textContent = `我的名次：#${me.rank} · 总得分：${me.score}`;
        list.innerHTML = '';
        for (const entry of top.list) {
          const medal = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : '';
          const cls = entry.rank <= 3 ? ' list-item--buy' : '';
          const row = html(`
            <div class="list-item${cls}">
              <span style="display:flex;align-items:center;gap:8px;">
                <span id="trophy${entry.rank}"></span>
                ${medal} #${entry.rank}
              </span>
              <span style="flex:1;opacity:.9;margin-left:12px;display:flex;align-items:center;gap:6px;"><span data-ico="user"></span>${entry.userId}</span>
              <strong>${entry.score}</strong>
            </div>
          `);
          mountIcons(row);
          
          // 为前3名添加奖杯动画
          if (entry.rank <= 3) {
            const trophySlot = row.querySelector(`#trophy${entry.rank}`);
            if (trophySlot) {
              trophySlot.appendChild(createTrophyAnimation(entry.rank));
            }
          }
          
          list.appendChild(row);
        }
      } catch (e: any) {
        meBox.textContent = e?.message || '排行榜加载失败';
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
}
