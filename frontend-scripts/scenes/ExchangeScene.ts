import { NetworkManager } from '../core/NetworkManager';
import { html, qs } from '../utils/dom';
import { renderNav } from '../components/Nav';
import { RealtimeClient } from '../core/RealtimeClient';
import { GameManager } from '../core/GameManager';
import { showToast } from '../components/Toast';
import { renderResourceBar } from '../components/ResourceBar';
import { renderIcon } from '../components/Icon';

type Order = {
  id: string;
  userId: string;
  type: 'buy' | 'sell';
  itemTemplateId?: string;
  itemInstanceId?: string;
  price: number;
  amount: number;
  createdAt: number;
};

export class ExchangeScene {
  private refreshTimer: number | null = null;
  private templates: { id: string; name?: string; category?: string }[] = [];
  private inventory: any[] = [];

  async mount(root: HTMLElement) {
    this.clearTimer();
    root.innerHTML = '';

    const nav = renderNav('exchange');
    const bar = renderResourceBar();
    const view = html(`
      <div class="container" style="color:#fff;display:flex;flex-direction:column;gap:12px;">
        <div class="card fade-in">
          <h3 style="margin:0 0 12px;display:flex;align-items:center;gap:8px;"><span data-ico="exchange"></span>市场下单</h3>
          <div class="row" style="flex-wrap:wrap;align-items:flex-end;gap:12px;">
            <div style="flex:1;min-width:180px;">
              <label style="display:flex;align-items:center;gap:6px;"><span data-ico="list"></span>购买模板</label>
              <select id="tpl" class="input"></select>
            </div>
            <div style="flex:1;min-width:120px;">
              <label style="display:flex;align-items:center;gap:6px;"><span data-ico="coin"></span>价格 (BB币)</label>
              <input id="price" class="input" type="number" min="1" value="10"/>
            </div>
            <div style="flex:1;min-width:120px;">
              <label>购买数量</label>
              <input id="amount" class="input" type="number" min="1" value="1"/>
            </div>
            <button id="placeBuy" class="btn btn-buy" style="min-width:120px;"><span data-ico="arrow-right"></span>下买单</button>
          </div>
          <div style="height:8px;"></div>
          <div class="row" style="flex-wrap:wrap;align-items:flex-end;gap:12px;">
            <div style="flex:1;min-width:220px;">
              <label style="display:flex;align-items:center;gap:6px;"><span data-ico="box"></span>出售道具</label>
              <select id="inst" class="input"></select>
            </div>
            <div style="flex:1;min-width:120px;">
              <label style="display:flex;align-items:center;gap:6px;"><span data-ico="coin"></span>价格 (BB币)</label>
              <input id="sprice" class="input" type="number" min="1" value="5"/>
            </div>
            <button id="placeSell" class="btn btn-sell" style="min-width:120px;"><span data-ico="arrow-right"></span>下卖单</button>
          </div>
          <div id="inventory" style="margin-top:12px;display:flex;flex-wrap:wrap;gap:8px;"></div>
        </div>

        <div class="card fade-in">
          <div class="row" style="justify-content:space-between;align-items:center;gap:12px;">
            <h3 style="margin:0;display:flex;align-items:center;gap:8px;"><span data-ico="list"></span>订单簿</h3>
            <div class="row" style="flex-wrap:wrap;gap:8px;">
              <select id="q_tpl" class="input" style="width:180px;"></select>
              <select id="q_type" class="input" style="width:120px;">
                <option value="buy">买单</option>
                <option value="sell">卖单</option>
              </select>
              <label class="row pill" style="align-items:center;gap:6px;">
                <span data-ico="user"></span>
                <input id="my" type="checkbox"/> 只看我的
              </label>
              <button id="refresh" class="btn btn-primary" style="min-width:96px;"><span data-ico="refresh"></span>刷新</button>
            </div>
          </div>
          <div id="book" style="margin-top:12px;display:flex;flex-direction:column;gap:8px;"></div>
        </div>

        <div class="card fade-in" id="logs" style="opacity:.9;font-family:monospace;min-height:24px;"></div>
      </div>
    `);

    root.appendChild(nav);
    root.appendChild(bar.root);
    root.appendChild(view);

    const token = (NetworkManager as any).I['token'];
    if (token) RealtimeClient.I.connect(token);
    const me = GameManager.I.getProfile();

    const book = qs(view, '#book');
    const logs = qs<HTMLElement>(view, '#logs');
    const buyTpl = qs<HTMLSelectElement>(view, '#tpl');
    const buyPrice = qs<HTMLInputElement>(view, '#price');
    const buyAmount = qs<HTMLInputElement>(view, '#amount');
    const placeBuy = qs<HTMLButtonElement>(view, '#placeBuy');
    const sellInst = qs<HTMLSelectElement>(view, '#inst');
    const sellPrice = qs<HTMLInputElement>(view, '#sprice');
    const placeSell = qs<HTMLButtonElement>(view, '#placeSell');
    const invBox = qs<HTMLElement>(view, '#inventory');
    const queryTpl = qs<HTMLSelectElement>(view, '#q_tpl');
    const queryType = qs<HTMLSelectElement>(view, '#q_type');
    const queryMineOnly = qs<HTMLInputElement>(view, '#my');
    const mineOnlyLabel = view.querySelector('label.row.pill') as HTMLLabelElement | null;
    const refreshBtn = qs<HTMLButtonElement>(view, '#refresh');

    const mountIcons = (rootEl: Element) => {
      rootEl.querySelectorAll('[data-ico]')
        .forEach((el) => {
          const name = (el as HTMLElement).getAttribute('data-ico') as any;
          try { el.appendChild(renderIcon(name, { size: 20 })); } catch {}
        });
    };
    mountIcons(view);

    let prevIds = new Set<string>();
    let refreshing = false;

    const log = (message: string) => {
      logs.textContent = message;
    };

    const renderTemplateOptions = () => {
      buyTpl.innerHTML = '';
      queryTpl.innerHTML = '';
      const placeholder = html('<option value="">选择模板</option>') as HTMLOptionElement;
      buyTpl.appendChild(placeholder);
      const qPlaceholder = html('<option value="">全部模板</option>') as HTMLOptionElement;
      queryTpl.appendChild(qPlaceholder);
      for (const tpl of this.templates) {
        const option = document.createElement('option');
        option.value = tpl.id;
        option.textContent = tpl.name ? `${tpl.name} (${tpl.id})` : tpl.id;
        buyTpl.appendChild(option);
        const qOption = option.cloneNode(true) as HTMLOptionElement;
        queryTpl.appendChild(qOption);
      }
    };

    const renderInventory = () => {
      sellInst.innerHTML = '';
      invBox.innerHTML = '';
      const defaultOption = html('<option value="">选择可出售的道具</option>') as HTMLOptionElement;
      sellInst.appendChild(defaultOption);
      const available = this.inventory.filter((item) => !item.isEquipped && !item.isListed);
      if (!available.length) {
        invBox.textContent = '暂无可出售的道具（需先在仓库卸下装备）';
        return;
      }
      for (const item of available) {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = `${item.id} · ${item.templateId} · Lv.${item.level}`;
        sellInst.appendChild(option);

        const chip = html(`<button class="btn btn-ghost" style="flex:unset;padding:6px 10px;" data-id="${item.id}">${item.id} (${item.templateId})</button>`) as HTMLButtonElement;
        chip.onclick = () => {
          sellInst.value = item.id;
          log(`已选择出售道具 ${item.id}`);
        };
        invBox.appendChild(chip);
      }
    };

    const loadMetadata = async () => {
      try {
        const [tpls, items] = await Promise.all([
          NetworkManager.I.request<{ templates: any[] }>('/items/templates'),
          NetworkManager.I.request<{ items: any[] }>('/items'),
        ]);
        this.templates = tpls.templates || [];
        this.inventory = items.items || [];
        renderTemplateOptions();
        renderInventory();
      } catch (e: any) {
        log(e?.message || '加载模板/仓库失败');
      }
    };

    const refresh = async (opts: { quiet?: boolean } = {}) => {
      if (refreshing) return;
      refreshing = true;
      if (!opts.quiet) { refreshBtn.innerHTML = '<span data-ico="refresh"></span>刷新中…'; mountIcons(refreshBtn); }
      refreshBtn.disabled = true;
      try {
        const tplId = queryTpl.value;
        const type = queryType.value as 'buy' | 'sell';
        const mineOnly = queryMineOnly.checked;
        const params = new URLSearchParams();
        params.set('type', type);
        params.set('item_template_id', tplId || '');
        if (!opts.quiet) {
          book.innerHTML = '';
          for (let i = 0; i < 4; i++) book.appendChild(html('<div class="skeleton"></div>'));
        }
        const data = await NetworkManager.I.request<{ orders: Order[] }>(`/exchange/orders?${params.toString()}`);
        const newIds = new Set<string>();
        book.innerHTML = '';
        const orders = data.orders || [];
        if (!orders.length) {
          book.appendChild(html('<div style="opacity:.8;text-align:center;">暂无订单</div>'));
        }
        for (const order of orders) {
          if (mineOnly && me && order.userId !== me.id) continue;
          newIds.add(order.id);
          const isMine = me && order.userId === me.id;
          const klass = `list-item ${order.type === 'buy' ? 'list-item--buy' : 'list-item--sell'}`;
          const row = html(`
            <div class="${klass}">
              <div style="display:flex;flex-direction:column;gap:2px;">
                <div>
                  <strong>${order.type === 'buy' ? '买入' : '卖出'}</strong>
                  ${order.itemTemplateId || ''}
                  ${isMine ? '<span class="pill">我的</span>' : ''}
                </div>
                <div style="opacity:.85;">
                  价格: ${order.price} · 数量: ${order.amount}
                  ${order.itemInstanceId ? `<span class="pill">${order.itemInstanceId}</span>` : ''}
                  <span class="pill">${order.id}</span>
                </div>
              </div>
              <div>
                ${isMine ? `<button class="btn btn-ghost" data-id="${order.id}"><span data-ico="trash"></span>撤单</button>` : ''}
              </div>
            </div>
          `);
          mountIcons(row);
          if (!prevIds.has(order.id)) row.classList.add('flash');
          row.addEventListener('click', async (ev) => {
            const target = ev.target as HTMLElement;
            const id = target.getAttribute('data-id');
            if (!id) return;
            try {
              target.setAttribute('disabled', 'true');
              await NetworkManager.I.request(`/exchange/orders/${id}`, { method: 'DELETE' });
              showToast('撤单成功', 'success');
              await refresh();
            } catch (e: any) {
              showToast(e?.message || '撤单失败', 'error');
            } finally {
              target.removeAttribute('disabled');
            }
          });
          book.appendChild(row);
        }
        prevIds = newIds;
        if (!book.childElementCount) {
          book.appendChild(html('<div style="opacity:.8;text-align:center;">暂无符合条件的订单</div>'));
        }
      } catch (e: any) {
        log(e?.message || '刷新订单失败');
      } finally {
        refreshing = false;
        refreshBtn.disabled = false;
        refreshBtn.innerHTML = '<span data-ico="refresh"></span>刷新';
        mountIcons(refreshBtn);
      }
    };

    placeBuy.onclick = async () => {
      const tplId = buyTpl.value.trim();
      const price = Number(buyPrice.value);
      const amount = Number(buyAmount.value);
      if (!tplId) {
        showToast('请选择购买的模板', 'warn');
        return;
      }
      if (price <= 0 || amount <= 0) {
        showToast('请输入有效的价格与数量', 'warn');
        return;
      }
      placeBuy.disabled = true;
      placeBuy.textContent = '提交中…';
      try {
        const res = await NetworkManager.I.request<{ id: string }>('/exchange/orders', {
          method: 'POST',
          body: JSON.stringify({ type: 'buy', item_template_id: tplId, price, amount }),
        });
        showToast(`买单已提交 (#${res.id})`, 'success');
        log(`买单成功: ${res.id}`);
        await bar.update();
        await refresh();
      } catch (e: any) {
        showToast(e?.message || '买单提交失败', 'error');
        log(e?.message || '买单提交失败');
      } finally {
        placeBuy.disabled = false;
        placeBuy.textContent = '下买单';
      }
    };

    placeSell.onclick = async () => {
      const instId = sellInst.value.trim();
      const price = Number(sellPrice.value);
      if (!instId) {
        showToast('请选择要出售的道具', 'warn');
        return;
      }
      if (price <= 0) {
        showToast('请输入有效的价格', 'warn');
        return;
      }
      placeSell.disabled = true;
      placeSell.textContent = '提交中…';
      try {
        const res = await NetworkManager.I.request<{ id: string }>('/exchange/orders', {
          method: 'POST',
          body: JSON.stringify({ type: 'sell', item_instance_id: instId, price }),
        });
        showToast(`卖单已提交 (#${res.id})`, 'success');
        log(`卖单成功: ${res.id}`);
        await bar.update();
        await loadMetadata();
        await refresh();
      } catch (e: any) {
        showToast(e?.message || '卖单提交失败', 'error');
        log(e?.message || '卖单提交失败');
      } finally {
        placeSell.disabled = false;
        placeSell.textContent = '下卖单';
      }
    };

    refreshBtn.onclick = () => refresh();
    queryTpl.onchange = () => refresh();
    queryType.onchange = () => refresh();
    queryMineOnly.onchange = () => { if (mineOnlyLabel) mineOnlyLabel.classList.toggle('active', queryMineOnly.checked); refresh(); };
    if (mineOnlyLabel) mineOnlyLabel.classList.toggle('active', queryMineOnly.checked);

    await Promise.all([bar.update(), loadMetadata()]);
    await refresh({ quiet: true });
    this.refreshTimer = window.setInterval(() => {
      refresh({ quiet: true }).catch(() => {});
    }, 10000);
  }

  private clearTimer() {
    if (this.refreshTimer !== null) {
      window.clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }
}
