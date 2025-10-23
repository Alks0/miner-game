import { GameManager } from '../core/GameManager';
import { html, qs } from '../utils/dom';
import { showToast } from '../components/Toast';
import { renderIcon } from '../components/Icon';

export class LoginScene {
  mount(root: HTMLElement) {
    const view = html(`
      <div class="container" style="color:#fff;">
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

    const uEl = qs<HTMLInputElement>(view, '#u');
    const pEl = qs<HTMLInputElement>(view, '#p');
    const go = qs<HTMLButtonElement>(view, '#go');
    const reveal = qs<HTMLButtonElement>(view, '#reveal');

    const submit = async () => {
      const username = (uEl.value || '').trim();
      const password = (pEl.value || '').trim();
      if (!username || !password) {
        showToast('请填写用户名和密码', 'warn');
        return;
      }
      go.disabled = true;
      go.textContent = '登录中…';
      try {
        await GameManager.I.loginOrRegister(username, password);
        location.hash = '#/main';
      } catch (e: any) {
        showToast(e?.message || '登录失败，请重试', 'error');
      } finally {
        go.disabled = false;
        go.textContent = '进入游戏';
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
    // mount icons
    try {
      view.querySelectorAll('[data-ico]')
        .forEach((el) => {
          const name = (el as HTMLElement).getAttribute('data-ico') as any;
          try { el.appendChild(renderIcon(name, { size: 22 })); } catch {}
        });
    } catch {}
