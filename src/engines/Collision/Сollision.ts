import { CollisionBox, ICollisionBox } from '@/engines/Collision/CollisionBox';
import { BaseEntity } from '@/entities/BaseEntity';
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
  collisionEntityHB: ICollisionBox
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
  private readonly entityCollisionBox: ICollisionBox;
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
    entityCollisionBox: CollisionBox,
    collisionEntities: BaseEntity[],
    collisionHandlers: ICollisionHandlers,
    collisionWithScreenBordersHandlers?: ICollisionWithScreenBordersHandlers
  ) {
    this.entityCollisionBox = entityCollisionBox;

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
          this.entityCollisionBox.prevPoint,
          collisionEntity.collisionBox
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
        this.entityCollisionBox.prevPoint
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

    if (
      this.entityCollisionBox.y + this.entityCollisionBox.height >
      window.innerHeight
    ) {
      collisionInfo.bottom = true;
      collisionInfo.isColliding = true;
    }

    if (this.entityCollisionBox.y < 0) {
      collisionInfo.top = true;
      collisionInfo.isColliding = true;
    }

    if (
      this.entityCollisionBox.x + this.entityCollisionBox.width >
      window.innerWidth
    ) {
      collisionInfo.right = true;
      collisionInfo.isColliding = true;
    }

    if (this.entityCollisionBox.x < 0) {
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

    if (
      !this.isCheckAABB(this.entityCollisionBox, collisionEntity.collisionBox)
    ) {
      return collisionInfo;
    }

    const currentY = this.entityCollisionBox.y;
    this.entityCollisionBox.y = this.entityCollisionBox.prevPoint.y;
    if (
      !this.isCheckAABB(this.entityCollisionBox, collisionEntity.collisionBox)
    ) {
      collisionInfo.isColliding = true;
      this.entityCollisionBox.y = currentY;
      if (this.entityCollisionBox.y < collisionEntity.collisionBox.y) {
        collisionInfo.bottom = true;
        return collisionInfo;
      } else {
        collisionInfo.top = true;
        return collisionInfo;
      }
    }

    this.entityCollisionBox.y = currentY;

    const currentX = this.entityCollisionBox.x;
    this.entityCollisionBox.x = this.entityCollisionBox.prevPoint.x;
    if (
      !this.isCheckAABB(this.entityCollisionBox, collisionEntity.collisionBox)
    ) {
      collisionInfo.isColliding = true;
      this.entityCollisionBox.x = currentX;
      if (this.entityCollisionBox.x < collisionEntity.collisionBox.x) {
        collisionInfo.left = true;
        return collisionInfo;
      } else {
        this.entityCollisionBox.x = currentX;
        collisionInfo.right = true;
        return collisionInfo;
      }
    }

    this.entityCollisionBox.x = currentX;

    return collisionInfo;
  }

  isCheckAABB(entityHB: ICollisionBox, collisionEntityHB: ICollisionBox) {
    return (
      entityHB.x + entityHB.width > collisionEntityHB.x &&
      entityHB.x < collisionEntityHB.x + collisionEntityHB.width &&
      entityHB.y + entityHB.height > collisionEntityHB.y &&
      entityHB.y < collisionEntityHB.y + collisionEntityHB.height
    );
  }
}
