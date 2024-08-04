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
        { x: 150, y: 500 },
        { width: 500, height: 70 },
      ),
    );
    this.platforms.push(
      platformFactory.createPlatform(
        { x: 150, y: 300 },
        { width: 500, height: 70 },
      ),
    );
    this.platforms.push(
      platformFactory.createPlatform(
        { x: 550, y: 600 },
        { width: 500, height: 70 },
      ),
    );
    this.platforms.push(
      platformFactory.createPlatform(
        { x: 1070, y: 550 },
        { width: 500, height: 70 },
      ),
    );
    this.platforms.push(
      platformFactory.createPlatform(
        { x: 1070, y: 350 },
        { width: 500, height: 70 },
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
