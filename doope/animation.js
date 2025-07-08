export function animateNumber(from, to, duration, onUpdate, onComplete, easing) {
  const start = performance.now();
  easing = easing || function(t) { return t; };
  function step(now) {
    const elapsed = now - start;
    const t = Math.min(elapsed / duration, 1);
    const easedT = easing(t);
    const current = from + (to - from) * easedT;
    onUpdate(current);
    if (t < 1) {
      requestAnimationFrame(step);
    } else if (onComplete) {
      onComplete();
    }
  }
  requestAnimationFrame(step);
} 