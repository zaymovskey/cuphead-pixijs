import { CollisionBox } from '@/engines/Collision/CollisionBox';
import { Collision } from '@/engines/Collision/Сollision';
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

  public collisionBox: CollisionBox;

  protected constructor(
    view: BaseView,
    position: PointData,
    collisionBox: CollisionBox
  ) {
    this.view = view;
    this.collisionBox = collisionBox;

    this.collisionBox.x = position.x;
    this.collisionBox.y = position.y;
    this.view.position = position;
  }

  protected update() {}

  public completeUpdate(): void {
    this.collisionBox.prevPoint = {
      x: this.collisionBox.x,
      y: this.collisionBox.y,
    };

    this.gravity?.update();
    this.update();

    this.collision?.update();

    this.view.x = this.collisionBox.x;
    this.view.y = this.collisionBox.y;
  }
}
