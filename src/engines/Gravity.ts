import { BaseEntity } from "../entities/BaseEntity.ts";

export class Gravity {
  private readonly acceleration: number;
  public velocityY: number;

  private entity: BaseEntity;

  constructor(entity: BaseEntity, acceleration: number, velocityY?: number) {
    this.acceleration = acceleration;
    this.velocityY = velocityY || 0;
    this.entity = entity;
  }

  update() {
    this.velocityY += this.acceleration;
    this.entity.y += this.velocityY;
  }
}
