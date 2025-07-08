import { Constraint, World, Composite, engine } from './engine.js';
import { center } from './world.js';

export function connectCenterToCircle(circle, stiffness = 0.0008, damping = 0.001) {
  const constraint = Constraint.create({
    bodyA: center,
    bodyB: circle,
    stiffness,
    damping,
    length: Math.hypot(circle.position.x - center.position.x, circle.position.y - center.position.y),
    render: { visible: false }
  });
  World.add(engine.world, constraint);
  return constraint;
}

export function removeAllCenterConstraints() {
  Composite.allConstraints(engine.world).forEach(constraint => {
    if (constraint.bodyA === center || constraint.bodyB === center) {
      World.remove(engine.world, constraint);
    }
  });
}

export function connectAllCirclesToCenter(stiffness = 0.0008, damping = 0.001) {
  Composite.allBodies(engine.world).forEach(body => {
    if (body !== center && body.circleRadius) {
      // すでにcenterとつながっていない場合のみ追加
      const alreadyConnected = Composite.allConstraints(engine.world).some(constraint =>
        (constraint.bodyA === center && constraint.bodyB === body) ||
        (constraint.bodyB === center && constraint.bodyA === body)
      );
      if (!alreadyConnected) {
        const constraint = Constraint.create({
          bodyA: center,
          bodyB: body,
          stiffness,
          damping,
          length: Math.hypot(body.position.x - center.position.x, body.position.y - center.position.y),
          render: { visible: false }
        });
        World.add(engine.world, constraint);
      }
    }
  });
} 