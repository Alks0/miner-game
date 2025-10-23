import { LoginScene } from './scenes/LoginScene';
import { MainScene } from './scenes/MainScene';
import { GameManager } from './core/GameManager';

export async function bootstrap(container: HTMLElement) {
  if (location.hash.startsWith('#/main')) {
    new MainScene().mount(container);
  } else {
    new LoginScene().mount(container);
  }
}

// 便捷启动（网页环境）
if (typeof window !== 'undefined') {
  (window as any).MinerApp = { bootstrap, GameManager };
}


