import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/game' })
@Injectable()
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSocketMap: Map<string, string> = new Map();

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = (client.handshake.auth?.token as string) || '';
      if (token) {
        const payload = this.jwtService.verify(token);
        const userId = payload.sub as string;
        this.userSocketMap.set(userId, client.id);
        (client.data as any).userId = userId;
      }
    } catch (e) {
      // 无 token 或校验失败，允许匿名连接但不建立用户映射
    }
  }

  handleDisconnect(client: Socket) {
    const userId = (client.data as any)?.userId as string | undefined;
    if (userId) {
      this.userSocketMap.delete(userId);
    }
  }

  emitToUser(userId: string, event: string, data: any) {
    const socketId = this.userSocketMap.get(userId);
    if (socketId) {
      this.server.to(socketId).emit(event, data);
    }
  }

  broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }
}
