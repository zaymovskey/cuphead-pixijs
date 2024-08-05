import { Application } from "pixi.js";
import { Hero } from "@/entities/heroes/Hero.ts";
import { Platform } from "@/entities/platforms/Platform";
import PlatformFactory from "@/entities/platforms/PlatformFactory";

export default class Game {
  private readonly pixiApp: Application;
  private readonly hero: Hero;
  private readonly platforms: Platform[] = [];

  constructor(pixiApp: Application) {
    this.pixiApp = pixiApp;

    const platformFactory = new PlatformFactory(this.pixiApp);

    this.platforms.push(
      platformFactory.createPlatform(
        { x: 0, y: window.innerHeight - 170 },
        { width: window.innerWidth, height: 25 },
      ),
    );
    this.platforms.push(
      platformFactory.createPlatform(
        { x: 400, y: 560 },
        { width: 400, height: 25 },
      ),
    );

    this.hero = new Hero(this.platforms);
    this.hero.position = { x: 200, y: 10 };
    this.pixiApp.stage.addChild(this.hero);
  }

  update() {
    this.hero.completeUpdate();
  }
}
