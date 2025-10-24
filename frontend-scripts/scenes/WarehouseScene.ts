import { NetworkManager } from '../core/NetworkManager';
import { html, qs } from '../utils/dom';
import { renderNav } from '../components/Nav';
import { RealtimeClient } from '../core/RealtimeClient';
import { renderResourceBar } from '../components/ResourceBar';
import { showToast } from '../components/Toast';
import { renderIcon } from '../components/Icon';

export class WarehouseScene {
  async mount(root: HTMLElement) {
    root.innerHTML = '';
    root.appendChild(renderNav('warehouse'));
    const bar = renderResourceBar();
    root.appendChild(bar.root);

    const view = html(`
      <div class="container grid-2" style="color:#fff;">
        <div class="card fade-in">
          <div class="row" style="justify-content:space-between;align-items:center;">
            <h3 style="margin:0;display:flex;align-items:center;gap:8px;"><span data-ico="warehouse"></span>仓库</h3>
            <button id="refresh" class="btn btn-primary"><span data-ico="refresh"></span>刷新</button>
          </div>
          <div style="margin-top:12px;">
            <details open>
              <summary><span data-ico="box"></span>我的道具</summary>
              <div id="list" style="margin-top:8px;display:flex;flex-direction:column;gap:8px;"></div>
            </details>
            <details>
              <summary><span data-ico="list"></span>道具模板</summary>
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

    const mountIcons = (rootEl: Element) => {
      rootEl.querySelectorAll('[data-ico]')
        .forEach((el) => {
          const name = (el as HTMLElement).getAttribute('data-ico') as any;
          try { el.appendChild(renderIcon(name, { size: 20 })); } catch {}
        });
    };
    mountIcons(view);

    const getRarity = (item: any, tpl?: any): { key: 'common'|'rare'|'epic'|'legendary'; text: string } => {
      const r = (tpl && (tpl.rarity || tpl.tier)) || item.rarity;
      const level = Number(item.level) || 0;
      if (typeof r === 'string') {
        const k = r.toLowerCase();
        if (['legendary','epic','rare','common'].includes(k)) {
          return { key: k as any, text: k === 'legendary' ? '传说' : k === 'epic' ? '史诗' : k === 'rare' ? '稀有' : '普通' };
        }
      }
      if (level >= 12) return { key: 'legendary', text: '传说' };
      if (level >= 8) return { key: 'epic', text: '史诗' };
      if (level >= 4) return { key: 'rare', text: '稀有' };
      return { key: 'common', text: '普通' };
    };

    const formatTime = (ts: number) => {
      try { return new Date(ts).toLocaleString(); } catch { return '' + ts; }
    };

    const load = async () => {
      refreshBtn.disabled = true;
      refreshBtn.innerHTML = '<span data-ico="refresh"></span>刷新中…';
      mountIcons(refreshBtn);
      await bar.update();
      list.innerHTML = '';
      for (let i = 0; i < 3; i++) list.appendChild(html('<div class="skeleton"></div>'));
      try {
        const [data, tpls] = await Promise.all([
          NetworkManager.I.request<{ items: any[] }>('/items'),
          NetworkManager.I.request<{ templates: any[] }>('/items/templates').catch(() => ({ templates: [] }))
        ]);
        const tplById: Record<string, any> = {};
        for (const t of (tpls.templates || [])) tplById[t.id] = t;
        list.innerHTML = '';
        if (!data.items.length) {
          list.appendChild(html('<div style="opacity:.8;">暂无道具，尝试多挖矿或掠夺以获取更多资源</div>'));
        }
        for (const item of data.items) {
          const tpl = tplById[item.templateId];
          const rarity = getRarity(item, tpl);
          const name = (tpl && (tpl.name || tpl.id)) || item.templateId;

          const row = html(`
            <div class="item-card hover-lift ${
              rarity.key === 'legendary' ? 'rarity-outline-legendary' : rarity.key === 'epic' ? 'rarity-outline-epic' : rarity.key === 'rare' ? 'rarity-outline-rare' : 'rarity-outline-common'
            }" data-rarity="${rarity.key}">
              <div class="row" style="justify-content:space-between;align-items:flex-start;gap:10px;">
                <div style="display:flex;flex-direction:column;gap:4px;flex:1;min-width:0;">
                  <div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;">
                    <strong style="font-size:15px;white-space:nowrap;display:flex;align-items:center;gap:6px;"><span data-ico="ore"></span>${name}</strong>
                    <span class="badge rarity-${rarity.key}"><i></i>${rarity.text}</span>
                    ${item.isEquipped ? '<span class="pill">已装备</span>' : ''}
                    ${item.isListed ? '<span class="pill">挂单中</span>' : ''}
                  </div>
                  <div style="opacity:.85;display:flex;flex-wrap:wrap;gap:8px;">
                    <span>等级 Lv.${item.level}</span>
                    <span class="pill">实例 ${item.id}</span>
                    ${tpl?.category ? `<span class="pill">${tpl.category}</span>` : ''}
                  </div>
                </div>
                <div class="actions">
                  <button class="btn btn-buy" data-act="equip" data-id="${item.id}" ${item.isEquipped ? 'disabled' : ''}><span data-ico="shield"></span>装备</button>
                  <button class="btn btn-primary" data-act="upgrade" data-id="${item.id}"><span data-ico="wrench"></span>升级</button>
                  <button class="btn btn-ghost" data-act="toggle" data-id="${item.id}"><span data-ico="list"></span>详情</button>
                </div>
              </div>
              <div class="timeline" id="tl-${item.id}" hidden></div>
            </div>
          `);
          mountIcons(row);
          row.addEventListener('click', async (ev) => {
            const target = ev.target as HTMLButtonElement;
            const id = target.getAttribute('data-id');
            const act = target.getAttribute('data-act');
            if (!id || !act) return;
            if (act === 'toggle') {
              const box = row.querySelector(`#tl-${id}`) as HTMLElement;
              if (!box) return;
              if (!box.hasChildNodes()) {
                box.innerHTML = '<div class="skeleton" style="height:36px;"></div>';
                box.hidden = false;
                try {
                  const res = await NetworkManager.I.request<{ logs: { type: string; desc?: string; time: number }[] }>(`/items/logs?itemId=${id}`);
                  const logs = Array.isArray(res.logs) ? res.logs : [];
                  box.innerHTML = '';
                  if (!logs.length) {
                    box.innerHTML = '<div style="opacity:.8;">暂无历史数据</div>';
                  } else {
                    for (const log of logs) {
                      const node = html(`
                        <div class="timeline-item">
                          <div class="dot"></div>
                          <div class="time">${formatTime(log.time)}</div>
                          <div class="desc">${(log.desc || log.type || '').replace(/</g,'&lt;')}</div>
                        </div>
                      `);
                      box.appendChild(node);
                    }
                  }
                } catch {
                  box.innerHTML = '';
                  box.appendChild(html(`
                    <div class="timeline-item">
                      <div class="dot"></div>
                      <div class="time">—</div>
                      <div class="desc">来源未知 · 可通过挖矿、掠夺或交易获取</div>
                    </div>
                  `));
                }
              } else {
                box.hidden = !box.hidden;
              }
              return;
            }
            try {
              target.disabled = true;
              target.innerHTML = act === 'equip' ? '<span data-ico="shield"></span>装备中…' : '<span data-ico="wrench"></span>升级中…';
              mountIcons(target);
              if (act === 'equip') {
                await NetworkManager.I.request('/items/equip', { method: 'POST', body: JSON.stringify({ itemId: id }) });
                showToast('装备成功');
              } else if (act === 'upgrade') {
                await NetworkManager.I.request('/items/upgrade', { method: 'POST', body: JSON.stringify({ itemId: id }) });
                showToast('升级成功');
              }
              await load();
            } catch (e: any) {
              showToast(e?.message || '操作失败');
            } finally {
              const a = target.getAttribute('data-act');
              if (a === 'equip') target.innerHTML = '<span data-ico="shield"></span>装备';
              else if (a === 'upgrade') target.innerHTML = '<span data-ico="wrench"></span>升级';
              else target.innerHTML = '<span data-ico="list"></span>详情';
              mountIcons(target);
              target.disabled = false;
            }
          });
          list.appendChild(row);
        }

        tplContainer.innerHTML = '';
        for (const tpl of (tpls.templates || [])) {
          const row = html(`<div class="list-item"><strong>${tpl.name || tpl.id}</strong> · ${tpl.category || '未知类型'}</div>`);
          tplContainer.appendChild(row);
        }
      } catch (e: any) {
        showToast(e?.message || '加载仓库失败');
      } finally {
        refreshBtn.disabled = false;
        refreshBtn.innerHTML = '<span data-ico="refresh"></span>刷新';
        mountIcons(refreshBtn);
      }
    };

    refreshBtn.onclick = () => load();
    await load();
  }
}
