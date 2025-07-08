import { Bodies, World, engine, width, height } from './engine.js';

export const center = Bodies.rectangle(width/2, height/2, 0, 0, { isStatic: true });
World.add(engine.world, [center]);

export let ground = Bodies.rectangle(
  width / 2,
  height + 30,
  width,
  60,
  { isStatic: true, render: { fillStyle: '#888' } }
);
World.add(engine.world, ground);

export const leftWall = Bodies.rectangle(
  0,
  height / 2,
  60,
  height,
  { isStatic: true, render: { fillStyle: '#888' } }
);
World.add(engine.world, leftWall);

export const rightWall = Bodies.rectangle(
  width,
  height / 2,
  60,
  height,
  { isStatic: true, render: { fillStyle: '#888' } }
);
World.add(engine.world, rightWall);

export function createCircle(x, y, radius = 0.1) {
  const circle = Bodies.circle(x, y, radius, {
    restitution: 0.8,
    density: 0.001
  });
  return circle;
} 