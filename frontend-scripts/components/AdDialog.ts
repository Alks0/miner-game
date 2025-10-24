import { html } from '../utils/dom';
import { renderIcon } from './Icon';
import { NetworkManager } from '../core/NetworkManager';
import { showToast } from './Toast';

export async function showAdDialog(): Promise<boolean> {
  return new Promise((resolve) => {
    const overlay = html(`
      <div class="ad-overlay">
        <div class="ad-dialog">
          <div class="ad-content">
            <div class="ad-icon" data-ico="info"></div>
            <h3 style="margin:8px 0;font-size:18px;">观看广告</h3>
            <p style="opacity:.85;margin:8px 0;">观看15秒广告视频即可收矿<br/>并额外获得 5-15 矿石奖励！</p>
            <div class="ad-placeholder">
              <div class="ad-progress-ring">
                <svg width="100" height="100">
                  <circle class="ad-circle-bg" cx="50" cy="50" r="45"></circle>
                  <circle class="ad-circle-fg" cx="50" cy="50" r="45" id="adCircle"></circle>
                </svg>
                <div class="ad-countdown" id="adCountdown">15</div>
              </div>
              <p style="opacity:.75;font-size:13px;margin-top:12px;">[广告占位符 - 实际应接入SDK]</p>
            </div>
            <div class="ad-actions">
              <button class="btn btn-ghost" id="adSkip">跳过（无奖励）</button>
              <button class="btn btn-primary" id="adComplete" disabled>领取奖励</button>
            </div>
          </div>
        </div>
      </div>
    `) as HTMLElement;

    document.body.appendChild(overlay);

    // 渲染图标
    try {
      overlay.querySelectorAll('[data-ico]').forEach((el) => {
        const name = (el as HTMLElement).getAttribute('data-ico') as any;
        try { el.appendChild(renderIcon(name, { size: 48 })); } catch {}
      });
    } catch {}

    const skipBtn = overlay.querySelector('#adSkip') as HTMLButtonElement;
    const completeBtn = overlay.querySelector('#adComplete') as HTMLButtonElement;
    const countdown = overlay.querySelector('#adCountdown') as HTMLElement;
    const circle = overlay.querySelector('#adCircle') as SVGCircleElement;

    // 模拟15秒倒计时
    let seconds = 15;
    const circumference = 2 * Math.PI * 45;
    if (circle) {
      circle.style.strokeDasharray = `${circumference}`;
      circle.style.strokeDashoffset = `${circumference}`;
    }

    const timer = setInterval(() => {
      seconds--;
      countdown.textContent = String(seconds);
      
      if (circle) {
        const offset = circumference * (seconds / 15);
        circle.style.strokeDashoffset = String(offset);
      }

      if (seconds <= 0) {
        clearInterval(timer);
        completeBtn.disabled = false;
        completeBtn.classList.add('btn-energy');
      }
    }, 1000);

    const cleanup = () => {
      clearInterval(timer);
      overlay.remove();
    };

    skipBtn.onclick = () => {
      cleanup();
      resolve(false);
    };

    completeBtn.onclick = async () => {
      try {
        const res = await NetworkManager.I.request<{ success: boolean; reward?: number }>('/user/watch-ad', { method: 'POST' });
        if (res.success && res.reward) {
          showToast(`🎁 广告奖励：获得 ${res.reward} 矿石`, 'success');
        }
      } catch (e: any) {
        showToast(e?.message || '广告奖励领取失败', 'error');
      }
      cleanup();
      resolve(true);
    };

    // 点击遮罩不关闭（防误操作）
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        showToast('请观看完广告或选择跳过', 'warn');
      }
    };
  });
}

