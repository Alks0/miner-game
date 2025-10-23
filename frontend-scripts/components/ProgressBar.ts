export class ProgressBar {
  private value = 0;
  constructor(private onUpdate: (pct: number) => void) {}
  set(pct: number) { this.value = Math.max(0, Math.min(1, pct)); this.onUpdate(this.value); }
}


