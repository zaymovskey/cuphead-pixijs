import { BaseEntity } from "../entities/BaseEntity.ts";
import { PointData } from "pixi.js";
import { getEntriesFromObj } from "../utils/getEntriesFromObj.ts";

interface ICollisionInfo {
  isColliding: boolean;
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
}

export type TypeCollisionHandler = (
  prevPoint: PointData,
  collisionEntity: BaseEntity,
) => void;

export interface ICollisionHandlers {
  top?: TypeCollisionHandler;
  bottom?: TypeCollisionHandler;
  left?: TypeCollisionHandler;
  right?: TypeCollisionHandler;
}

export class Collision {
  private readonly entity: BaseEntity;
  private collisionEntities: BaseEntity[];
  private readonly collisionHandlers: ICollisionHandlers = {
    top: () => {},
    bottom: () => {},
    left: () => {},
    right: () => {},
  };
  public prevPoint: PointData = { x: 0, y: 0 };

  constructor(
    entity: BaseEntity,
    collisionEntities: BaseEntity[],
    collisionHandlers: ICollisionHandlers,
  ) {
    this.entity = entity;
    this.collisionEntities = collisionEntities;

    getEntriesFromObj(collisionHandlers).forEach(([key, handler]) => {
      this.collisionHandlers[key] = handler;
    });
  }

  update() {
    this.collisionEntities.forEach((collisionEntity) => {
      const collisionInfo = this.checkCollision(collisionEntity);

      if (!collisionInfo.isColliding) return;

      if (collisionInfo.top) {
        this.collisionHandlers.top?.(this.prevPoint, collisionEntity);
      }
      if (collisionInfo.bottom) {
        this.collisionHandlers.bottom?.(this.prevPoint, collisionEntity);
      }
      if (collisionInfo.left) {
        this.collisionHandlers.left?.(this.prevPoint, collisionEntity);
      }
      if (collisionInfo.right) {
        this.collisionHandlers.right?.(this.prevPoint, collisionEntity);
      }
    });
  }

  checkCollision(collisionEntity: BaseEntity): ICollisionInfo {
    const collisionInfo: ICollisionInfo = {
      top: false,
      bottom: false,
      right: false,
      left: false,
      isColliding: false,
    };

    if (!this.isCheckAABB(this.entity, collisionEntity)) {
      return collisionInfo;
    }

    const currentY = this.entity.y;
    this.entity.y = this.prevPoint.y;
    if (!this.isCheckAABB(this.entity, collisionEntity)) {
      collisionInfo.isColliding = true;
      if (this.entity.y < collisionEntity.y) {
        collisionInfo.bottom = true;
        return collisionInfo;
      } else {
        collisionInfo.top = true;
        return collisionInfo;
      }
    }

    this.entity.y = currentY;
    this.entity.x = this.prevPoint.x;
    if (!this.isCheckAABB(this.entity, collisionEntity)) {
      collisionInfo.isColliding = true;
      if (this.entity.x < collisionEntity.x) {
        collisionInfo.left = true;
        return collisionInfo;
      } else {
        collisionInfo.right = true;
        return collisionInfo;
      }
    }

    return collisionInfo;
  }

  isCheckAABB(entity: BaseEntity, collisionEntity: BaseEntity) {
    return (
      entity.x + entity.width > collisionEntity.x &&
      entity.x < collisionEntity.x + collisionEntity.width &&
      entity.y + entity.height > collisionEntity.y &&
      entity.y < collisionEntity.y + collisionEntity.height
    );
  }
}
