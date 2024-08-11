import { BaseEntity } from '@/entities/BaseEntity';
import { Hero } from '@/entities/hero/Hero';
import { Application, PointData } from 'pixi.js';

export class HeroFactory {
  pixiApp: Application;

  constructor(pixiApp: Application) {
    this.pixiApp = pixiApp;
  }

  createHero(collisionEntities: BaseEntity[], position: PointData) {
    const hero = new Hero(collisionEntities, position);
    this.pixiApp.stage.addChild(hero.view);

    return hero;
  }
}
