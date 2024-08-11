import { Gravity } from '@/engines/Gravity';
import { Movement } from '@/engines/Movement';
import { Collision } from '@/engines/Сollision.ts';
import { BaseView } from '@/entities/BaseView.ts';
import { EnumHeroStates } from '@/entities/heroes/Hero.ts';
import { PointData } from 'pixi.js';

export abstract class BaseEntity {
  gravity?: Gravity;
  movement?: Movement;
  public collision?: Collision;
  public state?: string | EnumHeroStates;

  public view: BaseView;

  protected constructor(view: BaseView, position: PointData) {
    this.view = view;

    this.view.hitBox.x = position.x;
    this.view.hitBox.y = position.y;
    this.view.position = position;
  }

  protected update() {}

  public completeUpdate(): void {
    this.view.hitBox.prevPoint = {
      x: this.view.hitBox.x,
      y: this.view.hitBox.y,
    };

    this.gravity?.update();
    this.update();

    this.collision?.update();

    this.view.x = this.view.hitBox.x;
    this.view.y = this.view.hitBox.y;
  }
}
