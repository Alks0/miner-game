export class NetworkManager {
  private static _instance: NetworkManager;
  static get I(): NetworkManager { return this._instance ?? (this._instance = new NetworkManager()); }

  private token: string | null = null;
  
  constructor() {
    // 从 localStorage 恢复 token
    this.token = localStorage.getItem('auth_token');
  }
  
  setToken(t: string | null) { 
    this.token = t;
    if (t) {
      localStorage.setItem('auth_token', t);
    } else {
      localStorage.removeItem('auth_token');
    }
  }
  
  getToken(): string | null {
    return this.token;
  }
  
  clearToken() {
    this.setToken(null);
  }

  async request<T>(path: string, init?: RequestInit): Promise<T> {
    const headers: any = { 'Content-Type': 'application/json', ...(init?.headers || {}) };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
    
    try {
      const res = await fetch(this.getBase() + path, { ...init, headers });
      const json = await res.json();
      
      // 401 未授权，清除 token 并跳转登录
      if (res.status === 401) {
        this.clearToken();
        if (location.hash !== '#/login') {
          location.hash = '#/login';
        }
        throw new Error('登录已过期，请重新登录');
      }
      
      if (!res.ok || json.code >= 400) {
        throw new Error(json.message || 'Request Error');
      }
      
      return json.data as T;
    } catch (error) {
      // 网络错误处理
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('网络连接失败，请检查网络或后端服务');
      }
      throw error;
    }
  }

  getBase(): string {
    return (window as any).__API_BASE__ || 'http://localhost:3000/api';
  }
}


