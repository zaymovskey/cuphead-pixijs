import { CollisionBox } from '@/engines/Collision/CollisionBox';
import { Collision } from '@/engines/Collision/Сollision';
import { Gravity } from '@/engines/Gravity';
import { Movement } from '@/engines/Movement';
import { BaseView } from '@/entities/BaseView';
import { Graphics, PointData } from 'pixi.js';

export abstract class BaseEntity {
  public gravity?: Gravity;
  movement?: Movement;
  public collision?: Collision;
  public state?: string;

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
        .stroke('#0000ff');
      this.view.addChild(this.collisionBoxGraphics);
    }
  }

  protected update() {}

  public completeUpdate(): void {
    this.collisionBox.prevPoint = {
      x: this.collisionBox.x,
      y: this.collisionBox.y,
    };

    this.update();

    this.gravity?.update();
    this.movement?.update();
    this.collision?.update();

    this.view.x = this.collisionBox.x;
    this.view.y = this.collisionBox.y;

    if (this.collisionBoxGraphics) {
      this.collisionBoxGraphics.height = this.collisionBox.height;
      this.collisionBoxGraphics.width = this.collisionBox.width;
    }
  }
}
