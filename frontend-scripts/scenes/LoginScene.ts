import { GameManager } from '../core/GameManager';
import { html, qs } from '../utils/dom';
import { showToast } from '../components/Toast';
import { renderIcon } from '../components/Icon';

export class LoginScene {
  mount(root: HTMLElement) {
    const view = html(`
      <div class="container grid-2" style="color:#fff;">
        <div class="card fade-in" style="max-width:460px;margin:46px auto;">
          <div class="scene-header">
            <div>
              <h1 style="background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent;display:flex;align-items:center;gap:8px;"><span data-ico="home"></span>矿场指挥中心</h1>
              <p>登录后进入你的赛博矿城。</p>
            </div>
          </div>
          <input id="u" class="input" placeholder="用户名" autocomplete="username"/>
          <div class="row" style="align-items:center;">
            <input id="p" class="input" placeholder="密码" type="password" autocomplete="current-password"/>
            <button id="reveal" class="btn btn-ghost" style="min-width:110px;"><span data-ico="eye"></span>显示</button>
          </div>
          <button id="go" class="btn btn-primary" style="width:100%;margin-top:8px;"><span data-ico="arrow-right"></span>进入游戏</button>
          <div style="margin-top:8px;opacity:.75;font-size:12px;">提示：若账户不存在，将自动创建并登录。</div>
        </div>
      </div>
    `);
    root.innerHTML = '';
    root.appendChild(view);

    // 渲染所有图标
    try {
      view.querySelectorAll('[data-ico]').forEach((el) => {
        const name = (el as HTMLElement).getAttribute('data-ico') as any;
        try {
          el.appendChild(renderIcon(name, { size: 22 }));
        } catch {}
      });
    } catch {}

    const uEl = qs<HTMLInputElement>(view, '#u');
    const pEl = qs<HTMLInputElement>(view, '#p');
    const go = qs<HTMLButtonElement>(view, '#go');
    const reveal = qs<HTMLButtonElement>(view, '#reveal');

    // 使用 requestAnimationFrame 确保渲染完成后立即聚焦
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        uEl.focus();
      });
    });

    const submit = async () => {
      if (go.disabled) return; // 防止重复点击
      
      const username = (uEl.value || '').trim();
      const password = (pEl.value || '').trim();
      if (!username || !password) {
        showToast('请填写用户名和密码', 'warn');
        return;
      }
      if (username.length < 3 || username.length > 20) {
        showToast('用户名长度应在 3-20 个字符之间', 'warn');
        return;
      }
      if (password.length < 3) {
        showToast('密码至少需要 3 个字符', 'warn');
        return;
      }
      go.disabled = true;
      const originalHTML = go.innerHTML;
      go.innerHTML = '<span data-ico="arrow-right"></span>登录中…';
      try {
        view.querySelectorAll('[data-ico]').forEach((el) => {
          const name = (el as HTMLElement).getAttribute('data-ico') as any;
          try { el.appendChild(renderIcon(name, { size: 20 })); } catch {}
        });
      } catch {}
      
      try {
        await GameManager.I.loginOrRegister(username, password);
        location.hash = '#/main';
      } catch (e: any) {
        showToast(e?.message || '登录失败，请重试', 'error');
        // 失败时恢复按钮
        go.innerHTML = originalHTML;
        try {
          view.querySelectorAll('[data-ico]').forEach((el) => {
            const name = (el as HTMLElement).getAttribute('data-ico') as any;
            try { el.appendChild(renderIcon(name, { size: 20 })); } catch {}
          });
        } catch {}
      } finally {
        go.disabled = false;
      }
    };

    go.onclick = submit;
    uEl.onkeyup = (e) => { if ((e as KeyboardEvent).key === 'Enter') submit(); };
    pEl.onkeyup = (e) => { if ((e as KeyboardEvent).key === 'Enter') submit(); };
    reveal.onclick = () => {
      const isPwd = pEl.type === 'password';
      pEl.type = isPwd ? 'text' : 'password';
      reveal.innerHTML = '';
      reveal.appendChild(renderIcon(isPwd ? 'eye-off' : 'eye', { size: 20 }));
      reveal.appendChild(document.createTextNode(isPwd ? '隐藏' : '显示'));
    };
  }
}
