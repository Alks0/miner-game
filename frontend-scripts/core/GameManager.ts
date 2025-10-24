import { NetworkManager } from './NetworkManager';

export type Profile = { id: string; username: string; nickname: string; oreAmount: number; bbCoins: number };

export class GameManager {
  private static _instance: GameManager;
  static get I(): GameManager { return this._instance ?? (this._instance = new GameManager()); }

  private profile: Profile | null = null;
  getProfile(): Profile | null { return this.profile; }

  async loginOrRegister(username: string, password: string): Promise<void> {
    const nm = NetworkManager.I;
    try {
      const r = await nm.request<{ access_token: string; user: any }>('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) });
      nm.setToken(r.access_token);
    } catch {
      const r = await NetworkManager.I.request<{ access_token: string; user: any }>('/auth/register', { method: 'POST', body: JSON.stringify({ username, password }) });
      NetworkManager.I.setToken(r.access_token);
    }
    this.profile = await nm.request<Profile>('/user/profile');
  }

  async tryRestoreSession(): Promise<boolean> {
    const nm = NetworkManager.I;
    const token = nm.getToken();
    if (!token) return false;
    
    try {
      this.profile = await nm.request<Profile>('/user/profile');
      return true;
    } catch {
      // Token 失效，清除
      nm.clearToken();
      return false;
    }
  }

  logout() {
    NetworkManager.I.clearToken();
    this.profile = null;
    location.hash = '#/login';
  }
}


