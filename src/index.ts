import { Application } from "pixi.js";
import Game from "./Game.ts";

const _pixiApp = new Application();

await _pixiApp.init({
  backgroundColor: "#414141",
  width: window.innerWidth,
  height: window.innerHeight,
});

document.body.appendChild(_pixiApp.canvas);

const game = new Game(_pixiApp);

_pixiApp.ticker.add(game.update, game);
