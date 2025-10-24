import { LoginScene } from './scenes/LoginScene';
import { MainScene } from './scenes/MainScene';
import { GameManager } from './core/GameManager';
import { WarehouseScene } from './scenes/WarehouseScene';
import { PlunderScene } from './scenes/PlunderScene';
import { ExchangeScene } from './scenes/ExchangeScene';
import { RankingScene } from './scenes/RankingScene';
import { ensureGlobalStyles } from './styles/inject';

function routeTo(container: HTMLElement) {
  const h = location.hash || '#/login';
  const scene = h.split('?')[0];
  switch (scene) {
    case '#/main':
      new MainScene().mount(container);
      break;
    case '#/warehouse':
      new WarehouseScene().mount(container);
      break;
    case '#/plunder':
      new PlunderScene().mount(container);
      break;
    case '#/exchange':
      new ExchangeScene().mount(container);
      break;
    case '#/ranking':
      new RankingScene().mount(container);
      break;
    default:
      new LoginScene().mount(container);
  }
}

export async function bootstrap(container: HTMLElement) {
  // 立即注入样式，避免FOUC（闪烁）
  ensureGlobalStyles();
  
  // 使用 requestAnimationFrame 确保样式已应用
  requestAnimationFrame(() => {
    routeTo(container);
  });
  
  window.onhashchange = () => routeTo(container);
}

// 便捷启动（网页环境）
if (typeof window !== 'undefined') {
  (window as any).MinerApp = { bootstrap, GameManager };
}


