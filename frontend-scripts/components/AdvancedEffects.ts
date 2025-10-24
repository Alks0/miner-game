import { html } from '../utils/dom';

// SVG液体/熔岩效果滤镜
export function createLiquidFilter(): string {
  return `
    <svg width="0" height="0" style="position:absolute;">
      <defs>
        <filter id="liquid-goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
        
        <filter id="neon-glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <filter id="lightning-glow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
          <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 10 -3" result="intense"/>
          <feComposite in="SourceGraphic" in2="intense" operator="over"/>
        </filter>
        
        <filter id="magic-circle">
          <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="2" result="turbulence"/>
          <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="15" xChannelSelector="R" yChannelSelector="G"/>
          <feGaussianBlur stdDeviation="1"/>
        </filter>
      </defs>
    </svg>
  `;
}

// 能量闪电特效
export function createLightningBolt(): HTMLElement {
  return html(`
    <svg class="lightning-effect" width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lightningGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f6c445"/>
          <stop offset="50%" stop-color="#fff"/>
          <stop offset="100%" stop-color="#2C89F5"/>
        </linearGradient>
        <filter id="lightningGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <g class="lightning-group" opacity="0">
        <path class="bolt bolt-1" d="M100 20 L85 100 L110 100 L95 180" stroke="url(#lightningGrad)" stroke-width="3" fill="none" stroke-linecap="round" filter="url(#lightningGlow)"/>
        <path class="bolt bolt-2" d="M95 30 L82 95 L105 95 L92 170" stroke="#fff" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.6"/>
      </g>
    </svg>
  `) as HTMLElement;
}

// 魔法阵效果
export function createMagicCircle(): HTMLElement {
  return html(`
    <svg class="magic-circle" width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="magicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#7B2CF5" stop-opacity="0.6"/>
          <stop offset="50%" stop-color="#2C89F5" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#f6c445" stop-opacity="0.6"/>
        </linearGradient>
      </defs>
      
      <!-- 外圈 -->
      <circle class="magic-ring ring-1" cx="150" cy="150" r="140" fill="none" stroke="url(#magicGrad)" stroke-width="1" opacity="0.3"/>
      <circle class="magic-ring ring-2" cx="150" cy="150" r="120" fill="none" stroke="url(#magicGrad)" stroke-width="0.5" opacity="0.4"/>
      <circle class="magic-ring ring-3" cx="150" cy="150" r="100" fill="none" stroke="url(#magicGrad)" stroke-width="0.5" opacity="0.5"/>
      
      <!-- 符文 -->
      <g class="runes">
        <circle cx="150" cy="30" r="3" fill="#7B2CF5" opacity="0.8" class="rune r1"/>
        <circle cx="270" cy="150" r="3" fill="#2C89F5" opacity="0.8" class="rune r2"/>
        <circle cx="150" cy="270" r="3" fill="#f6c445" opacity="0.8" class="rune r3"/>
        <circle cx="30" cy="150" r="3" fill="#7B2CF5" opacity="0.8" class="rune r4"/>
      </g>
      
      <!-- 中心星星 -->
      <g class="center-star">
        <path d="M150 140 L155 150 L150 160 L145 150 Z" fill="url(#magicGrad)" opacity="0.6"/>
        <path d="M140 150 L150 155 L160 150 L150 145 Z" fill="url(#magicGrad)" opacity="0.6"/>
      </g>
    </svg>
  `) as HTMLElement;
}

// 星空背景
export function createStarfield(): HTMLElement {
  const stars: string[] = [];
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = Math.random() * 2 + 0.5;
    const delay = Math.random() * 3;
    const duration = Math.random() * 2 + 2;
    stars.push(`<circle cx="${x}%" cy="${y}%" r="${size}" fill="#fff" opacity="0" class="star" style="animation-delay:${delay}s;animation-duration:${duration}s"/>`);
  }
  
  return html(`
    <svg class="starfield" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0;pointer-events:none;z-index:0;">
      ${stars.join('')}
    </svg>
  `) as HTMLElement;
}

// 能量脉冲波
export function createEnergyPulse(): HTMLElement {
  return html(`
    <svg class="energy-pulse" width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0;pointer-events:none;">
      <defs>
        <radialGradient id="pulseGrad">
          <stop offset="0%" stop-color="#7B2CF5" stop-opacity="0.8"/>
          <stop offset="50%" stop-color="#2C89F5" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="transparent"/>
        </radialGradient>
      </defs>
      <circle class="pulse-wave wave-1" cx="100" cy="100" r="10" fill="url(#pulseGrad)" opacity="0"/>
      <circle class="pulse-wave wave-2" cx="100" cy="100" r="10" fill="url(#pulseGrad)" opacity="0"/>
      <circle class="pulse-wave wave-3" cx="100" cy="100" r="10" fill="url(#pulseGrad)" opacity="0"/>
    </svg>
  `) as HTMLElement;
}

// 数据流效果
export function createDataStream(): HTMLElement {
  const streams: string[] = [];
  for (let i = 0; i < 5; i++) {
    const x = 20 + i * 20;
    const delay = i * 0.3;
    streams.push(`
      <g class="data-stream" style="animation-delay:${delay}s">
        <line x1="${x}" y1="0" x2="${x}" y2="100" stroke="url(#streamGrad)" stroke-width="1" opacity="0.6" stroke-dasharray="5 10"/>
      </g>
    `);
  }
  
  return html(`
    <svg class="data-streams" width="100%" height="100" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0;pointer-events:none;">
      <defs>
        <linearGradient id="streamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="transparent"/>
          <stop offset="50%" stop-color="#2C89F5" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="transparent"/>
        </linearGradient>
      </defs>
      ${streams.join('')}
    </svg>
  `) as HTMLElement;
}

