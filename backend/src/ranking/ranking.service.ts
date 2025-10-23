import { Injectable } from '@nestjs/common';

@Injectable()
export class RankingService {
  private score: Map<string, number> = new Map();

  addScore(userId: string, delta: number) {
    const v = (this.score.get(userId) || 0) + delta;
    this.score.set(userId, v);
  }

  getScore(userId: string) {
    return this.score.get(userId) || 0;
  }

  top(n: number) {
    const entries = Array.from(this.score.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([userId, score], idx) => ({ rank: idx + 1, userId, score }));
    return entries;
  }

  myRank(userId: string) {
    const sorted = Array.from(this.score.entries()).sort((a, b) => b[1] - a[1]);
    const idx = sorted.findIndex(([u]) => u === userId);
    return { rank: idx >= 0 ? idx + 1 : 0, score: this.getScore(userId) };
  }
}


