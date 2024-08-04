import { BaseEntity } from "@/entities/BaseEntity.ts";
import { PointData } from "pixi.js";
import { getEntriesFromObj } from "@/utils/getEntriesFromObj";

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

export type TypeCollisionWithScreenBordersHandler = (
  prevPoint: PointData,
) => void;

export interface ICollisionHandlers {
  top?: TypeCollisionHandler;
  bottom?: TypeCollisionHandler;
  left?: TypeCollisionHandler;
  right?: TypeCollisionHandler;
}

export interface ICollisionWithScreenBordersHandlers {
  top?: TypeCollisionWithScreenBordersHandler;
  bottom?: TypeCollisionWithScreenBordersHandler;
  left?: TypeCollisionWithScreenBordersHandler;
  right?: TypeCollisionWithScreenBordersHandler;
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
  private isCheckCollisionWithScreenBorders: boolean = false;
  private readonly collisionWithScreenBordersHandlers: ICollisionWithScreenBordersHandlers =
    {
      top: () => {},
      bottom: () => {},
      left: () => {},
      right: () => {},
    };

  constructor(
    entity: BaseEntity,
    collisionEntities: BaseEntity[],
    collisionHandlers: ICollisionHandlers,
    collisionWithScreenBordersHandlers?: ICollisionWithScreenBordersHandlers,
  ) {
    this.entity = entity;
    this.collisionEntities = collisionEntities;
    getEntriesFromObj(collisionHandlers).forEach(([key, handler]) => {
      this.collisionHandlers[key] = handler;
    });

    if (!collisionWithScreenBordersHandlers) return;
    getEntriesFromObj(collisionWithScreenBordersHandlers).forEach(
      ([key, handler]) => {
        this.collisionWithScreenBordersHandlers[key] = handler;
        this.isCheckCollisionWithScreenBorders = true;
      },
    );
  }

  getCollisionType(collisionInfo: ICollisionInfo) {
    return getEntriesFromObj(collisionInfo)
      .filter(
        ([key, collisionIsHappened]) =>
          collisionIsHappened && key !== "isColliding",
      )!
      .map((collisionType) => collisionType[0]) as (keyof ICollisionHandlers)[];
  }

  update() {
    this.collisionEntities.forEach((collisionEntity) => {
      const collisionInfo = this.checkCollision(collisionEntity);

      if (!collisionInfo.isColliding) return;

      const collisionTypes = this.getCollisionType(collisionInfo);
      collisionTypes.forEach((collisionType) => {
        this.collisionHandlers[collisionType]?.(
          this.entity.prevPoint,
          collisionEntity,
        );
      });
    });

    if (!this.isCheckCollisionWithScreenBorders) return;

    const collisionWithScreenBorderInfo =
      this.checkCollisionWithScreenBorders();

    if (!collisionWithScreenBorderInfo.isColliding) return;

    const collisionTypes = this.getCollisionType(collisionWithScreenBorderInfo);
    collisionTypes.forEach((collisionType) => {
      this.collisionWithScreenBordersHandlers[collisionType]?.(
        this.entity.prevPoint,
      );
    });
  }

  checkCollisionWithScreenBorders() {
    const collisionInfo: ICollisionInfo = {
      top: false,
      bottom: false,
      right: false,
      left: false,
      isColliding: false,
    };

    if (this.entity.y + this.entity.height > window.innerHeight) {
      collisionInfo.bottom = true;
      collisionInfo.isColliding = true;
    }

    if (this.entity.y < 0) {
      collisionInfo.top = true;
      collisionInfo.isColliding = true;
    }

    if (this.entity.x + this.entity.width > window.innerWidth) {
      collisionInfo.right = true;
      collisionInfo.isColliding = true;
    }

    if (this.entity.x < 0) {
      collisionInfo.left = true;
      collisionInfo.isColliding = true;
    }

    return collisionInfo;
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
    this.entity.y = this.entity.prevPoint.y;
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
    this.entity.x = this.entity.prevPoint.x;
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
