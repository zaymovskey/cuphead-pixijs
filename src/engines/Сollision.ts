import { BaseEntity } from '@/entities/BaseEntity.ts';
import { IHitBox } from '@/entities/BaseView.ts';
import { getEntriesFromObj } from '@/utils/getEntriesFromObj';
import { PointData } from 'pixi.js';

interface ICollisionInfo {
  isColliding: boolean;
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
}

export type TypeCollisionHandler = (
  prevPoint: PointData,
  collisionEntityHB: IHitBox
) => void;

export type TypeCollisionWithScreenBordersHandler = (
  prevPoint: PointData
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

interface ICollisionsIsActive {
  screenBorders: boolean;
  collisionEntities: boolean;
}

export class Collision {
  private readonly entityHitBox: IHitBox;
  private collisionEntities: BaseEntity[];
  private readonly collisionHandlers: ICollisionHandlers = {
    top: () => {},
    bottom: () => {},
    left: () => {},
    right: () => {},
  };
  private readonly collisionWithScreenBordersHandlers: ICollisionWithScreenBordersHandlers =
    {
      top: () => {},
      bottom: () => {},
      left: () => {},
      right: () => {},
    };

  public collisionsIsActive: ICollisionsIsActive = {
    screenBorders: false,
    collisionEntities: true,
  };

  constructor(
    entity: BaseEntity,
    collisionEntities: BaseEntity[],
    collisionHandlers: ICollisionHandlers,
    collisionWithScreenBordersHandlers?: ICollisionWithScreenBordersHandlers
  ) {
    this.entityHitBox = entity.view.hitBox;

    this.collisionEntities = collisionEntities;
    getEntriesFromObj(collisionHandlers).forEach(([key, handler]) => {
      this.collisionHandlers[key] = handler;
    });

    if (!collisionWithScreenBordersHandlers) return;
    getEntriesFromObj(collisionWithScreenBordersHandlers).forEach(
      ([key, handler]) => {
        this.collisionWithScreenBordersHandlers[key] = handler;
        this.collisionsIsActive.screenBorders = true;
      }
    );
  }

  getCollisionType(collisionInfo: ICollisionInfo) {
    return getEntriesFromObj(collisionInfo)
      .filter(
        ([key, collisionIsHappened]) =>
          collisionIsHappened && key !== 'isColliding'
      )!
      .map((collisionType) => collisionType[0]) as (keyof ICollisionHandlers)[];
  }

  update() {
    if (this.collisionsIsActive.collisionEntities) {
      this.executeCollisionHandlersWithCollisionEntities();
    }

    if (this.collisionsIsActive.screenBorders) {
      this.executeCollisionHandlersWithScreenBorders();
    }
  }

  executeCollisionHandlersWithCollisionEntities() {
    this.collisionEntities.forEach((collisionEntity) => {
      const collisionInfo = this.getCollisionInfo(collisionEntity);

      if (!collisionInfo.isColliding) {
        return;
      }

      const collisionTypes = this.getCollisionType(collisionInfo);
      collisionTypes.forEach((collisionType) => {
        this.collisionHandlers[collisionType]?.(
          this.entityHitBox.prevPoint,
          collisionEntity.view.hitBox
        );
      });
    });
  }

  executeCollisionHandlersWithScreenBorders() {
    const collisionWithScreenBorderInfo =
      this.checkCollisionWithScreenBorders();

    if (!collisionWithScreenBorderInfo.isColliding) return;

    const collisionTypes = this.getCollisionType(collisionWithScreenBorderInfo);
    collisionTypes.forEach((collisionType) => {
      this.collisionWithScreenBordersHandlers[collisionType]?.(
        this.entityHitBox.prevPoint
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

    if (this.entityHitBox.y + this.entityHitBox.height > window.innerHeight) {
      collisionInfo.bottom = true;
      collisionInfo.isColliding = true;
    }

    if (this.entityHitBox.y < 0) {
      collisionInfo.top = true;
      collisionInfo.isColliding = true;
    }

    if (this.entityHitBox.x + this.entityHitBox.width > window.innerWidth) {
      collisionInfo.right = true;
      collisionInfo.isColliding = true;
    }

    if (this.entityHitBox.x < 0) {
      collisionInfo.left = true;
      collisionInfo.isColliding = true;
    }

    return collisionInfo;
  }

  getCollisionInfo(collisionEntity: BaseEntity): ICollisionInfo {
    const collisionInfo: ICollisionInfo = {
      top: false,
      bottom: false,
      right: false,
      left: false,
      isColliding: false,
    };

    if (!this.isCheckAABB(this.entityHitBox, collisionEntity.view.hitBox)) {
      return collisionInfo;
    }

    const currentY = this.entityHitBox.y;
    this.entityHitBox.y = this.entityHitBox.prevPoint.y;
    if (!this.isCheckAABB(this.entityHitBox, collisionEntity.view.hitBox)) {
      collisionInfo.isColliding = true;
      this.entityHitBox.y = currentY;
      if (this.entityHitBox.y < collisionEntity.view.hitBox.y) {
        collisionInfo.bottom = true;
        return collisionInfo;
      } else {
        collisionInfo.top = true;
        return collisionInfo;
      }
    }

    this.entityHitBox.y = currentY;

    const currentX = this.entityHitBox.x;
    this.entityHitBox.x = this.entityHitBox.prevPoint.x;
    if (!this.isCheckAABB(this.entityHitBox, collisionEntity.view.hitBox)) {
      collisionInfo.isColliding = true;
      this.entityHitBox.x = currentX;
      if (this.entityHitBox.x < collisionEntity.view.hitBox.x) {
        collisionInfo.left = true;
        return collisionInfo;
      } else {
        this.entityHitBox.x = currentX;
        collisionInfo.right = true;
        return collisionInfo;
      }
    }

    this.entityHitBox.x = currentX;

    return collisionInfo;
  }

  isCheckAABB(entityHB: IHitBox, collisionEntityHB: IHitBox) {
    return (
      entityHB.x + entityHB.width > collisionEntityHB.x &&
      entityHB.x < collisionEntityHB.x + collisionEntityHB.width &&
      entityHB.y + entityHB.height > collisionEntityHB.y &&
      entityHB.y < collisionEntityHB.y + collisionEntityHB.height
    );
  }
}
