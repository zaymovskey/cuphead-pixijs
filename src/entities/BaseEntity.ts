import { Collision } from '@/engines/Collision/Сollision.ts';
import { Gravity } from '@/engines/Gravity';
import { Movement } from '@/engines/Movement';
import { BaseView } from '@/entities/BaseView';
import { EnumHeroStates } from '@/entities/hero/Hero';
import { PointData } from 'pixi.js';

export abstract class BaseEntity {
  gravity?: Gravity;
  movement?: Movement;
  public collision?: Collision;
  public state?: string | EnumHeroStates;

  public view: BaseView;

  protected constructor(view: BaseView, position: PointData) {
    this.view = view;

    this.view.collisionBox.x = position.x;
    this.view.collisionBox.y = position.y;
    this.view.position = position;
  }

  protected update() {}

  public completeUpdate(): void {
    this.view.collisionBox.prevPoint = {
      x: this.view.collisionBox.x,
      y: this.view.collisionBox.y,
    };

    this.gravity?.update();
    this.update();

    this.collision?.update();

    this.view.x = this.view.collisionBox.x;
    this.view.y = this.view.collisionBox.y;
  }
}
