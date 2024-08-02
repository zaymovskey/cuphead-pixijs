import { Application, Container } from "pixi.js";
import { Hero } from "./entities/Hero.ts";
import { Platform } from "./entities/Platform.ts";

export default class Game {
  private pixiApp: Application;
  private readonly hero: Hero;
  private readonly platforms: Platform[] = [];

  constructor(pixiApp: Application) {
    this.pixiApp = pixiApp;

    const platform1 = new Platform({ width: 500, height: 70 });
    platform1.position = { x: 150, y: 500 };
    this.pixiApp.stage.addChild(platform1);
    this.platforms.push(platform1);

    const platform2 = new Platform({ width: 500, height: 70 });
    platform2.position = { x: 550, y: 600 };
    this.pixiApp.stage.addChild(platform2);
    this.platforms.push(platform2);

    const platform3 = new Platform({ width: 500, height: 70 });
    platform3.position = { x: 1070, y: 550 };
    this.pixiApp.stage.addChild(platform3);
    this.platforms.push(platform3);

    this.hero = new Hero(this.platforms);
    this.hero.position = { x: 200, y: 10 };
    this.pixiApp.stage.addChild(this.hero);
  }

  update() {
    this.hero.executeUpdate();
  }

  isCheckAABB(entity: Container, area: Container) {
    return (
      entity.x + entity.width > area.x &&
      entity.x < area.x + area.width &&
      entity.y + entity.height > area.y &&
      entity.y < area.y + area.height
    );
  }
}
