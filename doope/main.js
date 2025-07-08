import { render, runner, engine } from './engine.js';
import './ui.js';

Matter.Render.run(render);
Matter.Runner.run(runner, engine); 