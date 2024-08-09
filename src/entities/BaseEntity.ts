import { Gravity } from '@/engines/Gravity';
import { Movement } from '@/engines/Movement';
import { Collision } from '@/engines/Сollision.ts';
import { EnumHeroStates } from '@/entities/heroes/Hero.ts';
import { Container, PointData } from 'pixi.js';

export interface IHitBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export abstract class BaseEntity {
  gravity?: Gravity;
  movement?: Movement;
  public collision?: Collision;
  public state?: string | EnumHeroStates;
  public prevPoint: PointData = {
    x: 0,
    y: 0,
  };
  public hitBox?: IHitBox;
  public view: Container;

  protected constructor(view: Container) {
    this.view = view;
  }

  protected update() {}

  public completeUpdate(): void {
    this.prevPoint = {
      x: this.view.x,
      y: this.view.y,
    };

    this.gravity?.update();
    this.update();

    if (this.hitBox) {
      this.hitBox.x = this.view.x;
      this.hitBox.y = this.view.y;
    }

    this.collision?.update();
  }
}
