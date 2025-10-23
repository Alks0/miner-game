export function html(template: string): HTMLElement {
  const div = document.createElement('div');
  div.innerHTML = template.trim();
  return div.firstElementChild as HTMLElement;
}

export function qs<T extends Element = HTMLElement>(root: ParentNode, sel: string): T {
  const el = root.querySelector(sel) as T | null;
  if (!el) throw new Error(`Missing element: ${sel}`);
  return el as T;
}


