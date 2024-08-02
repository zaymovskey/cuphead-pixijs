import { BaseEntity } from "../entities/BaseEntity.ts";

export class Gravity {
  private readonly acceleration: number;
  public velocityY: number;
  private velocityX: number;
  private readonly maxVelocityX: number;
  private entity: BaseEntity;

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
    this.velocityX = this.maxVelocityX;
    this.entity.x += this.velocityX;

    this.velocityY += this.acceleration;
    this.entity.y += this.velocityY;
  }
}
