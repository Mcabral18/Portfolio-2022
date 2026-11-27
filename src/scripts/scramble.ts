/** Cycles through `data-roles` with a "decoding" scramble transition. */
export function initScramble(el: HTMLElement, interval = 3200) {
  const roles: string[] = JSON.parse(el.dataset.roles ?? '[]');
  if (roles.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const glyphs = '!<>-_\\/[]{}—=+*^?#01';
  let index = 0;
  let frame = 0;
  let raf = 0;

  // Keep the announced text stable for screen readers
  el.setAttribute('aria-label', roles.join(', '));

  const scrambleTo = (next: string) => {
    const from = el.textContent ?? '';
    const length = Math.max(from.length, next.length);
    const queue = Array.from({ length }, (_, i) => {
      const start = Math.floor(Math.random() * 16);
      return { from: from[i] ?? '', to: next[i] ?? '', start, end: start + 8 + Math.floor(Math.random() * 18) };
    });
    frame = 0;
    cancelAnimationFrame(raf);

    const update = () => {
      let out = '';
      let done = 0;
      for (const q of queue) {
        if (frame >= q.end) {
          done++;
          out += q.to;
        } else if (frame >= q.start) {
          out += glyphs[Math.floor(Math.random() * glyphs.length)];
        } else {
          out += q.from;
        }
      }
      el.textContent = out;
      if (done < queue.length) {
        frame++;
        raf = requestAnimationFrame(update);
      }
    };
    update();
  };

  setInterval(() => {
    if (document.hidden) return;
    index = (index + 1) % roles.length;
    scrambleTo(roles[index]);
  }, interval);
}
