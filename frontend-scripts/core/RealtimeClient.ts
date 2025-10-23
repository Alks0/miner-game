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
      if (this.socket && (this.socket.connected || this.socket.connecting)) return;
      this.socket = w.io(WS_ENDPOINT, { auth: { token } });
      this.socket.on('connect', () => {});
      this.socket.onAny((event: string, payload: any) => this.emitLocal(event, payload));
    } else {
      // socket.io client not loaded; disable realtime updates
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
