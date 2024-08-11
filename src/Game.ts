import { Hero } from '@/entities/heroes/Hero.ts';
import { HeroFactory } from '@/entities/heroes/HeroFactory.ts';
import { Platform } from '@/entities/platforms/Platform';
import PlatformFactory from '@/entities/platforms/PlatformFactory';
import { Application } from 'pixi.js';

export default class Game {
  private readonly pixiApp: Application;
  private readonly hero: Hero;
  private readonly platforms: Platform[] = [];

  constructor(pixiApp: Application) {
    this.pixiApp = pixiApp;

    const platformFactory = new PlatformFactory(this.pixiApp);
    this.platforms.push(
      platformFactory.createPlatform(
        { x: 0, y: 750 },
        { width: window.innerWidth, height: 25 }
      )
    );
    this.platforms.push(
      platformFactory.createPlatform(
        { x: 400, y: 600 },
        { width: 400, height: 25 }
      )
    );

    const heroFactory = new HeroFactory(this.pixiApp);
    this.hero = heroFactory.createHero(this.platforms, { x: 200, y: 10 });
  }

  update() {
    this.hero.completeUpdate();
  }
}
