import { GameManager } from '../core/GameManager';
import { html, qs } from '../utils/dom';

export class LoginScene {
  mount(root: HTMLElement) {
    const view = html(`
      <div style="max-width:360px;margin:40px auto;padding:20px;border-radius:16px;background:linear-gradient(135deg, rgba(123,44,245,.25), rgba(44,137,245,.25));backdrop-filter:blur(10px);box-shadow:0 8px 20px rgba(0,0,0,.35),0 0 12px rgba(123,44,245,.7);color:#fff;">
        <h2 style="margin:0 0 12px 0;">登录 / 注册</h2>
        <input id="u" placeholder="用户名" style="width:100%;padding:10px;border-radius:12px;background:rgba(255,255,255,.08);border:none;color:#fff;margin:8px 0;outline:none;"/>
        <input id="p" placeholder="密码" type="password" style="width:100%;padding:10px;border-radius:12px;background:rgba(255,255,255,.08);border:none;color:#fff;margin:8px 0;outline:none;"/>
        <button id="go" style="width:100%;padding:12px;border-radius:12px;color:#fff;background:linear-gradient(135deg,#7B2CF5,#2C89F5);box-shadow:0 8px 20px rgba(0,0,0,.35),0 0 12px #7B2CF5;">进入</button>
      </div>
    `);
    root.innerHTML = '';
    root.appendChild(view);
    qs<HTMLButtonElement>(view, '#go').onclick = async () => {
      const u = (qs<HTMLInputElement>(view, '#u').value || 'user').trim();
      const p = (qs<HTMLInputElement>(view, '#p').value || 'password').trim();
      await GameManager.I.loginOrRegister(u, p);
      location.hash = '#/main';
      location.reload();
    }
  }
}


