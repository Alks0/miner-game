import { html } from '../utils/dom';

// 宝箱动画（收矿按钮）
export function createTreasureChest(): HTMLElement {
  return html(`
    <svg class="treasure-chest" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="chestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f6c445"/>
          <stop offset="100%" stop-color="#e36414"/>
        </linearGradient>
      </defs>
      <g class="chest-body">
        <rect x="4" y="12" width="16" height="10" rx="1" fill="url(#chestGrad)" stroke="#b8860b" stroke-width="0.5"/>
        <rect x="6" y="10" width="12" height="3" rx="1" fill="url(#chestGrad)" stroke="#b8860b" stroke-width="0.5" class="chest-lid"/>
        <circle cx="12" cy="17" r="1.5" fill="#fff" opacity="0.8"/>
      </g>
      <g class="chest-coins">
        <circle cx="10" cy="7" r="1.5" fill="#f6c445" class="coin c1"/>
        <circle cx="14" cy="6" r="1.5" fill="#f6c445" class="coin c2"/>
        <circle cx="12" cy="5" r="1.5" fill="#f6c445" class="coin c3"/>
      </g>
    </svg>
  `) as HTMLElement;
}

// 剑气特效（掠夺按钮）
export function createSwordSlash(): HTMLElement {
  return html(`
    <svg class="sword-slash" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="slashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ff5c5c"/>
          <stop offset="100%" stop-color="#e36414"/>
        </linearGradient>
      </defs>
      <path class="slash-trail slash1" d="M6 6 L18 18" stroke="url(#slashGrad)" stroke-width="2" stroke-linecap="round" opacity="0"/>
      <path class="slash-trail slash2" d="M4 8 L16 20" stroke="url(#slashGrad)" stroke-width="1.5" stroke-linecap="round" opacity="0"/>
      <path d="M7 7 L17 17" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity="0.3"/>
    </svg>
  `) as HTMLElement;
}

// 金币旋转（交易所）
export function createSpinningCoin(): HTMLElement {
  return html(`
    <svg class="spinning-coin" width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f6c445"/>
          <stop offset="50%" stop-color="#ffd700"/>
          <stop offset="100%" stop-color="#e36414"/>
        </linearGradient>
      </defs>
      <g class="coin-spin">
        <ellipse cx="16" cy="16" rx="12" ry="12" fill="url(#coinGrad)" stroke="#b8860b" stroke-width="1"/>
        <text x="16" y="20" text-anchor="middle" font-size="12" font-weight="bold" fill="#fff">BB</text>
      </g>
    </svg>
  `) as HTMLElement;
}

// 奖杯动画（排行榜）
export function createTrophyAnimation(rank: number): HTMLElement {
  const colors = {
    1: { primary: '#ffd700', secondary: '#f6c445' }, // 金色
    2: { primary: '#c0c0c0', secondary: '#a8a8a8' }, // 银色
    3: { primary: '#cd7f32', secondary: '#b87333' }, // 铜色
  };
  const color = colors[rank as 1 | 2 | 3] || { primary: '#7B2CF5', secondary: '#2C89F5' };
  
  return html(`
    <svg class="trophy-anim" width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="trophy${rank}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${color.primary}"/>
          <stop offset="100%" stop-color="${color.secondary}"/>
        </linearGradient>
      </defs>
      <g class="trophy-bounce">
        <!-- 杯身 -->
        <path d="M10 8 L10 14 Q10 18 16 18 Q22 18 22 14 L22 8 Z" fill="url(#trophy${rank})" stroke="${color.secondary}" stroke-width="0.5"/>
        <!-- 耳朵 -->
        <path d="M8 10 L8 12 Q8 13 9 13" fill="none" stroke="url(#trophy${rank})" stroke-width="1"/>
        <path d="M24 10 L24 12 Q24 13 23 13" fill="none" stroke="url(#trophy${rank})" stroke-width="1"/>
        <!-- 底座 -->
        <rect x="13" y="18" width="6" height="3" fill="url(#trophy${rank})"/>
        <rect x="11" y="21" width="10" height="2" rx="1" fill="url(#trophy${rank})"/>
        <!-- 星星 -->
        <circle class="trophy-star" cx="16" cy="5" r="1.5" fill="${color.primary}"/>
      </g>
    </svg>
  `) as HTMLElement;
}

// 能量波纹（按钮特效）
export function createEnergyRipple(): HTMLElement {
  return html(`
    <svg class="energy-ripple" width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0;pointer-events:none;">
      <circle class="ripple r1" cx="50" cy="50" r="20" fill="none" stroke="rgba(123,44,245,0.6)" stroke-width="2"/>
      <circle class="ripple r2" cx="50" cy="50" r="20" fill="none" stroke="rgba(44,137,245,0.4)" stroke-width="2"/>
      <circle class="ripple r3" cx="50" cy="50" r="20" fill="none" stroke="rgba(246,196,69,0.3)" stroke-width="2"/>
    </svg>
  `) as HTMLElement;
}

// 装载进度粒子流
export function createLoadingParticles(): HTMLElement {
  return html(`
    <svg class="loading-particles" width="100%" height="12" viewBox="0 0 400 12" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0;pointer-events:none;">
      <circle class="particle part1" cx="0" cy="6" r="2" fill="#7B2CF5"/>
      <circle class="particle part2" cx="0" cy="6" r="1.5" fill="#2C89F5"/>
      <circle class="particle part3" cx="0" cy="6" r="2" fill="#f6c445"/>
    </svg>
  `) as HTMLElement;
}

