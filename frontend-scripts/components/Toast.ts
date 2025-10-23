let _box: HTMLElement | null = null;

function ensureBox(): HTMLElement {
  if (_box) return _box;
  const div = document.createElement('div');
  div.style.cssText = 'position:fixed;right:16px;bottom:16px;display:flex;flex-direction:column;gap:8px;z-index:9999;';
  document.body.appendChild(div);
  _box = div;
  return div;
}

export function showToast(text: string) {
  const box = ensureBox();
  const item = document.createElement('div');
  item.textContent = text;
  item.style.cssText = 'max-width:320px;padding:10px 12px;border-radius:10px;color:#fff;background:rgba(30,30,50,.9);box-shadow:0 8px 20px rgba(0,0,0,.35),0 0 12px rgba(123,44,245,.7);';
  box.prepend(item);
  setTimeout(() => { item.style.opacity = '0'; item.style.transition = 'opacity .5s'; setTimeout(() => item.remove(), 500); }, 3500);
}

