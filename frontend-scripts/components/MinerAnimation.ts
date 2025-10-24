import { html } from '../utils/dom';

export function createMinerAnimation(): HTMLElement {
  const container = html(`
    <div class="miner-animation">
      <svg class="miner-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="minerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#7B2CF5" />
            <stop offset="100%" stop-color="#2C89F5" />
          </linearGradient>
          <filter id="minerGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <!-- 矿工身体 -->
        <g class="miner-body">
          <!-- 头盔 -->
          <ellipse cx="100" cy="70" rx="20" ry="18" fill="url(#minerGrad)" filter="url(#minerGlow)"/>
          <circle cx="100" cy="65" r="8" fill="#f6c445" opacity="0.9" class="miner-light"/>
          
          <!-- 身体 -->
          <rect x="85" y="85" width="30" height="35" rx="5" fill="url(#minerGrad)" opacity="0.8"/>
          
          <!-- 手臂（挥动） -->
          <g class="miner-arm">
            <line x1="110" y1="95" x2="130" y2="85" stroke="url(#minerGrad)" stroke-width="6" stroke-linecap="round"/>
            <!-- 镐子 -->
            <g class="miner-pickaxe">
              <line x1="130" y1="85" x2="145" y2="70" stroke="#f6c445" stroke-width="3" stroke-linecap="round"/>
              <polygon points="145,70 155,65 150,75" fill="#888" stroke="#666" stroke-width="1"/>
            </g>
          </g>
          
          <!-- 腿 -->
          <rect x="90" y="120" width="8" height="20" rx="3" fill="url(#minerGrad)" opacity="0.7"/>
          <rect x="102" y="120" width="8" height="20" rx="3" fill="url(#minerGrad)" opacity="0.7"/>
        </g>
        
        <!-- 矿石粒子 -->
        <circle class="ore-particle p1" cx="140" cy="100" r="3" fill="#7B2CF5" opacity="0"/>
        <circle class="ore-particle p2" cx="145" cy="105" r="2" fill="#2C89F5" opacity="0"/>
        <circle class="ore-particle p3" cx="135" cy="108" r="2.5" fill="#f6c445" opacity="0"/>
      </svg>
      <div class="miner-status">挖矿中...</div>
    </div>
  `) as HTMLElement;
  
  return container;
}

export function createIdleMiner(): HTMLElement {
  const container = html(`
    <div class="miner-idle">
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="idleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#7B2CF5" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="#2C89F5" stop-opacity="0.6"/>
          </linearGradient>
        </defs>
        
        <!-- 简单的矿工剪影 -->
        <g class="idle-miner">
          <circle cx="60" cy="40" r="12" fill="url(#idleGrad)"/>
          <rect x="50" y="50" width="20" height="25" rx="3" fill="url(#idleGrad)" opacity="0.8"/>
          <line x1="65" y1="60" x2="75" y2="55" stroke="url(#idleGrad)" stroke-width="4" stroke-linecap="round"/>
          <line x1="75" y1="55" x2="85" y2="50" stroke="#f6c445" stroke-width="2" stroke-linecap="round"/>
        </g>
      </svg>
      <div class="miner-status" style="opacity:.6;">待机中</div>
    </div>
  `) as HTMLElement;
  
  return container;
}

