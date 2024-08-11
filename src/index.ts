import Game from '@/Game';
import { DEFAULT_BACKGROUND_COLOR } from '@/consts/global.ts';
import { Application } from 'pixi.js';

const _pixiApp = new Application();

await _pixiApp.init({
  backgroundColor: DEFAULT_BACKGROUND_COLOR,
  width: window.innerWidth,
  height: window.innerHeight + 1,
});

document.body.appendChild(_pixiApp.canvas);

const game = new Game(_pixiApp);

_pixiApp.ticker.add(game.update, game);
