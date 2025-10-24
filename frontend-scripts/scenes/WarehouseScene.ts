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
              <summary><span data-ico="ore"></span>碎片仓库</summary>
              <div id="fragments" style="margin-top:8px;display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;"></div>
            </details>
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

    const token = NetworkManager.I.getToken();
    if (token) RealtimeClient.I.connect(token);

    const list = qs(view, '#list');
    const tplContainer = qs(view, '#tpls');
    const fragmentsContainer = qs(view, '#fragments');
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
        const [data, tpls, fragmentsData] = await Promise.all([
          NetworkManager.I.request<{ items: any[] }>('/items'),
          NetworkManager.I.request<{ templates: any[] }>('/items/templates').catch(() => ({ templates: [] })),
          NetworkManager.I.request<{ fragments: Record<string, number> }>('/items/fragments').catch(() => ({ fragments: {} }))
        ]);
        const tplById: Record<string, any> = {};
        for (const t of (tpls.templates || [])) tplById[t.id] = t;
        
        // 渲染碎片
        const fragments = fragmentsData.fragments || {};
        fragmentsContainer.innerHTML = '';
        const fragmentNames: Record<string, string> = {
          miner: '矿机碎片',
          cart: '矿车碎片',
          raider: '掠夺器碎片',
          shield: '防御盾碎片',
        };
        for (const [type, count] of Object.entries(fragments)) {
          const canCraft = count >= 50;
          const card = html(`
            <div class="fragment-card ${canCraft ? 'can-craft' : ''}">
              <div class="fragment-icon" data-ico="ore"></div>
              <div class="fragment-info">
                <div class="fragment-name">${fragmentNames[type] || type}</div>
                <div class="fragment-count">${count} / 50</div>
              </div>
              <button class="btn btn-primary btn-sm" data-craft="${type}" ${canCraft ? '' : 'disabled'}><span data-ico="wrench"></span>合成</button>
            </div>
          `);
          mountIcons(card);
          
          // 合成按钮点击事件
          const craftBtn = card.querySelector('[data-craft]') as HTMLButtonElement;
          craftBtn?.addEventListener('click', async () => {
            if (craftBtn.disabled) return;
            
            craftBtn.disabled = true;
            const originalHTML = craftBtn.innerHTML;
            craftBtn.innerHTML = '<span data-ico="wrench"></span>合成中…';
            mountIcons(craftBtn);
            
            try {
              const res = await NetworkManager.I.request<{ item: any }>('/items/craft', {
                method: 'POST',
                body: JSON.stringify({ fragmentType: type }),
              });
              showToast(`合成成功！获得 ${fragmentNames[type]}`, 'success');
              card.classList.add('upgrade-success');
              setTimeout(() => card.classList.remove('upgrade-success'), 1000);
              await load();
            } catch (e: any) {
              showToast(e?.message || '合成失败', 'error');
              craftBtn.innerHTML = originalHTML;
              mountIcons(craftBtn);
            } finally {
              craftBtn.disabled = false;
            }
          });
          
          fragmentsContainer.appendChild(card);
        }
        
        list.innerHTML = '';
        if (!data.items.length) {
          list.appendChild(html('<div style="opacity:.8;">暂无道具，尝试多挖矿或掠夺以获取更多资源</div>'));
        }
        for (const item of data.items) {
          const tpl = tplById[item.templateId];
          const rarity = getRarity(item, tpl);
          const name = (tpl && (tpl.name || tpl.id)) || item.templateId;

          // 计算升级成功率
          const successRate = Math.max(0.4, 0.8 - (item.level - 1) * 0.02);
          const successPct = Math.round(successRate * 100);
          
          const row = html(`
            <div class="item-card hover-lift ${
              rarity.key === 'legendary' ? 'rarity-outline-legendary' : rarity.key === 'epic' ? 'rarity-outline-epic' : rarity.key === 'rare' ? 'rarity-outline-rare' : 'rarity-outline-common'
            }" data-rarity="${rarity.key}">
              <div class="row" style="justify-content:space-between;align-items:flex-start;gap:10px;">
                <div style="display:flex;flex-direction:column;gap:6px;flex:1;min-width:0;">
                  <div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;">
                    <strong style="font-size:15px;white-space:nowrap;display:flex;align-items:center;gap:6px;"><span data-ico="ore"></span>${name}</strong>
                    <span class="badge rarity-${rarity.key}"><i></i>${rarity.text}</span>
                    ${item.isEquipped ? '<span class="pill pill-running">已装备</span>' : ''}
                    ${item.isListed ? '<span class="pill">挂单中</span>' : ''}
                  </div>
                  ${tpl?.description ? `<div style="opacity:.75;font-size:13px;font-style:italic;">${tpl.description}</div>` : ''}
                  <div style="opacity:.85;display:flex;flex-wrap:wrap;gap:8px;font-size:13px;">
                    <span>等级 Lv.${item.level}</span>
                    ${tpl?.baseEffect ? `<span class="pill">基础效果 ${tpl.baseEffect}</span>` : ''}
                    <span class="pill">实例 ${item.id}</span>
                  </div>
                </div>
                <div class="actions">
                  <button class="btn ${item.isEquipped ? 'btn-sell' : 'btn-buy'}" data-act="${item.isEquipped ? 'unequip' : 'equip'}" data-id="${item.id}"><span data-ico="${item.isEquipped ? 'x' : 'shield'}"></span>${item.isEquipped ? '卸下' : '装备'}</button>
                  <button class="btn btn-primary" data-act="upgrade" data-id="${item.id}" title="消耗 ${item.level * 50} 矿石，成功率 ${successPct}%"><span data-ico="wrench"></span>升级 (${item.level * 50}) ${successPct}%</button>
                  <button class="btn btn-ghost" data-act="toggle" data-id="${item.id}"><span data-ico="list"></span>详情</button>
                </div>
              </div>
              <div class="timeline" id="tl-${item.id}" hidden></div>
            </div>
          `);
          mountIcons(row);
          row.addEventListener('click', async (ev) => {
            // 查找真正的按钮元素（可能点击了内部的span/svg）
            const btn = (ev.target as HTMLElement).closest('button') as HTMLButtonElement;
            if (!btn) return;
            
            const id = btn.getAttribute('data-id');
            const act = btn.getAttribute('data-act');
            if (!id || !act) return;
            
            // 防止重复点击
            if (btn.disabled && act !== 'toggle') return;
            
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
            
            // 操作按钮处理
            try {
              btn.disabled = true;
              const originalHTML = btn.innerHTML;
              
              if (act === 'equip') {
                btn.innerHTML = '<span data-ico="shield"></span>装备中…';
                mountIcons(btn);
                await NetworkManager.I.request('/items/equip', { method: 'POST', body: JSON.stringify({ itemId: id }) });
                showToast('装备成功', 'success');
              } else if (act === 'unequip') {
                btn.innerHTML = '<span data-ico="x"></span>卸下中…';
                mountIcons(btn);
                await NetworkManager.I.request('/items/unequip', { method: 'POST', body: JSON.stringify({ itemId: id }) });
                showToast('卸下成功', 'success');
              } else if (act === 'upgrade') {
                btn.innerHTML = '<span data-ico="wrench"></span>升级中…';
                mountIcons(btn);
                const res = await NetworkManager.I.request<{ level: number; cost: number }>('/items/upgrade', { method: 'POST', body: JSON.stringify({ itemId: id }) });
                // 升级成功动画
                row.classList.add('upgrade-success');
                setTimeout(() => row.classList.remove('upgrade-success'), 1000);
                showToast(`升级成功！等级 ${res.level}（消耗 ${res.cost} 矿石）`, 'success');
              }
              await bar.update();
              await load();
            } catch (e: any) {
              showToast(e?.message || '操作失败', 'error');
              // 失败时恢复按钮原始状态（因为不会重新渲染）
              btn.innerHTML = originalHTML;
              btn.disabled = false;
            }
          });
          list.appendChild(row);
        }

        tplContainer.innerHTML = '';
        for (const tpl of (tpls.templates || [])) {
          const rarityText = tpl.rarity === 'legendary' ? '传说' : tpl.rarity === 'epic' ? '史诗' : tpl.rarity === 'rare' ? '稀有' : '普通';
          const categoryText = tpl.category === 'miner' ? '矿机' : tpl.category === 'cart' ? '矿车' : tpl.category === 'raider' ? '掠夺器' : '防御盾';
          const row = html(`
            <div class="list-item">
              <div style="flex:1;display:flex;flex-direction:column;gap:4px;">
                <div style="display:flex;gap:6px;align-items:center;">
                  <strong>${tpl.name || tpl.id}</strong>
                  <span class="badge rarity-${tpl.rarity}"><i></i>${rarityText}</span>
                </div>
                <div style="opacity:.75;font-size:12px;">${tpl.description || ''}</div>
                <div style="opacity:.65;font-size:12px;">类型：${categoryText} · 基础效果：${tpl.baseEffect}</div>
              </div>
            </div>
          `);
          tplContainer.appendChild(row);
        }
      } catch (e: any) {
        showToast(e?.message || '加载仓库失败', 'error');
        list.innerHTML = '<div style="opacity:.8;text-align:center;padding:20px;">加载失败，请稍后重试</div>';
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
