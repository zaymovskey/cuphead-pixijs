import { BaseEntity } from '@/entities/BaseEntity.ts';
import { Hero } from '@/entities/heroes/Hero.ts';
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
