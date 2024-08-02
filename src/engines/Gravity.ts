import { BaseEntity } from "../entities/BaseEntity.ts";

export const movementKeys: Record<string, string[]> = {
  RIGHT: ["arrowright", "d", "в"],
  LEFT: ["arrowleft", "a", "ф"],
};

type IMovement = -1 | 0 | 1;

export class Gravity {
  private readonly acceleration: number;
  public velocityY: number;

  private velocityX: number;
  private readonly maxVelocityX: number;

  private entity: BaseEntity;

  private movement: { x: IMovement } = {
    x: 0,
  };

  private directionContext: { left: IMovement; right: IMovement } = {
    left: 0,
    right: 0,
  };

  constructor(
    entity: BaseEntity,
    acceleration: number,
    maxVelocityX: number,
    velocityY?: number,
    velocityX?: number,
  ) {
    this.acceleration = acceleration;
    this.velocityY = velocityY || 0;
    this.entity = entity;
    this.velocityX = velocityX || 0;
    this.maxVelocityX = maxVelocityX;
  }

  update() {
    this.velocityX = this.movement.x * this.maxVelocityX;
    this.entity.x += this.velocityX;

    this.velocityY += this.acceleration;
    this.entity.y += this.velocityY;
  }

  startLeftMove() {
    this.directionContext.left = -1;
    this.movement.x = -1;
  }

  startRightMove() {
    this.directionContext.right = 1;
    this.movement.x = 1;
  }

  stopLeftMove() {
    this.directionContext.left = 0;
    this.movement.x = this.directionContext.right;
  }

  stopRightMove() {
    this.directionContext.right = 0;
    this.movement.x = this.directionContext.left;
  }
}
