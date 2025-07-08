export const { Engine, Render, Runner, Bodies, World, Events, Composite, Constraint, Detector } = Matter;

export const width = window.innerWidth;
export const height = window.innerHeight;

export const engine = Engine.create({
  gravity: { x: 0, y: 0, scale: 0.001 },
  enableSleeping: true,
  constraintIterations: 20,
  positionIterations: 20,
  velocityIterations: 10,
  timing: { timeScale: 1 },
  detector: Detector.create()
});

export const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    showSleeping: true,
    wireframes: false,
    width,
    height
  }
});

export const runner = Runner.create(); 