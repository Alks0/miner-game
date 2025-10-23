export function spawnFloatText(anchor: Element, text: string, color = '#fff') {
  const rect = anchor.getBoundingClientRect();
  const span = document.createElement('div');
  span.textContent = text;
  span.style.cssText = `position:fixed;left:${rect.left + rect.width - 24}px;top:${rect.top - 6}px;`+
    'transform: translateY(0); transition: all .7s cubic-bezier(.22,.61,.36,1);'+
    'pointer-events:none; z-index:9999; font-weight:700; color:'+color+'; text-shadow:0 0 8px rgba(255,255,255,.25)';
  document.body.appendChild(span);
  requestAnimationFrame(() => {
    span.style.opacity = '0';
    span.style.transform = 'translateY(-24px)';
  });
  setTimeout(() => span.remove(), 800);
}

