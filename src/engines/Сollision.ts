import { BaseEntity } from "../entities/BaseEntity.ts";
import { Container, PointData } from "pixi.js";

export class Collision {
  private readonly entity: BaseEntity;
  private collisionEntities: BaseEntity[];

  constructor(entity: BaseEntity, collisionEntities: BaseEntity[]) {
    this.entity = entity;
    this.collisionEntities = collisionEntities;
  }

  update(prevPoint: PointData) {
    this.collisionEntities.forEach((collisionEntity) => {
      if (!this.isCheckAABB(this.entity, collisionEntity)) {
        return;
      }

      const currY = this.entity.y;
      this.entity.y = prevPoint.y;

      if (!this.isCheckAABB(this.entity, collisionEntity)) {
        this.entity.y =
          this.entity.y +
          (collisionEntity.y - (this.entity.y + this.entity.height));

        if (this.entity.gravity) {
          this.entity.gravity.velocityY = 0;

          if (this.entity.state) {
            this.entity.state = "stay";
          }
        }
        return;
      }

      this.entity.y = currY;
      this.entity.x = prevPoint.x;
    });
  }

  isCheckAABB(entity: Container, collisionEntity: Container) {
    return (
      entity.x + entity.width > collisionEntity.x &&
      entity.x < collisionEntity.x + collisionEntity.width &&
      entity.y + entity.height > collisionEntity.y &&
      entity.y < collisionEntity.y + collisionEntity.height
    );
  }
}
