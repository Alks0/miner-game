import { GameManager } from '../core/GameManager';
import { html, qs } from '../utils/dom';
import { showToast } from '../components/Toast';

export class LoginScene {
  mount(root: HTMLElement) {
    const view = html(`
      <div class="container" style="color:#fff;">
        <div class="card fade-in" style="max-width:420px;margin:40px auto;">
          <h2 style="margin:0 0 12px 0;">登录 / 注册</h2>
          <input id="u" class="input" placeholder="用户名" autocomplete="username"/>
          <input id="p" class="input" placeholder="密码" type="password" autocomplete="current-password"/>
          <button id="go" class="btn btn-primary" style="width:100%;margin-top:8px;">进入游戏</button>
          <div style="margin-top:8px;opacity:.75;font-size:12px;">提示：若账户不存在，将自动创建并登录。</div>
        </div>
      </div>
    `);
    root.innerHTML = '';
    root.appendChild(view);

    const uEl = qs<HTMLInputElement>(view, '#u');
    const pEl = qs<HTMLInputElement>(view, '#p');
    const go = qs<HTMLButtonElement>(view, '#go');

    const submit = async () => {
      const username = (uEl.value || '').trim();
      const password = (pEl.value || '').trim();
      if (!username || !password) {
        showToast('请填写用户名和密码');
        return;
      }
      go.disabled = true;
      go.textContent = '登录中…';
      try {
        await GameManager.I.loginOrRegister(username, password);
        location.hash = '#/main';
      } catch (e: any) {
        showToast(e?.message || '登录失败，请重试');
      } finally {
        go.disabled = false;
        go.textContent = '进入游戏';
      }
    };

    go.onclick = submit;
    uEl.onkeyup = (e) => { if ((e as KeyboardEvent).key === 'Enter') submit(); };
    pEl.onkeyup = (e) => { if ((e as KeyboardEvent).key === 'Enter') submit(); };
  }
}
