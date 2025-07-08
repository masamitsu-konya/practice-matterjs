import { Composite } from './engine.js';

export function findNearestEmptyPosition(center, engine, radiusStep = 300, maxRadius = 3000, testRadius = 0.1) {
  for (let r = radiusStep; r <= maxRadius; r += radiusStep) {
    for (let angle = 0; angle < 360; angle += 10) {
      let rad = angle * Math.PI / 180;
      let x = center.x + r * Math.cos(rad);
      let y = center.y + r * Math.sin(rad);
      let found = Matter.Query.region(
        Composite.allBodies(engine.world),
        {
          min: { x: x - testRadius, y: y - testRadius },
          max: { x: x + testRadius, y: y + testRadius }
        }
      );
      if (found.length === 0) {
        return { x, y };
      }
    }
  }
  return null;
} 