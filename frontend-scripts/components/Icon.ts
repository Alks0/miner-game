import { html } from '../utils/dom';

export type IconName =
  | 'home'
  | 'warehouse'
  | 'plunder'
  | 'exchange'
  | 'ranking'
  | 'ore'
  | 'coin'
  | 'pick'
  | 'refresh'
  | 'play'
  | 'stop'
  | 'collect'
  | 'wrench'
  | 'shield'
  | 'list'
  | 'user'
  | 'lock'
  | 'eye'
  | 'eye-off'
  | 'sword'
  | 'trophy'
  | 'clock'
  | 'bolt'
  | 'trash'
  | 'close'
  | 'arrow-right'
  | 'target';

function grad(id: string) {
  return `<defs>
    <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7B2CF5" />
      <stop offset="100%" stop-color="#2C89F5" />
    </linearGradient>
  </defs>`;
}

function svgWrap(path: string, size = 18, cls = ''): HTMLElement {
  const gid = 'ig-' + Math.random().toString(36).slice(2, 8);
  const el = html(`<span class="icon ${cls}" aria-hidden="true">${
    `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">${grad(gid)}${path.replaceAll('__GRAD__', `url(#${gid})`)}</svg>`
  }</span>`);
  return el;
}

export function renderIcon(name: IconName, opts: { size?: number; className?: string } = {}) {
  const size = opts.size ?? 18;
  const cls = opts.className ?? '';
  const stroke = 'stroke="__GRAD__" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"';
  const fill = 'fill="__GRAD__"';

  switch (name) {
    case 'home':
      return svgWrap(`<path d="M3 10.5L12 3l9 7.5" ${stroke}/><path d="M5.5 9.5V21h13V9.5" ${stroke}/><path d="M9.5 21v-6h5v6" ${stroke}/>`, size, cls);
    case 'warehouse':
      return svgWrap(`<path d="M3 9l9-5 9 5v9.5c0 1-1 2-2 2H5c-1 0-2-1-2-2V9z" ${stroke}/><path d="M7 12h10M7 16h10" ${stroke}/>`, size, cls);
    case 'plunder':
      return svgWrap(`<path d="M4 20l7-7M13 13l7 7M9 5l6 6M15 5l-6 6" ${stroke}/>`, size, cls);
    case 'exchange':
      return svgWrap(`<path d="M6 8h11l-3-3M18 16H7l3 3" ${stroke}/>`, size, cls);
    case 'ranking':
      return svgWrap(`<path d="M8 14v6M12 10v10M16 6v14" ${stroke}/><path d="M16 4.5a2 2 0 100-4 2 2 0 000 4z" ${fill}/>` , size, cls);
    case 'ore':
      return svgWrap(`<path d="M12 3l6 4-2 8-4 6-4-6-2-8 6-4z" ${stroke}/><path d="M12 3l-2 8 2 10 2-10-2-8z" ${stroke}/>`, size, cls);
    case 'coin':
      return svgWrap(`<circle cx="12" cy="12" r="8.5" ${stroke}/><path d="M8.5 12h7M10 9h4M10 15h4" ${stroke}/>`, size, cls);
    case 'pick':
      return svgWrap(`<path d="M4 5c4-3 9-2 12 1M9 10l-5 5M9 10l2 2M7 12l2 2" ${stroke}/><path d="M11 12l7 7" ${stroke}/>`, size, cls);
    case 'refresh':
      return svgWrap(`<path d="M20 12a8 8 0 10-2.3 5.7" ${stroke}/><path d="M20 12v6h-6" ${stroke}/>`, size, cls);
    case 'play':
      return svgWrap(`<path d="M8 6v12l10-6-10-6z" ${stroke}/>`, size, cls);
    case 'stop':
      return svgWrap(`<rect x="7" y="7" width="10" height="10" rx="2" ${stroke}/>`, size, cls);
    case 'collect':
      return svgWrap(`<path d="M12 5v10" ${stroke}/><path d="M8 11l4 4 4-4" ${stroke}/><path d="M5 19h14" ${stroke}/>`, size, cls);
    case 'wrench':
      return svgWrap(`<path d="M15.5 6a4.5 4.5 0 11-6.9 5.4L3 17l4.6-5.6A4.5 4.5 0 1115.5 6z" ${stroke}/>`, size, cls);
    case 'shield':
      return svgWrap(`<path d="M12 3l8 3v6a10 10 0 01-8 9 10 10 0 01-8-9V6l8-3z" ${stroke}/>`, size, cls);
    case 'list':
      return svgWrap(`<path d="M7 6h12M7 12h12M7 18h12" ${stroke}/><path d="M4 6h.01M4 12h.01M4 18h.01" ${stroke}/>`, size, cls);
    case 'user':
      return svgWrap(`<path d="M12 12a4 4 0 100-8 4 4 0 000 8z" ${stroke}/><path d="M4 20a8 8 0 0116 0" ${stroke}/>`, size, cls);
    case 'lock':
      return svgWrap(`<rect x="5" y="10" width="14" height="10" rx="2" ${stroke}/><path d="M8 10V7a4 4 0 118 0v3" ${stroke}/>`, size, cls);
    case 'eye':
      return svgWrap(`<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" ${stroke}/><circle cx="12" cy="12" r="3" ${stroke}/>`, size, cls);
    case 'eye-off':
      return svgWrap(`<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" ${stroke}/><circle cx="12" cy="12" r="3" ${stroke}/><path d="M3 3l18 18" ${stroke}/>`, size, cls);
    case 'sword':
      return svgWrap(`<path d="M3 21l6-6M9 15l9-9 3 3-9 9M14 6l4 4" ${stroke}/>`, size, cls);
    case 'trophy':
      return svgWrap(`<path d="M8 21h8M9 17h6M7 4h10v5a5 5 0 11-10 0V4z" ${stroke}/><path d="M4 6h3v2a3 3 0 11-3-2zM20 6h-3v2a3 3 0 003-2z" ${stroke}/>`, size, cls);
    case 'clock':
      return svgWrap(`<circle cx="12" cy="12" r="8.5" ${stroke}/><path d="M12 7v6l4 2" ${stroke}/>`, size, cls);
    case 'bolt':
      return svgWrap(`<path d="M13 2L6 14h5l-1 8 7-12h-5l1-8z" ${stroke}/>`, size, cls);
    case 'trash':
      return svgWrap(`<path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13" ${stroke}/>`, size, cls);
    case 'close':
      return svgWrap(`<path d="M6 6l12 12M6 18L18 6" ${stroke}/>`, size, cls);
    case 'arrow-right':
      return svgWrap(`<path d="M4 12h14M12 5l7 7-7 7" ${stroke}/>`, size, cls);
    case 'target':
      return svgWrap(`<circle cx="12" cy="12" r="8.5" ${stroke}/><circle cx="12" cy="12" r="4.5" ${stroke}/><path d="M12 2v3M12 19v3M2 12h3M19 12h3" ${stroke}/>`, size, cls);
    case 'box':
      return svgWrap(`<path d="M12 3l9 5-9 5-9-5 9-5z" ${stroke}/><path d="M3 8v8l9 5 9-5V8" ${stroke}/><path d="M12 13v8" ${stroke}/>`, size, cls);
    case 'info':
      return svgWrap(`<circle cx="12" cy="12" r="8.5" ${stroke}/><path d="M12 10v6" ${stroke}/><path d="M12 7h.01" ${stroke}/>`, size, cls);
    default:
      return svgWrap(`<circle cx="12" cy="12" r="9" ${stroke}/>`, size, cls);
  }
}
