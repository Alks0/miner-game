import { WS_ENDPOINT } from './Env';

type Handler = (data: any) => void;

export class RealtimeClient {
  private static _instance: RealtimeClient;
  static get I(): RealtimeClient { return this._instance ?? (this._instance = new RealtimeClient()); }

  private socket: any | null = null;
  private handlers: Record<string, Handler[]> = {};

  connect(token: string) {
    const w: any = window as any;
    if (w.io) {
      this.socket = w.io(WS_ENDPOINT, { auth: { token } });
      this.socket.on('connect', () => {});
      this.socket.onAny((event: string, payload: any) => this.emitLocal(event, payload));
    } else {
      // 未引入 socket.io 客户端时，降级为无推送
      this.socket = null;
    }
  }

  on(event: string, handler: Handler) {
    (this.handlers[event] ||= []).push(handler);
  }

  private emitLocal(event: string, payload: any) {
    (this.handlers[event] || []).forEach(h => h(payload));
  }
}


