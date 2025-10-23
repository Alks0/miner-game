import { Injectable } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(private readonly gateway: NotificationGateway) {}

  emitToUser(userId: string, event: string, data: any) {
    this.gateway.emitToUser(userId, event, data);
  }

  broadcast(event: string, data: any) {
    this.gateway.broadcast(event, data);
  }
}
