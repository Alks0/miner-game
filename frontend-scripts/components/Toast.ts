import { renderIcon } from './Icon';

let _box: HTMLElement | null = null;

function ensureBox(): HTMLElement {
  if (_box) return _box;
  const div = document.createElement('div');
  div.className = 'toast-wrap';
  document.body.appendChild(div);
  _box = div;
  return div;
}

type ToastType = 'info' | 'success' | 'warn' | 'error';
type ToastOptions = { type?: ToastType; duration?: number };

export function showToast(text: string, opts?: ToastType | ToastOptions) {
  const box = ensureBox();
  const item = document.createElement('div');
  let type: ToastType | undefined;
  let duration = 3500;
  if (typeof opts === 'string') type = opts;
  else if (opts) { type = opts.type; if (opts.duration) duration = opts.duration; }
  item.className = 'toast' + (type ? ' ' + type : '');
  // icon + text container
  try {
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.gap = '8px';
    wrap.style.alignItems = 'center';
    const icoName = type === 'success' ? 'bolt' : type === 'warn' ? 'clock' : type === 'error' ? 'close' : 'info';
    const icoHost = document.createElement('span');
    icoHost.appendChild(renderIcon(icoName, { size: 18 }));
    const txt = document.createElement('div');
    txt.textContent = text;
    wrap.appendChild(icoHost);
    wrap.appendChild(txt);
    item.appendChild(wrap);
  } catch {
    item.textContent = text;
  }
  const life = document.createElement('i');
  life.className = 'life';
  life.style.setProperty('--life', duration + 'ms');
  item.appendChild(life);
  box.prepend(item);
  // graceful exit
  const fade = () => { item.style.opacity = '0'; item.style.transition = 'opacity .45s'; setTimeout(() => item.remove(), 460); };
  const timer = window.setTimeout(fade, duration);
  item.addEventListener('click', () => { clearTimeout(timer); fade(); });
}
