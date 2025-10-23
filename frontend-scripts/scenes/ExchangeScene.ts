import { NetworkManager } from '../core/NetworkManager';
import { html, qs } from '../utils/dom';
import { renderNav } from '../components/Nav';

export class ExchangeScene {
  mount(root: HTMLElement) {
    root.innerHTML = '';
    root.appendChild(renderNav('exchange'));
    const view = html(`
      <div style="max-width:680px;margin:12px auto;color:#fff;display:grid;gap:12px;grid-template-columns: 1fr;">
        <div style="padding:12px;border-radius:16px;background:linear-gradient(135deg, rgba(123,44,245,.25), rgba(44,137,245,.25));backdrop-filter:blur(10px);box-shadow:0 8px 20px rgba(0,0,0,.35),0 0 12px rgba(123,44,245,.7);">
          <h3 style="margin:0 0 8px">下单</h3>
          <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:flex-end;">
            <div style="flex:1;min-width:160px">
              <label>模板ID（买单）</label>
              <input id="tpl" placeholder="tpl-miner-1" style="width:100%;padding:8px;border-radius:10px;background:rgba(255,255,255,.08);border:0;color:#fff;"/>
            </div>
            <div style="flex:1;min-width:120px">
              <label>价格</label>
              <input id="price" type="number" value="10" style="width:100%;padding:8px;border-radius:10px;background:rgba(255,255,255,.08);border:0;color:#fff;"/>
            </div>
            <div style="flex:1;min-width:120px">
              <label>数量（买单）</label>
              <input id="amount" type="number" value="1" style="width:100%;padding:8px;border-radius:10px;background:rgba(255,255,255,.08);border:0;color:#fff;"/>
            </div>
            <button id="placeBuy" style="padding:10px 14px;border-radius:10px;color:#fff;background:#2C89F5;border:0;">下买单</button>
          </div>
          <div style="height:8px"></div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:flex-end;">
            <div style="flex:1;min-width:200px">
              <label>道具实例ID（卖单）</label>
              <input id="inst" placeholder="itm_xxx" style="width:100%;padding:8px;border-radius:10px;background:rgba(255,255,255,.08);border:0;color:#fff;"/>
            </div>
            <div style="flex:1;min-width:120px">
              <label>价格</label>
              <input id="sprice" type="number" value="5" style="width:100%;padding:8px;border-radius:10px;background:rgba(255,255,255,.08);border:0;color:#fff;"/>
            </div>
            <button id="placeSell" style="padding:10px 14px;border-radius:10px;color:#fff;background:#7B2CF5;border:0;">下卖单</button>
          </div>
        </div>

        <div style="padding:12px;border-radius:16px;background:linear-gradient(135deg, rgba(123,44,245,.25), rgba(44,137,245,.25));backdrop-filter:blur(10px);box-shadow:0 8px 20px rgba(0,0,0,.35),0 0 12px rgba(123,44,245,.7);">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <h3 style="margin:0">订单簿</h3>
            <div>
              <input id="q_tpl" placeholder="tpl-miner-1" style="padding:6px;border-radius:8px;background:rgba(255,255,255,.08);border:0;color:#fff;"/>
              <select id="q_type" style="padding:6px;border-radius:8px;background:rgba(255,255,255,.08);border:0;color:#fff;">
                <option value="buy">买单</option>
                <option value="sell">卖单</option>
              </select>
              <button id="refresh" style="padding:8px 12px;border-radius:10px;color:#fff;background:linear-gradient(135deg,#7B2CF5,#2C89F5);border:0;">刷新</button>
            </div>
          </div>
          <div id="book" style="margin-top:8px;display:flex;flex-direction:column;gap:8px;"></div>
        </div>
        <div id="msg" style="opacity:.9;font-family:monospace;"></div>
      </div>
    `);
    root.appendChild(view);

    const log = (m:string) => { const el = qs(view, '#msg'); el.textContent = m; };

    qs<HTMLButtonElement>(view, '#placeBuy').onclick = async () => {
      try {
        const tpl = (qs<HTMLInputElement>(view, '#tpl').value||'').trim();
        const price = Number((qs<HTMLInputElement>(view, '#price').value||'0'));
        const amount = Number((qs<HTMLInputElement>(view, '#amount').value||'0'));
        const r = await NetworkManager.I.request<{id:string}>(`/exchange/orders`, { method:'POST', body: JSON.stringify({ type:'buy', item_template_id: tpl, price, amount }) });
        log(`买单成功：${r.id}`);
        await refresh();
      } catch (e:any) { log(e.message); }
    };

    qs<HTMLButtonElement>(view, '#placeSell').onclick = async () => {
      try {
        const inst = (qs<HTMLInputElement>(view, '#inst').value||'').trim();
        const price = Number((qs<HTMLInputElement>(view, '#sprice').value||'0'));
        const r = await NetworkManager.I.request<{id:string}>(`/exchange/orders`, { method:'POST', body: JSON.stringify({ type:'sell', item_instance_id: inst, price }) });
        log(`卖单成功：${r.id}`);
        await refresh();
      } catch (e:any) { log(e.message); }
    };

    const refresh = async () => {
      const t = (qs<HTMLInputElement>(view, '#q_tpl').value || '').trim();
      const ty = (qs<HTMLSelectElement>(view, '#q_type').value as 'buy'|'sell');
      const data = await NetworkManager.I.request<{ orders:any[] }>(`/exchange/orders?item_template_id=${encodeURIComponent(t)}&type=${ty}`);
      const book = qs(view, '#book');
      book.innerHTML='';
      for (const o of data.orders) {
        const row = html(`
          <div style="display:flex;gap:8px;align-items:center;justify-content:space-between;background:rgba(255,255,255,.06);border-radius:12px;padding:10px;">
            <div style="display:flex;flex-direction:column;gap:2px;">
              <div><strong>${o.type.toUpperCase()}</strong> ${o.itemTemplateId || ''}</div>
              <div style="opacity:.85">价格:${o.price} 数量:${o.amount} id:${o.id}</div>
            </div>
            <div>
              <button data-id="${o.id}" style="padding:6px 10px;border-radius:8px;border:0;color:#fff;background:#E36414;">撤单</button>
            </div>
          </div>
        `);
        row.addEventListener('click', async (ev) => {
          const id = (ev.target as HTMLElement).getAttribute('data-id');
          if (!id) return;
          await NetworkManager.I.request(`/exchange/orders/${id}`, { method:'DELETE' });
          await refresh();
        });
        book.appendChild(row);
      }
    };
    qs<HTMLButtonElement>(view, '#refresh').onclick = refresh;
    refresh();
  }
}

