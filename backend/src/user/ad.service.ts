import { Injectable } from '@nestjs/common';

@Injectable()
export class AdService {
  // 记录用户观看广告的时间戳，防止作弊
  private adWatchHistory: Map<string, number[]> = new Map();

  // 模拟观看广告（占位符）
  watchAd(userId: string): { success: boolean; reward?: number } {
    console.log(`[AdService] User ${userId} watching ad (placeholder)`);
    
    // 记录观看时间
    const history = this.adWatchHistory.get(userId) || [];
    history.push(Date.now());
    
    // 只保留最近10次记录
    if (history.length > 10) {
      history.shift();
    }
    this.adWatchHistory.set(userId, history);
    
    // 占位符：模拟观看成功，可选奖励（5-15矿石）
    const reward = Math.floor(Math.random() * 11) + 5;
    
    return { success: true, reward };
  }

  // 检查最近是否观看过广告（防止频繁刷广告）
  canWatchAd(userId: string): boolean {
    const history = this.adWatchHistory.get(userId) || [];
    if (history.length === 0) return true;
    
    const lastWatchTime = history[history.length - 1];
    const now = Date.now();
    
    // 至少间隔30秒才能再次观看
    return now - lastWatchTime > 30000;
  }
}

