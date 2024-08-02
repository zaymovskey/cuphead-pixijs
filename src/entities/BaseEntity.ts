import { Container, PointData } from "pixi.js";
import { Gravity } from "../engines/Gravity.ts";
import { Collision } from "../engines/Сollision.ts";

export abstract class BaseEntity extends Container {
  gravity?: Gravity;
  public collision?: Collision;

  protected constructor(collisionEntities?: BaseEntity[]) {
    super();

    if (collisionEntities) {
      this.collision = new Collision(this, collisionEntities);
    }
  }

  protected update() {}

  public executeUpdate(): void {
    const prevPoint: PointData = { x: this.x, y: this.y };

    this.gravity?.update();
    this.collision?.update(prevPoint);
    this.update();
  }
}
