import { WS_ENDPOINT } from './Env';

type Handler = (data: any) => void;

export class RealtimeClient {
  private static _instance: RealtimeClient;
  static get I(): RealtimeClient {
    return this._instance ?? (this._instance = new RealtimeClient());
  }

  private socket: any | null = null;
  private handlers: Record<string, Handler[]> = {};

  connect(token: string) {
    const w = window as any;
    if (w.io) {
      // 如果已连接且token相同，不重复连接
      if (this.socket && (this.socket.connected || this.socket.connecting)) {
        return;
      }
      
      // 断开旧连接
      if (this.socket) {
        try {
          this.socket.disconnect();
        } catch (e) {
          console.warn('[RealtimeClient] Disconnect error:', e);
        }
      }
      
      // 建立新连接
      this.socket = w.io(WS_ENDPOINT, { auth: { token } });
      
      this.socket.on('connect', () => {
        console.log('[RealtimeClient] Connected to WebSocket');
      });
      
      this.socket.on('disconnect', () => {
        console.log('[RealtimeClient] Disconnected from WebSocket');
      });
      
      this.socket.on('connect_error', (error: any) => {
        console.error('[RealtimeClient] Connection error:', error);
      });
      
      this.socket.onAny((event: string, payload: any) => {
        console.log('[RealtimeClient] Event received:', event, payload);
        this.emitLocal(event, payload);
      });
    } else {
      // socket.io client not loaded; disable realtime updates
      console.warn('[RealtimeClient] socket.io not loaded');
      this.socket = null;
    }
  }

  on(event: string, handler: Handler) {
    (this.handlers[event] ||= []).push(handler);
  }

  off(event: string, handler: Handler) {
    const arr = this.handlers[event];
    if (!arr) return;
    const idx = arr.indexOf(handler);
    if (idx >= 0) arr.splice(idx, 1);
  }

  private emitLocal(event: string, payload: any) {
    (this.handlers[event] || []).forEach((h) => h(payload));
  }
}
