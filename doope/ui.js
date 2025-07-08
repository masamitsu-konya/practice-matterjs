import { engine, render, width, height } from './engine.js';
import { center, ground, createCircle } from './world.js';
import { connectCenterToCircle, removeAllCenterConstraints } from './constraints.js';
import { animateNumber } from './animation.js';
import { findNearestEmptyPosition } from './utils.js';
import { World, Composite, Events } from './engine.js';

let isGravityOn = false;

// サークル追加ボタン
const addBtn = document.getElementById('addCircleBtn');
addBtn.addEventListener('click', function() {
  var centerPos = { x: width/2, y: height/2 };
  var pos = findNearestEmptyPosition(centerPos, engine, 5, 500, 0.1) || centerPos;
  var circle = createCircle(pos.x, pos.y);
  circle.growFrame = 0;
  circle.growDuration = 40;
  circle.targetRadius = 40;
  World.add(engine.world, circle);
  connectCenterToCircle(circle);

  // stiffnessアニメーション
  var allConstraints = Composite.allConstraints(engine.world);
  animateNumber(0.0008, 0, 2000, function(val) {
    allConstraints.forEach(function(c) {
      c.stiffness = val;
    });
  }, null, d3.easeCircleOut);876uyhgb
});

// 重力ON/OFFボタン
const gravityBtn = document.getElementById('gravityBtn');
gravityBtn.addEventListener('click', function() {
  isGravityOn = !isGravityOn;
  if (isGravityOn) {
    gravityBtn.textContent = '重力OFF';
    removeAllCenterConstraints();
    engine.gravity.x = 0;
    engine.gravity.y = 1;
    engine.gravity.scale = 0.001;
  } else {
    gravityBtn.textContent = '重力ON';
    engine.gravity.x = 0;
    engine.gravity.y = 0;
    engine.gravity.scale = 0.001;
    // centerと各サークルをConstraintでつなぐ
    var newConstraints = [];
    Composite.allBodies(engine.world).forEach(function(body) {
      if (body !== center && body.circleRadius) {
        var alreadyConnected = Composite.allConstraints(engine.world).some(function(constraint) {
          return (constraint.bodyA === center && constraint.bodyB === body) || (constraint.bodyB === center && constraint.bodyA === body);
        });
        if (!alreadyConnected) {
          var constraint = connectCenterToCircle(body);
          newConstraints.push(constraint);
        }
      }
    });
    animateNumber(0.0008, 0, 2000, function(val) {
      newConstraints.forEach(function(c) {
        c.stiffness = val;
      });
    }, null, d3.easeCircleOut);
  }
});

// afterUpdateで拡大アニメーション
Events.on(engine, 'afterUpdate', function() {
  Composite.allBodies(engine.world).forEach(function(body) {
    if (body.growFrame !== undefined && body.growFrame < body.growDuration) {
      body.growFrame++;
      var t = body.growFrame / body.growDuration;
      var scale = (d3.easeElasticOut(t) * body.targetRadius) / body.circleRadius;
      if (scale > 0 && isFinite(scale)) {
        Matter.Body.scale(body, scale, scale);
      }
      if (body.growFrame === body.growDuration) {
        var finalScale = body.targetRadius / body.circleRadius;
        Matter.Body.scale(body, finalScale, finalScale);
        delete body.growFrame;
        delete body.growDuration;
        delete body.targetRadius;
      }
    }
  });
});

// ウィンドウリサイズ時
window.addEventListener('resize', function() {
  var width = window.innerWidth;
  var height = window.innerHeight;
  render.canvas.width = width;
  render.canvas.height = height;
  render.options.width = width;
  render.options.height = height;
  Matter.Body.setPosition(ground, { x: width / 2, y: height + 30 });
  Matter.Body.scale(ground, width / (ground.bounds.max.x - ground.bounds.min.x), 1);
}); 