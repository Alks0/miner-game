export class CountUpText {
  private value = 0;
  private display = '0';
  private anim?: number;
  onUpdate?: (text: string) => void;

  set(n: number) {
    this.value = n;
    this.display = this.format(n);
    this.onUpdate?.(this.display);
  }

  to(n: number, duration = 500) {
    cancelAnimationFrame(this.anim!);
    const start = this.value;
    const delta = n - start;
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const ease = 1 - Math.pow(1 - p, 3);
      const curr = start + delta * ease;
      this.display = this.format(curr);
      this.onUpdate?.(this.display);
      if (p < 1) this.anim = requestAnimationFrame(step);
      else this.value = n;
    };
    this.anim = requestAnimationFrame(step);
  }

  private format(n: number) {
    return Math.floor(n).toLocaleString();
  }
}


