import { CollisionBox } from '@/engines/Collision/CollisionBox';
import { Collision } from '@/engines/Collision/Сollision';
import { Gravity } from '@/engines/Gravity';
import { Movement } from '@/engines/Movement';
import { BaseView } from '@/entities/BaseView';
import { EnumHeroStates } from '@/entities/hero/Hero';
import { Graphics, PointData } from 'pixi.js';

export abstract class BaseEntity {
  gravity?: Gravity;
  movement?: Movement;
  public collision?: Collision;
  public state?: string | EnumHeroStates;

  public view: BaseView;

  public collisionBox: CollisionBox;
  private readonly collisionBoxGraphics?: Graphics;

  protected constructor(
    view: BaseView,
    position: PointData,
    collisionBoxSettings: {
      collisionBox: CollisionBox;
      isShowCollisionBox: boolean;
    }
  ) {
    this.view = view;
    this.collisionBox = collisionBoxSettings.collisionBox;
    this.collisionBox.x = position.x;
    this.collisionBox.y = position.y;
    this.view.position = position;

    if (collisionBoxSettings.isShowCollisionBox) {
      this.collisionBoxGraphics = new Graphics()
        .rect(
          0,
          0,
          collisionBoxSettings.collisionBox.width,
          collisionBoxSettings.collisionBox.height
        )
        .stroke('#ff0000');
      this.view.addChild(this.collisionBoxGraphics);
    }
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
