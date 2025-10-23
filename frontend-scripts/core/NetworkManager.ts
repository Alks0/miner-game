export class NetworkManager {
  private static _instance: NetworkManager;
  static get I(): NetworkManager { return this._instance ?? (this._instance = new NetworkManager()); }

  private token: string | null = null;
  setToken(t: string | null) { this.token = t; }

  async request<T>(path: string, init?: RequestInit): Promise<T> {
    const headers: any = { 'Content-Type': 'application/json', ...(init?.headers || {}) };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
    const res = await fetch(this.getBase() + path, { ...init, headers });
    const json = await res.json();
    if (!res.ok || json.code >= 400) throw new Error(json.message || 'Request Error');
    return json.data as T;
  }

  getBase(): string {
    return (window as any).__API_BASE__ || 'http://localhost:3000/api';
  }
}


